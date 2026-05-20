import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContacts, addContact, removeContact } from '../services/contactService.js';
import Navbar from '../components/common/Navbar.jsx';

export default function ContactsPage() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  
  // General feedback
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchContactsList = async () => {
    try {
      setLoading(true);
      const res = await getContacts();
      setContacts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactsList();
  }, []);

  const handleAddContact = async (e) => {
    e.preventDefault();
    setModalError('');
    if (!newEmail.trim()) {
      setModalError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      setModalError('Enter a valid email address');
      return;
    }

    setModalLoading(true);
    try {
      await addContact({ contactEmail: newEmail.trim(), nickname: newNickname.trim() });
      setSuccess('Contact added successfully! 🎉');
      setNewEmail('');
      setNewNickname('');
      setShowAddModal(false);
      fetchContactsList();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to add contact');
    } finally {
      setModalLoading(false);
    }
  };

  const handleRemoveContact = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from your contacts?`)) return;

    try {
      await removeContact(id);
      setSuccess(`Removed ${name} from your list`);
      fetchContactsList();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove contact');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Filter contacts by search query
  const filteredContacts = contacts.filter((c) => {
    const term = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.contactEmail.toLowerCase().includes(term) ||
      (c.nickname && c.nickname.toLowerCase().includes(term))
    );
  });

  // Get initials for profile picture avatars
  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Color mapping based on contact email so avatars have distinct, pretty colors
  const getAvatarColor = (email) => {
    const colors = [
      'from-blue-500 to-indigo-600 shadow-blue-500/20',
      'from-purple-500 to-pink-600 shadow-purple-500/20',
      'from-emerald-400 to-teal-600 shadow-emerald-500/20',
      'from-rose-400 to-red-600 shadow-rose-500/20',
      'from-amber-400 to-orange-500 shadow-amber-500/20',
    ];
    let sum = 0;
    for (let i = 0; i < email.length; i++) sum += email.charCodeAt(i);
    return colors[sum % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Header & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">People & Contacts 👥</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Save frequent contacts for one-click money sending.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20 transition-all hover:translate-y-[-1px] active:translate-y-0"
          >
            <span>➕</span> Add Contact
          </button>
        </div>

        {/* Global Notifications */}
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400 animate-slide-in">
            <span>✅</span> {success}
          </div>
        )}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 animate-slide-in">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Search */}
        <div className="mb-6 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by name, nickname, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Contacts Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-5 flex flex-col items-center gap-3 animate-pulse">
                <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-dark-border" />
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-dark-border" />
                <div className="h-3 w-32 rounded bg-gray-100 dark:bg-dark-border" />
              </div>
            ))}
          </div>
        ) : filteredContacts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact._id}
                className="group relative card p-5 flex flex-col items-center text-center gap-2 border border-gray-150 hover:border-brand-500 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/send?to=${encodeURIComponent(contact.contactEmail)}`)}
              >
                {/* Delete button (displays on hover) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent navigating
                    handleRemoveContact(contact._id, contact.name);
                  }}
                  title="Remove Contact"
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:bg-dark-card dark:text-gray-500 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors sm:opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>

                {/* Avatar */}
                <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-xl font-black text-white shadow-lg ${getAvatarColor(contact.contactEmail)}`}>
                  {getInitials(contact.name)}
                </div>

                {/* Name & Nickname */}
                <div className="mt-2">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate max-w-[150px]" title={contact.name}>
                    {contact.nickname || contact.name}
                  </h3>
                  {contact.nickname && (
                    <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 truncate max-w-[140px]">
                      {contact.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[150px] mt-0.5">
                    {contact.contactEmail}
                  </p>
                </div>

                {/* Direct payment CTA */}
                <button className="mt-3 w-full rounded-xl bg-brand-500/10 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-500 hover:text-white dark:bg-brand-500/20 dark:text-brand-400 dark:hover:bg-brand-500 dark:hover:text-white transition-all">
                  💸 Pay Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center border border-dashed border-gray-300 dark:border-dark-border">
            <span className="text-4xl block mb-2">🤷‍♂️</span>
            <h3 className="font-bold text-lg">No contacts found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {searchQuery ? "Try searching for a different name or email" : "Start saving your frequent recipients for easier payouts"}
            </p>
          </div>
        )}

        {/* Add Contact Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            
            {/* Modal Content */}
            <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-dark-card border border-gray-100 dark:border-dark-border animate-slide-in">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                ✕
              </button>
              
              <h2 className="text-xl font-extrabold mb-4">Add Saved Contact 👤</h2>
              
              {modalError && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                  <span>⚠️</span> {modalError}
                </div>
              )}
              
              <form onSubmit={handleAddContact} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Contact Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="recipient@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Nickname (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bro, Mom, landlord"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    className="input-field"
                  />
                </div>
                
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold hover:bg-gray-50 dark:border-dark-border dark:bg-dark-border/40 dark:hover:bg-dark-border/80"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="flex-1 rounded-xl bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
                  >
                    {modalLoading ? 'Adding...' : 'Save Contact'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
