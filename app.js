require('dotenv').config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
// const fs = require("fs")
const cors = require('cors');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const NotFoundError = require('./errors/not_found_error'); // 404

mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// cors({credentials: true,  origin: true})
//const corsOptions = {
//origin: [
 //   'https://daru.students.nomoredomains.monster',
  //  'https://daru.students.nomoredomains.rocks',
 //   'http://daru.students.nomoredomains.monster',
//    'http://daru.students.nomoredomains.rocks',
 //   'http://84.252.131.82',
//'http://localhost:3000',
 // ],
 // credentials: true,
//};

// middlewares
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(requestLogger);

//app.use(cors(corsOptions));
//app.get('/crash-test', () => {
//  setTimeout(() => {
//    throw new Error('Сервер сейчас упадёт');
//  }, 0);
//});

// done

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[a-zA-Z\d\-.]{1,}\.[a-z]{1,6}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]*)/),
  }),
}), createUser);

app.use(auth);

// sync
app.use('/', userRouter);
app.use('/', movieRouter);
// запрос по несуществующему руту
app.use('*', () => { throw new NotFoundError('Запрашиваемый ресурс не найден.'); });

// логгер ошибок перед централизованным обработчиком
app.use(errorLogger);

app.use(errors());
// централизованная обработка ошибок приложения


app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is run at ${PORT}`);
});