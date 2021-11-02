const router = require('express').Router();
const users = require('./users');
const movies = require('./movies');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserBody, validateLogin } = require('../middlewares/validator');
const NotFoundError = require('../errors/not_found_error');

router.post('/signin', validateLogin, login);
router.post('/signup', validateUserBody, createUser);

router.use(auth);

router.use('/users', users);
router.use('/movies', movies);

router.use('*', () => { throw new NotFoundError('Запрашиваемый ресурс не найден.'); });

module.exports = router;
