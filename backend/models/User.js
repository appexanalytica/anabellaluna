const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password_hash: String,
  role: { type: String, default: 'agent' }
});

module.exports = mongoose.model('User', UserSchema);
