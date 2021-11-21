const express = require('express');

const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const limiter = require('./middlewares/rate_limiter');
const errHandler = require('./middlewares/err_handler');
const { DB_URL } = require('./config'); // jwt-key \ db url moved to config_set

const { PORT = 3000 } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const corsOptions = {
  origin: [
    'https://daru13.back.nomoredomains.icu',
    'http://daru13.back.nomoredomains.icu',
    'https://daru13.front.nomoredomains.icu',
    'http://daru13.front.nomoredomains.icu',

  ],
  credentials: true,
};

// middlewares
app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(requestLogger);

app.use(router);

// логгер + централизованный обработчик
app.use(errorLogger);
app.use(errors());
app.use(errHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is run at ${PORT}`);
});
