require('dotenv').config();

const { DB_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;

module.exports = {
  DB_URL,
};
