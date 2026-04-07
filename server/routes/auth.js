const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, 'your-secret-key', { expiresIn: '7d' });
};

// @POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }

    user = new User({ firstName, lastName, email, password });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Регистрация успешна',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Неверный email' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Неверный пароль' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Вход успешен',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
