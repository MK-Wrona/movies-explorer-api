require('dotenv').config();
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth_error');

const { NODE_ENV, JWT_SECRET = 'letsdestroythem' } = process.env;

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация.');
  }

  const token = authorization.replace('Bearer ', '');
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
