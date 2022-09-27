const mongoose = require('mongoose');
const todoSchema = require('../schemas/todoSchema');
const Todo = new mongoose.model('Todo', todoSchema);


module.exports = Todo;