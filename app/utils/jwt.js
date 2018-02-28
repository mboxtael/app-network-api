const jwt = require('jsonwebtoken');

exports.sign = async payload => {
  return await jwt.sign(payload, process.env.JWT_SECRET);
};

exports.verify = async token => {
  return await jwt.verify(token, process.env.JWT_SECRET);
};
