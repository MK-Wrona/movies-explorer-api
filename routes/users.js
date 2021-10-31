const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, updateUser, // createUser,
} = require('../controllers/users');

userRouter.get('/users/me', getUser);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

module.exports = userRouter;