/* eslint-disable */
require('dotenv').config();
const { User } = require('../models');
const cloudinary = require('cloudinary');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const { comparePassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');
const { sendEmail } = require('../helpers/sendEmail');

// Setting up cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const format = (user) => {
  const { id, first_name, last_name, email, username } = user;

  const payload = {
    id,
    email,
    username,
  };

  return {
    result: 'success',
    message: 'Login Successfully',
    data: {
      id,
      first_name,
      last_name,
      email,
      username,
      accessToken: generateToken(payload),
    },
  };
};

const index = async (req, res) => {
  res.send('Something is cooking inside this kitchen.. Yummy!');
};

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, username, password } = req.body;
    if (first_name.length < 2 || first_name.length > 50) {
      return res.status(400).json({
        result: 'failed',
        message: 'Your first name minlength 2 and cannot exceed 50 characters',
      });
    }

    const userEmail = await User.findOne({
      where: { email },
    });

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const userName = await User.findOne({
      where: { username },
    });

    if (userEmail) {
      return res
        .status(409)
        .json({ result: 'failed', message: 'The email is already registered' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({
        result: 'failed',
        message: 'Please enter valid email address',
      });
    }
    if (email !== email.toLowerCase()) {
      return res.status(400).json({
        result: 'failed',
        message: 'only lowercase letters allowed for email',
      });
    }
    if (userName) {
      return res.status(409).json({
        result: 'failed',
        message: 'The username is already registered',
      });
    }
    if (username.length < 2 || username.length > 20) {
      return res.status(400).json({
        result: 'failed',
        message: 'Your username minlength 2 & cannot exceed 20 characters',
      });
    }
    if (password.toString().length < 6) {
      return res.status(400).json({
        result: 'failed',
        message: 'Your password must be longer than 6 characters',
      });
    }
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'binar_chp11/avatar',
      width: '150',
      crop: 'scale',
    });
    const user = await User.create({
      first_name,
      last_name,
      email,
      username,
      password,
      avatar_public_id: result.public_id,
      avatar_url: result.secure_url,
    });

    return res.status(201).json({
      result: 'success',
      message: 'Congratulations, your account has been successfully created.',
      data: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    return res.status(500).json({
      result: 'failed',
      message: 'Opps! Registration Failed, Something went wrong',
      error: err.error,
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({
        result: 'failed',
        message: 'User Not Found',
      });
    }

    const match = comparePassword(password, user.password);
    if (match) {
      return res.status(200).json(format(user));
    } else {
      return res.status(401).json({
        result: 'failed',
        message: 'Please enter a valid username or password',
      });
    }
  } catch (err) {
    return res.status(500).json({
      result: 'failed',
      message: 'Oops! Something went wrong',
      error: err.message,
    });
  }
};

const loginGoogle = (req, res) => {
  const { tokenId } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  let email = null;
  let first_name = null;
  let last_name = null;
  let username = '';
  client
    .verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    })
    .then((ticket) => {
      const payload = ticket.getPayload();
      email = payload.email;
      first_name = payload.given_name;
      last_name = payload.family_name;
      username = email.substring(0, email.lastIndexOf('@'));
      return User.findOne({ where: { email } });
    })
    .then((user) => {
      if (!user) {
        return User.create({
          first_name,
          last_name,
          email,
          username,
          password: Math.random() * 1000 + 'google random password secret',
        });
      } else {
        return user;
      }
    })
    .then((user) => {
      res.status(200).json(format(user));
    })
    .catch((error) => {
      console.log(error.message);
    });
};

const currentUserProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
};

const forgotPassword = async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  const { id, username, email } = user;
  if (!user) {
    return res.status(404).json({
      status: false,
      message: 'email is not registered',
    });
  }
  const payload = { id, username, email };
  await user.update({ reset_password_link: generateToken(payload) });

  const templateEmail = {
    from: 'Go Play',
    to: req.body.email,
    subject: 'Link to Reset Password',
    html: `<p>Please click the link below to reset your password</p><p>${
      process.env.CLIENT_URL
    }/resetpassword/${generateToken(payload)}</p>`,
  };
  sendEmail(templateEmail);
  return res.status(200).json({
    status: true,
    message: 'Link to reset password sent successfully',
  });
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    console.log(newPassword);
    console.log(token);

    const hashPassword = bcrypt.hashSync(
      newPassword,
      bcrypt.genSaltSync(10),
      null
    );

    const user = await User.update(
      { password: hashPassword },
      { where: { reset_password_link: token }, returning: true }
    );

    return res.status(200).json({
      status: true,
      message: 'password changed successfully',
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  index,
  register,
  login,
  loginGoogle,
  currentUserProfile,
  forgotPassword,
  resetPassword,
};
