require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

const test = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digital_wallet_db';
  console.log('Using connection URI:', uri);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('🚀 SUCCESS: Mongoose connected successfully!');
    
    // Test a simple find query
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ FAILURE: Mongoose connection failed!');
    console.error(err);
    process.exit(1);
  }
};

test();
