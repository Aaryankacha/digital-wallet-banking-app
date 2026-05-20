const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    userEmail: { type: String, required: true, unique: true, lowercase: true },
    balance:   { type: Number, default: 1000, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wallet', WalletSchema);
