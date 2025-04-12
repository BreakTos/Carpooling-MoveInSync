const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  senderMail: { type: String, required: true },
  receiverMail: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', chatSchema);
