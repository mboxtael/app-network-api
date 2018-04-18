const User = require('./userDAL');
const controller = require('./usersController');

module.exports = {
  User,
  routes: controller.routes()
};
