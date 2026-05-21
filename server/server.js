const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: [
    'https://digital-wallet-banking-app-uh23.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(bodyParser.json());

// MongoDB Connection
const localMongoURI = 'mongodb://127.0.0.1:27017/digital_wallet_db';
const atlasHost = process.env.MONGODB_HOST || 'cluster0.3qee7rh.mongodb.net';
const atlasUser = process.env.MONGODB_USER || 'tylerriley001_db_user';
const atlasPassword = process.env.MONGODB_PASSWORD;
const atlasDB = process.env.MONGODB_DB || 'digital_wallet_db';
const envMongoURI = process.env.MONGODB_URI;

let mongoURI;
let connectionSource;
if (envMongoURI) {
    mongoURI = envMongoURI;
    connectionSource = 'MONGODB_URI';
} else if (atlasPassword) {
    mongoURI = `mongodb+srv://${encodeURIComponent(atlasUser)}:${encodeURIComponent(atlasPassword)}@${atlasHost}/${atlasDB}?retryWrites=true&w=majority`;
    connectionSource = 'Atlas env vars';
} else {
    mongoURI = localMongoURI;
    connectionSource = 'local MongoDB';
}

const connectOptions = {
    serverSelectionTimeoutMS: 10000
};

console.log(`Attempting MongoDB connection using ${connectionSource}`);

(async () => {
    try {
        await mongoose.connect(mongoURI, connectOptions);
    } catch (err) {
        console.log('Mongoose connection error:', err);
        if (envMongoURI || atlasPassword) {
            console.log('Atlas auth failed; falling back to local MongoDB...');
            try {
                await mongoose.connect(localMongoURI, connectOptions);
                connectionSource = 'local MongoDB';
                console.log('Connected to local MongoDB on fallback');
            } catch (localErr) {
                console.log('Local MongoDB fallback also failed:', localErr);
                process.exit(1);
            }
        } else {
            process.exit(1);
        }
    }
})();

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});
// --- Auth APIs ---

// POST /register: Create a new user and assign initial wallet balance
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const newUser = new User({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();

        // Create Wallet with initial balance of 1000
        const newWallet = new Wallet({
            userId: savedUser._id,
            userEmail: savedUser.email,
            balance: 1000
        });
        await newWallet.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /login: Verify credentials and return user info
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.json({
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// --- Transaction APIs ---

// GET /api/balance: Get current wallet balance for a user
app.get('/api/balance/:email', async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userEmail: req.params.email });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        res.json({ balance: wallet.balance });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching balance' });
    }
});

// POST /api/sendMoney: Transfer coins between users
app.post('/api/sendMoney', async (req, res) => {
    try {
        const { senderEmail, receiverEmail, amount } = req.body;

        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than zero' });
        }

        // 1. Check sender balance
        const senderWallet = await Wallet.findOne({ userEmail: senderEmail });
        if (!senderWallet || senderWallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // 2. Check if receiver exists
        const receiverWallet = await Wallet.findOne({ userEmail: receiverEmail });
        if (!receiverWallet) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        // 3. Perform transfer
        senderWallet.balance -= amount;
        receiverWallet.balance += amount;

        await senderWallet.save();
        await receiverWallet.save();

        // 4. Record transaction
        const newTransaction = new Transaction({
            senderEmail,
            receiverEmail,
            amount,
            date: new Date()
        });
        await newTransaction.save();

        res.json({ message: 'Transfer successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error processing transaction' });
    }
});

// GET /api/transactions/:email: Fetch history for a user
app.get('/api/transactions/:email', async (req, res) => {
    try {
        const email = req.params.email;
        // Find transactions where user is either sender or receiver
        const transactions = await Transaction.find({
            $or: [{ senderEmail: email }, { receiverEmail: email }]
        }).sort({ date: -1 });

        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
