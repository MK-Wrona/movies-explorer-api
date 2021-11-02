require('dotenv').config();
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth_error');

const { NODE_ENV, JWT_SECRET = 'letsdestroythem' } = process.env;

function auth(req, res, next) {
  const token = req.cookies.jwt;
  // console.log(req.cookies)
  // console.log(token); // {token: undefined}
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'letsdestroythem');
  } catch (err) {
    throw new AuthError('Авторизация не прошла.');
  }

  req.user = payload;

  next();
}

module.exports = auth;
