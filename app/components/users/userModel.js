/* eslint max-len: ["error", {"ignoreComments": true}] */
/* eslint no-param-reassign: ["error", {"props": true, "ignorePropertyModificationsFor": ["ret"] }] */

const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
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
userSchema.pre('save', true, async function hashPassword(next, done) {
  next();
  this.password = await bcrypt.hash(this.password, 8);
  done();
});
userSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model('users', userSchema);

module.exports = {
  User,
  schema: userSchema
};
