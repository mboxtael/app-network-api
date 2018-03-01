const mongoose = require('mongoose');
const { Schema } = mongoose;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

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
    required: true,
    select: false
  },
  gender: {
    type: String
  },
  birthdate: Date
});
userSchema.pre('save', true, async function(next, done) {
  next();
  this.password = await bcrypt.hash(this.password, 8);
  done();
});
userSchema.set('toObject', {
  transform: (doc, ret, options) => {
    delete ret.password;
    return ret;
  }
});

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;
