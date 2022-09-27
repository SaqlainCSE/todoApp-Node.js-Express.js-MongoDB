const mongoose = require('mongoose');
const userSchema = require('../schemas/userSchema');
const User = new mongoose.model('User', userSchema);


module.exports = User;