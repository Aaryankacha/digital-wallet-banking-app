const mongoose = require('mongoose');

const localMongoURI = 'mongodb://127.0.0.1:27017/digital_wallet_db';
const connectOptions = { serverSelectionTimeoutMS: 10000 };

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || localMongoURI;
  try {
    await mongoose.connect(uri, connectOptions);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
