const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const validator = require('validator');

const validateObjId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.matches(value, /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)) {
        return value;
      }
      return helpers.message('Невалидный email');
    }),
    password: Joi.string().required(),
  }),
});

const validateProfileBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.matches(value, /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)) {
        return value;
      }
      return helpers.message('Невалидный email');
    }),
  }),
});

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.matches(value, /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)) {
        return value;
      }
      return helpers.message('Невалидный email');
    }),
    password: Joi.string().required(),
  }),
});

const validateMovieBody = celebrate({
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
      return helpers.message('Невалидный url изображения');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидный url трейлера');
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидный thumbnail url');
    }),
    movieId: Joi.number().required(),
  }),
});

module.exports = {
  validateObjId,
  validateUserBody,
  validateProfileBody,
  validateAuthentication,
  validateMovieBody,
};