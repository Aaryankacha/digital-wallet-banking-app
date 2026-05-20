const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nickname: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

// Ensure a user cannot add the same contact email multiple times
ContactSchema.index({ ownerId: 1, contactEmail: 1 }, { unique: true });

module.exports = mongoose.model('Contact', ContactSchema);
