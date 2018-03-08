const { User } = require('./userModel');

class UserDAL {
  static async create(user) {
    return User.create(user);
  }

  static async likePost(userId, postId) {
    return User.findOneAndUpdate(
      { _id: userId },
      { $push: { likedPosts: postId } },
      { new: true, populate: 'likedPosts' }
    );
  }
}

module.exports = UserDAL;
