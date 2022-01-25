const env = process.env.NODE_ENV || 'development';
const upperCaseEnv = env.toUpperCase();
if (process.env.NODE_ENV === 'development') require('dotenv').config();

const username = process.env['DB_USERNAME_' + upperCaseEnv];
const password = process.env['DB_PASSWORD_' + upperCaseEnv];
const database = process.env['DB_NAME_' + upperCaseEnv];
const host = process.env['DB_HOST_' + upperCaseEnv];
const dialect = process.env['DB_DIALECT_' + upperCaseEnv];

module.exports = {
  development: {
    username,
    password,
    database,
    host,
    dialect,
  },
  test: {
    "username": "ulul",
    "password": "canggih",
    "database": "database_ch9",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
  // production: {
  //   "username": "ulul",
  //   "password": "canggih",
  //   "database": "database_ch9",
  //   "host": "127.0.0.1",
  //   "dialect": "postgres"
  // },
};
