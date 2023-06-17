const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cats' }],
  googleId: String,
});

const User = mongoose.model('Users', userSchema);

module.exports = User;  