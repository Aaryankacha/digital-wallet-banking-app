const express = require('express');
const Contact = require('../models/Contact');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All contact routes require auth
router.use(authMiddleware);

// GET /api/contacts - Retrieve user's contact list
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find({ ownerId: req.user.id }).sort({ nickname: 1, name: 1 });
    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ message: 'Error fetching contact list' });
  }
});

// POST /api/contacts - Add a new contact
router.post('/', async (req, res) => {
  try {
    const { contactEmail, nickname = '' } = req.body;
    const ownerId = req.user.id;
    const ownerEmail = req.user.email;

    if (!contactEmail) {
      return res.status(400).json({ message: 'Contact email is required' });
    }

    const targetEmail = contactEmail.toLowerCase().trim();

    if (ownerEmail === targetEmail) {
      return res.status(400).json({ message: 'You cannot add yourself as a contact' });
    }

    // 1. Check if the target user actually exists in PayWave
    const targetUser = await User.findOne({ email: targetEmail });
    if (!targetUser) {
      return res.status(404).json({ message: 'User does not exist on PayWave' });
    }

    // 2. Check if contact already exists in owner's list
    const existingContact = await Contact.findOne({ ownerId, contactEmail: targetEmail });
    if (existingContact) {
      return res.status(400).json({ message: 'Contact already exists in your list' });
    }

    // 3. Create the contact
    const newContact = new Contact({
      ownerId,
      contactEmail: targetEmail,
      name: targetUser.name,
      nickname: nickname.trim(),
    });

    await newContact.save();
    res.status(201).json({ message: 'Contact added successfully', contact: newContact });
  } catch (err) {
    console.error('Error adding contact:', err);
    res.status(500).json({ message: 'Error adding contact' });
  }
});

// DELETE /api/contacts/:id - Remove a contact
router.delete('/:id', async (req, res) => {
  try {
    const ownerId = req.user.id;
    const contactId = req.params.id;

    const contact = await Contact.findOneAndDelete({ _id: contactId, ownerId });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact removed successfully' });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).json({ message: 'Error deleting contact' });
  }
});

module.exports = router;
