const jwt = require('jsonwebtoken');

exports.sign = async payload => jwt.sign(payload, process.env.JWT_SECRET);

exports.verify = async token => jwt.verify(token, process.env.JWT_SECRET);
