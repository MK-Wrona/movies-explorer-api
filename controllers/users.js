const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const DataError = require('../errors/data_error'); // 400
const AuthError = require('../errors/auth_error'); // 401
const ConflictError = require('../errors/conflict_error'); // 409
const NotFoundError = require('../errors/not_found_error');
// 404

const getUser = (req, res, next) => User.findById(req.user._id) // req.user._id?
  .orFail(new NotFoundError('Юзер по заданному ID отсутствует в БД.'))
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new DataError('Неверный запрос или данные.'));
    } else {
      next(err);
    }
  });

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(201)
      .send({ message: `Пользователь ${user.email} успешно зарегестрирован` }))
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError('Такой пользователь уже существует.');// ерр на дубликат в бд
      }
      throw err;
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  // нашли значение у пользователя по id, обновили и отправили обратно
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Юзер по заданному ID отсутствует в БД.');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Данные заняты другим пользователем.'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        // передаем в пейлоуд айди юзера и подпись
        { _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'letsdestroythem', { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        // httpOnly: true,
        // sameSite: 'None',
        // secure: true,
      }).res.send({ message: 'Вы успешно залогинились.' });
      // console.log(res.cookie);
      // .send({ token });
    })
    .catch(() => next(new AuthError('Неверный логин либо пароль')));
};

module.exports = {
  getUser, createUser, updateUser, login,
};
