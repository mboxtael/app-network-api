const { Post } = require('./postModel');

class PostDAL {
  static async create(post) {
    return Post.create(post);
  }

  static async all() {
    return Post.find({});
  }

  static async find(id) {
    return Post.findById(id);
  }
}

module.exports = PostDAL;
