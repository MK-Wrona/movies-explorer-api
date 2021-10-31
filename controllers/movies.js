const Movie = require('../models/movie');

const DataError = require('../errors/data_error'); // 400
const AccessDeniedError = require('../errors/access_denied_error'); // 403
const NotFoundError = require('../errors/not_found_error'); // 404

// получить фильмы
const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => {
      // получили и сразу отправили юзеру
      res.send(movie);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(DataError('Данные карточки не валидны.'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { _id } = req.params;
  Movie.findById(_id)
    .orFail(() => new NotFoundError('Карточка с фильмом не найдена'))
    .then((movie) => {
      if (JSON.stringify(req.user._id) === JSON.stringify(movie.owner)) {
        Movie.findByIdAndRemove(_id)
          .then((result) => {
            res.send(result);
          });
      } else {
        throw new AccessDeniedError('Вы не обладаете достаточными правами для удаления фильма.');
      }
    })
    .catch(next);
};



module.exports = {
  getMovies, createMovie, deleteMovie,
};