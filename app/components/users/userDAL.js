const { User } = require('./userModel');
const { Post } = require('../posts');

class UserDAL {
  static async create(user) {
    return User.create(user);
  }

  static async likePost(userId, postId) {
    const user = User.findOneAndUpdate(
      { _id: userId },
      { $push: { likedPosts: postId } },
      { new: true, populate: 'likedPosts' }
    );

    await Post.incLikes(postId);

    return user;
  }
}

module.exports = UserDAL;
