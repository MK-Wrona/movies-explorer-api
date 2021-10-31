const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth_error');

const JWT_SECRET = 'secret';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTdiZDI3YWYzMjgzODBkNGVlYTdjYzgiLCJpYXQiOjE2MzU1MDQ3NzAsImV4cCI6MTYzNjEwOTU3MH0.F_9vyWpZ2hAzcz_WfVvTen3eCa5aoDYX4sVtz5fH44g"

function auth(req, res, next) {
  //const token = req.cookies.jwt;
  //console.log({token})
  // console.log(token); // {token: undefined}
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthError('Авторизация не прошла.');
  }

  req.user = payload;

  next();
}

module.exports = auth;