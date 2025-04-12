const Chat = require('../models/Chat');

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { senderMail, receiverMail, text } = req.body;
    if (!senderMail || !receiverMail || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const chat = new Chat({ senderMail, receiverMail, text });
    await chat.save();
    res.status(201).json({ message: 'Message sent' });
  } catch (err) {
    console.error("Send chat error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch messages between two users
const getMessages = async (req, res) => {
  try {
    const { userA, userB } = req.query;
    if (!userA || !userB) {
      return res.status(400).json({ error: 'Missing user parameters' });
    }

    const messages = await Chat.find({
      $or: [
        { senderMail: userA, receiverMail: userB },
        { senderMail: userB, receiverMail: userA },
      ]
    })
    .sort({ timestamp: -1 })
    .limit(20);

    res.json({ messages: messages.reverse() }); // So newest are at the bottom
  } catch (err) {
    console.error("Get chat error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { sendMessage, getMessages };
