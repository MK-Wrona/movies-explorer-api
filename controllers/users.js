const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const DataError = require('../errors/data_error'); // 400
const AuthError = require('../errors/auth_error'); // 401
const ConflictError = require('../errors/conflict_error'); // 409
const NotFoundError = require('../errors/not_found_error'); // 404

const { NODE_ENV } = process.env;

const { JWT_SECRET = 'secret' } = process.env; // подпись


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
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Неверный запрос или данные.'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Данный почтовый ящик уже используется.'));
      } else {
        next(err);
      }
    });
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
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new DataError('Неверный запрос или данные.'));
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
        { _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret', { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      }).end(res.send({ message: 'Записано.' }));
      // console.log(res.cookie);
      // .send({ token });
    })
    .catch(() => next(new AuthError('Неверный логин либо пароль')));
};


module.exports = {
   getUser, createUser, updateUser, login
};
