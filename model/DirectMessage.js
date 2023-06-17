const mongoose = require('mongoose');

const directMessageSchema = new mongoose.Schema({
  catId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cat',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const DirectMessage = mongoose.model('directmessages', directMessageSchema);

module.exports = DirectMessage;