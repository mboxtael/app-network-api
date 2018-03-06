const mongoose = require('mongoose');

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
  tags: [String]
});
const PostModel = mongoose.model('posts', postSchema);

module.exports = {
  postSchema,
  Post: PostModel
};
