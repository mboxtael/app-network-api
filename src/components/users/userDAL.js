const { User } = require('./userModel');
const Post = require('../posts/postDAL');
const { some } = require('lodash');

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

  static async verifyLikedPost(userId, postId) {
    const user = await User.findById(userId);
    return some(user.likedPosts, p => p == postId.toString());
  }

  static async verifyLikedPosts(userId, posts) {
    const user = await User.findById(userId);
    return posts.map(post => ({
      ...post.toJSON(),
      liked: some(user.likedPosts, postId => postId == post._id.toString())
    }));
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
