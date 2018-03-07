const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt');

exports.sign = async payload => jwt.sign(payload, process.env.JWT_SECRET);
exports.verify = async token => jwt.verify(token, process.env.JWT_SECRET);
exports.authenticate = koaJwt({ secret: process.env.JWT_SECRET });
