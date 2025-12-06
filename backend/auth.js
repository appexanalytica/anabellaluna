const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const User = require('./models/User');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'please-change-this-secret';

router.post('/register', async (req, res) => {
  const { username, password, role } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  if (typeof password === 'string' && password.length < 6) return res.status(400).json({ error: 'password too short (min 6 chars)' });
  try {
    const existing = await User.findOne({ username }).exec();
    if (existing) return res.status(409).json({ error: 'username already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password_hash: hash, role: role || 'agent' });
    await user.save();
    res.json({ id: user._id, username: user.username });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  try {
    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    const token = jwt.sign({ sub: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Quick endpoint to inspect token payload
router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'missing token' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'invalid token format' });
  const token = parts[1];
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: 'invalid token' });
    return res.json({ user: payload });
  });
});

// Middleware
function authenticateToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'missing token' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'invalid token format' });
  const token = parts[1];
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: 'invalid token' });
    req.user = payload;
    next();
  });
}

// Role-based middleware: require a specific role (or admin)
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'missing token' });
    const userRole = req.user.role || 'agent';
    if (userRole === role || userRole === 'admin') return next();
    return res.status(403).json({ error: 'forbidden - insufficient role' });
  };
}

module.exports = { router, authenticateToken, requireRole };
