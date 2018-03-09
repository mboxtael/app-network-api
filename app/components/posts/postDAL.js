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

  static async findAndIncViews(id) {
    return Post.findOneAndUpdate(
      { _id: id },
      { $inc: { views: 1 } },
      { new: true }
    );
  }

  static async addComment(id, comment) {
    const post = await Post.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true }
    );
    return post.comments[post.comments.length - 1];
  }
}

module.exports = PostDAL;
