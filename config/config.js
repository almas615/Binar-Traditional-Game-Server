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
  },
  production: {
    "username": "vlstifypbpjwjo",
    "password": "3ea2e35722eddba26473fb8df086d9905b46f05afa57dd90d70b54e5f0e05f86",
    "database": "dc1h9g0pal8nfi",
    "host": "ec2-54-157-15-228.compute-1.amazonaws.com",
    "port": "5432",
    "dialect": "postgres",
    "ssl": {
      "rejectUnauthorized": "false"
    }

  },
};
