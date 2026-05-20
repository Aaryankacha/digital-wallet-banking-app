const express     = require('express');
const Wallet      = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All wallet routes require a valid JWT
router.use(authMiddleware);

// GET /api/wallet/balance – get own balance
router.get('/balance', async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userEmail: req.user.email });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
    res.json({ balance: wallet.balance });
  } catch {
    res.status(500).json({ message: 'Error fetching balance' });
  }
});

// POST /api/wallet/send – transfer money
router.post('/send', async (req, res) => {
  try {
    const { receiverEmail, amount, category = 'other', note = '' } = req.body;
    const senderEmail = req.user.email;

    if (amount <= 0) return res.status(400).json({ message: 'Amount must be greater than zero' });
    if (senderEmail === receiverEmail) return res.status(400).json({ message: 'Cannot send to yourself' });

    const senderWallet   = await Wallet.findOne({ userEmail: senderEmail });
    const receiverWallet = await Wallet.findOne({ userEmail: receiverEmail });

    if (!senderWallet || senderWallet.balance < amount)
      return res.status(400).json({ message: 'Insufficient balance' });
    if (!receiverWallet)
      return res.status(404).json({ message: 'Receiver not found' });

    senderWallet.balance   -= amount;
    receiverWallet.balance += amount;
    await senderWallet.save();
    await receiverWallet.save();

    await new Transaction({ senderEmail, receiverEmail, amount, category, note, type: 'send', status: 'completed' }).save();

    res.json({ message: 'Transfer successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing transaction' });
  }
});

// POST /api/wallet/request – request money (creates a pending transaction)
router.post('/request', async (req, res) => {
  try {
    const { targetEmail, amount, category = 'other', note = '' } = req.body;
    const requesterEmail = req.user.email;

    if (amount <= 0) return res.status(400).json({ message: 'Amount must be greater than zero' });

    const targetExists = await Wallet.findOne({ userEmail: targetEmail });
    if (!targetExists) return res.status(404).json({ message: 'User not found' });

    await new Transaction({
      senderEmail: targetEmail,
      receiverEmail: requesterEmail,
      amount,
      category,
      note,
      type: 'request',
      status: 'pending',
    }).save();

    res.status(201).json({ message: 'Money request sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending request' });
  }
});

module.exports = router;
