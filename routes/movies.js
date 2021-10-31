const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovie, deleteMovie
} = require('../controllers/movies');
const { validateObjId, validateMovieBody } = require('../middlewares/validator');

// руты для карточек\лойсов

movieRouter.get('/movies/', getMovies);

movieRouter.post('/movies/',
validateMovieBody,
createMovie);

movieRouter.delete('/movies/:_id', validateObjId, deleteMovie);

module.exports = movieRouter;