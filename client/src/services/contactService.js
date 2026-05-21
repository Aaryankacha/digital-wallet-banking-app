import api from './api';

/** Retrieve contact list for logged-in user */
export const getContacts = () => api.get('/api/contacts');

/** Add a new contact */
export const addContact = (data) => api.post('/api/contacts', data);

/** Remove a contact by its ID */
export const removeContact = (id) => api.delete(`/api/contacts/${id}`);
