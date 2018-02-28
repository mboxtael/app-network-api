const mongoose = require('mongoose');
const { Schema } = mongoose;
const { isEmail } = require('validator');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: v => isEmail(v),
      message: "{VALUE} isn't a valid email"
    }
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  birthdate: {
    type: String,
    required: true
  }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
