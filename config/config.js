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
    "username": "oitouxpfzxlcun",
    "password": "00fc1d83879a30392591c57c49f6402c93481fcf9c0ec9fac1bb016e21c2dc59",
    "database": "dep4g4kolur1t5",
    "host": "ec2-44-199-52-133.compute-1.amazonaws.com",
    "dialect": "postgres",
    "port": "5432"
  },
};
