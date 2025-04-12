const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/chatController');

router.post('/send', sendMessage);
router.get('/messages', getMessages);

module.exports = router;
