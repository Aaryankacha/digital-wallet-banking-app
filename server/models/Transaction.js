const mongoose = require('mongoose');

const CATEGORIES = [
  'food', 'shopping', 'rent', 'travel',
  'utilities', 'health', 'education', 'entertainment', 'other',
];

const TransactionSchema = new mongoose.Schema(
  {
    senderEmail:   { type: String, required: true, lowercase: true },
    receiverEmail: { type: String, required: true, lowercase: true },
    amount:        { type: Number, required: true, min: 1 },
    category:      { type: String, enum: CATEGORIES, default: 'other' },
    note:          { type: String, default: '', maxlength: 200 },
    type:          { type: String, enum: ['send', 'request'], default: 'send' },
    status:        { type: String, enum: ['completed', 'pending', 'declined'], default: 'completed' },
    date:          { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);
