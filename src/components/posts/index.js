const controller = require('./postsController');
const Post = require('./postDAL');

module.exports = {
  Post,
  routes: controller.middleware()
};
