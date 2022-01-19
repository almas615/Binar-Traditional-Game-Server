const { Game, Detail, User } = require('../models');

const newGame = (req, res) => {
  const {
    name, description, thumbnailUrl, gameUrl, playCount,
  } = req.body;
  Game.create({
    name,
    description,
    thumbnail_url: thumbnailUrl,
    game_url: gameUrl,
    play_count: playCount,
  })
    .then((data) => res.status(201).json({
      result: 'success',
      message: 'new game has beed successfully crated',
      data,
    }))
    .catch((err) => res.status(500).json({
      result: 'failed',
      message: 'failed create new game',
      error: err,
    }));
};

const findAll = (req, res) => {
  Game.findAll()
    .then((data) => {
      res.status(200).json({
        result: 'success',
        message: 'successfully retrieve data',
        data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        result: 'failed',
        message: 'some eror occured while retrieving game.',
        error: err.message,
      });
    });
};

const findOne = (req, res) => {
  Game.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          result: 'failed',
          message: 'game not registered',
        });
      }
      return res.status(200).json({
        result: 'success',
        message: 'successfully retrieve data',
        data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        result: 'failed',
        message: 'some error occured while retrieving game',
        error: err.message,
      });
    });
};

// eslint-disable-next-line consistent-return
const getLeaderboard = async (req, res) => {
  const number = /^[0-9]+$/;
  if (!req.params.id.match(number)) {
    return res.status(400).json({
      result: 'failed',
      message: 'bad request',
    });
  }
  try {
    const detail = await Detail.findAll({
      where: {
        gameId: req.params.id,
      },
      attributes: ['gameId', 'userId', 'score'],
      order: [['score', 'DESC']],
      include: {
        model: User,
        as: 'detail_user',
        attributes: ['first_name', 'last_name', 'username', 'email'],
      },
    });

    if (detail) {
      res.status(200).json({
        result: 'success',
        message: 'successfully retrieve data',
        data: detail,
      });
    }
  } catch (err) {
    res.status(500).json({
      result: 'failed',
      message: 'some error occured while retrieving game',
      error: err.message,
    });
  }
};
const getRecomendation = (req, res) => {
  Game.findAll({
    attributes: ['id', 'name', 'description', 'play_count'],
    order: [['play_count', 'DESC']],
    limit: 4,
  })
    .then((detail) => {
      res.status(200).json({
        result: 'success',
        message: 'successfully retrieve data',
        data: detail,
      });
    })
    .catch((err) => {
      res.status(500).json({
        result: 'failed',
        message: 'some error occured while retrieving game',
        error: err.message,
      });
    });
};
module.exports = {
  newGame,
  findAll,
  findOne,
  getLeaderboard,
  getRecomendation,
};
