const { User } = require('./userModel');
const controller = require('./usersController');

module.exports = {
  User,
  routes: controller.routes()
};
