const movieRouter = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { validateObjId, validateMovie } = require('../middlewares/validator');

// руты для карточек\лойсов

movieRouter.get('/', getMovies);

movieRouter.post('/',
  validateMovie,
  createMovie);

movieRouter.delete('/:_id', validateObjId, deleteMovie);

module.exports = movieRouter;
