const express     = require('express');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// GET /api/transactions – all transactions for logged-in user
router.get('/', async (req, res) => {
  try {
    const email = req.user.email;
    const { category, type } = req.query;

    const filter = {
      $or: [{ senderEmail: email }, { receiverEmail: email }],
    };
    if (category) filter.category = category;
    if (type)     filter.type     = type;

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

module.exports = router;
