const bcrypt = require('bcryptjs');

const hashPassword = (userPassword) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(userPassword, salt);
  return hash;
};

const comparePassword = (userPassword, dbPassword) => bcrypt.compareSync(userPassword, dbPassword);

module.exports = { hashPassword, comparePassword };
