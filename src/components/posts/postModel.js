const mongoose = require('mongoose');
const { isURL } = require('validator');

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  tags: [String],
  link: {
    type: String,
    required: true,
    validate: {
      validator: v => isURL(v),
      message: "{VALUE} isn't a valid url"
    }
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  comments: [{
    type: commentSchema
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  }
});

const PostModel = mongoose.model('posts', postSchema);

module.exports = {
  postSchema,
  Post: PostModel
};
