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

  static async incLikes(id) {
    return Post.findOneAndUpdate({ _id: id }, { $inc: { likes: 1 } });
  }

  static async decLikes(id) {
    return Post.findOneAndUpdate({ _id: id }, { $inc: { likes: -1 } });
  }
}

module.exports = PostDAL;
