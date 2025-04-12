const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');


const signupController = async (req, res) => {
  
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: 'Signup successful' });
  } catch (err) {
    
    res.status(500).json({ msg: 'Signup failed', error: err.message });
  }
};


const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Login failed', error: err.message });
  }
};

const allController = async (req, res) => {
  try {
    const users = await User.find({}, 'email'); // just get email field
    res.json(users);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const family = async (req, res) => {
  const { userEmail } = req.query;
  const user = await User.findOne({ email: userEmail });
  if (!user) return res.status(404).send({ error: 'User not found' });
  res.send({ family: user.family || [] });
}

const addFamily = async (req, res) => {
  const { userEmail, familyEmail } = req.body;
  const user = await User.findOne({ email: userEmail });
  if (!user) return res.status(404).send({ error: 'User not found' });

  if (!user.family.includes(familyEmail)) {
    user.family.push(familyEmail);
    await user.save();
  }

  res.send({ family: user.family });
}

const sos = async (req, res) => {
  
  const { userEmail, location } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user || !user.family || user.family.length === 0) {
      return res.status(404).json({ error: 'No family contacts found.' });
    }
    const locationMessage = location
    ? `Their location is: ${location}`
    : '';
    
    const emailBody = `
    Hi, this is an <strong>emergency alert</strong> from <b>${userEmail}</b>.<br><br>
    They triggered an SOS alert.<br>
    ${locationMessage ? '<br>' + locationMessage : ''}
    <br><br>Please check on them immediately.
    `;
    
    const resend = new Resend('re_8vs3C3fr_AsvUBfCHRYF46tvM3htHw7i5');
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: user.family, 
      subject: '🚨 Emergency Alert!',
      html: emailBody,
    });
    
    console.log(user.family);
    res.json({ success: true, info: result });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send SOS alert.' });
  }
}

module.exports = {
  signupController,
  loginController,
  allController,
  family,
  addFamily,
  sos
};
