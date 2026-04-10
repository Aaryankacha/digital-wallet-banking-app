const mongoose = require('mongoose');

// Wallet schema stores the current balance for each user
// Linked to User by userId
const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String, required: true, unique: true },
    balance: { type: Number, default: 1000 } // Initial balance of 1000 coins
});

module.exports = mongoose.model('Wallet', walletSchema);
