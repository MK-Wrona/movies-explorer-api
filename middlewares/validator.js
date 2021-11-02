const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const validator = require('validator');

const validateObjId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Некорректный ID.');
    }),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Поле "email" не валидно.')
      .messages({
        'string.required': 'Поле "email" не должно быть пустым.',
      }),
    password: Joi.string().required().min(5)
      .messages({
        'any.required': 'Поле "password" не должно быть пустым.',
      }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'any.required': 'Поле "name" не должно быть пустым.',
      }),
  }),
});

const validateProfileBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Поле "email" не валидно.')
      .messages({
        'string.required': 'Поле "email" не должно быть пустым.',
      }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'any.required': 'Поле "name" не должно быть пустым.',
      }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Поле "email" не валидно.')
      .messages({
        'string.required': 'Поле "email" не должно быть пустым.',
      }),
    password: Joi.string().required().min(5)
      .messages({
        'any.required': 'Поле "password" не должно быть пустым.',
      }),
  }),
});

const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка.');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка.');
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка.');
    }),
    movieId: Joi.number().required(),
  }),
});

module.exports = {
  validateObjId,
  validateUserBody,
  validateProfileBody,
  validateLogin,
  validateMovie,
};
