require('dotenv').config({ path: '../.env' }); // load dotenv from parent folder or current folder
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Contact = require('../models/Contact');
const connectDB = require('../config/db');

const DUMMY_USERS = [
  { name: 'Sarah Connor', email: 'sarah@paywave.com', balance: 50000 },
  { name: 'Bruce Wayne', email: 'bruce@paywave.com', balance: 1000000 },
  { name: 'Tony Stark', email: 'tony@paywave.com', balance: 500000 },
];

const CATEGORIES = [
  'food', 'shopping', 'rent', 'travel',
  'utilities', 'health', 'education', 'entertainment', 'other',
];

const NOTES = {
  food: ['Dinner with friends', 'Uber Eats', 'Grocery shopping', 'Starbucks coffee', 'Lunch at pizzeria'],
  shopping: ['Amazon purchase', 'New sneakers', 'Tech gadgets', 'Clothing store', 'Birthday gift'],
  rent: ['Monthly apartment rent', 'Co-working desk fee'],
  travel: ['Flight tickets', 'Uber ride', 'Gas station', 'Train ticket', 'Hotel booking'],
  utilities: ['Electricity bill', 'Wi-Fi internet', 'Water bill', 'Mobile recharge'],
  health: ['Gym membership', 'Pharmacy store', 'Doctor consultation', 'Protein powder'],
  education: ['Udemy course', 'Books purchase', 'Tech conference ticket'],
  entertainment: ['Netflix subscription', 'Movie tickets', 'Spotify premium', 'Gaming console game', 'Concert ticket'],
  other: ['Miscellaneous', 'Repaid loan', 'Pocket money', 'Pocket cash'],
};

const seed = async () => {
  try {
    console.log('Connecting to database...');
    // Set env var just in case
    process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digital_wallet_db';
    await connectDB();

    console.log('Seeding dummy users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const seededDummyUsers = [];

    for (const dummy of DUMMY_USERS) {
      let user = await User.findOne({ email: dummy.email });
      if (!user) {
        user = new User({
          name: dummy.name,
          email: dummy.email,
          password: hashedPassword,
        });
        await user.save();
        console.log(`Created dummy user: ${dummy.name}`);
      }

      let wallet = await Wallet.findOne({ userEmail: dummy.email });
      if (!wallet) {
        wallet = new Wallet({
          userId: user._id,
          userEmail: user.email,
          balance: dummy.balance,
        });
        await wallet.save();
      }
      seededDummyUsers.push(user);
    }

    // Get all real users (excluding dummy users)
    const realUsers = await User.find({ email: { $nin: DUMMY_USERS.map(d => d.email) } });
    if (realUsers.length === 0) {
      console.log('No real users found in DB. Please register a user in the UI first, or run this script again after registration.');
    }

    console.log(`Found ${realUsers.length} real users. Generating contacts and history...`);

    for (const realUser of realUsers) {
      // 1. Add dummy users to real user's contacts
      for (const dummy of seededDummyUsers) {
        const contactExists = await Contact.findOne({ ownerId: realUser._id, contactEmail: dummy.email });
        if (!contactExists) {
          await new Contact({
            ownerId: realUser._id,
            contactEmail: dummy.email,
            name: dummy.name,
            nickname: dummy.name.split(' ')[0], // first name as nickname
          }).save();
          console.log(`Added contact ${dummy.name} for ${realUser.email}`);
        }
      }

      // 2. Generate transaction history over the last 6 months
      // Let's clear old transactions for this user first to prevent clutter
      await Transaction.deleteMany({
        $or: [
          { senderEmail: realUser.email },
          { receiverEmail: realUser.email }
        ]
      });

      console.log(`Generating transactions for ${realUser.email}...`);
      const now = new Date();
      const transactionsToInsert = [];

      // Generate 40 transactions over 6 months
      for (let i = 0; i < 45; i++) {
        // Random days ago between 1 and 180 days
        const daysAgo = Math.floor(Math.random() * 180) + 1;
        const txnDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

        // Decide category
        const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        
        // Pick appropriate note
        const noteList = NOTES[category];
        const note = noteList[Math.floor(Math.random() * noteList.length)];

        // Decide sender and receiver
        const isOutgoing = Math.random() > 0.35; // 65% outgoing spending, 35% incoming
        const dummyUser = seededDummyUsers[Math.floor(Math.random() * seededDummyUsers.length)];

        let senderEmail, receiverEmail, amount;

        if (isOutgoing) {
          senderEmail = realUser.email;
          receiverEmail = dummyUser.email;
          // Outgoing amount varies based on category
          if (category === 'rent') {
            amount = Math.floor(Math.random() * 5000) + 5000; // 5000 to 10000
          } else if (category === 'shopping' || category === 'travel') {
            amount = Math.floor(Math.random() * 2000) + 200; // 200 to 2200
          } else if (category === 'utilities' || category === 'entertainment') {
            amount = Math.floor(Math.random() * 800) + 100; // 100 to 900
          } else {
            amount = Math.floor(Math.random() * 400) + 50; // 50 to 450
          }
        } else {
          senderEmail = dummyUser.email;
          receiverEmail = realUser.email;
          // Incoming amount (salary or payment)
          amount = Math.floor(Math.random() * 4000) + 500;
        }

        transactionsToInsert.push({
          senderEmail,
          receiverEmail,
          amount,
          category,
          note,
          type: 'send',
          status: 'completed',
          date: txnDate,
        });
      }

      await Transaction.insertMany(transactionsToInsert);
      console.log(`Successfully generated 45 transactions for ${realUser.email}!`);
    }

    console.log('Seeding completed successfully! 🎉');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seed();
