const { User } = require('./userModel');
const { Post } = require('../posts');

class UserDAL {
  static async create(user) {
    return User.create(user);
  }

  static async likePost(userId, postId) {
    const user = await this._likedPosts(userId, postId, '$push');
    await Post.incLikes(postId);
    return user;
  }

  static async removeLikedPost(userId, postId) {
    const user = await this._likedPosts(userId, postId, '$pull');
    await Post.decLikes(postId);
    return user;
  }

  static async _likedPosts(userId, postId, action) {
    return User.findOneAndUpdate(
      { _id: userId },
      { [action]: { likedPosts: postId } },
      { new: true, populate: 'likedPosts' }
    );
  }
}

module.exports = UserDAL;
