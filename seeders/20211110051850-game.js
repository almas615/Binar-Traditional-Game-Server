'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('games', [
      {
        name: 'batu-kertas-guntin',
        description: 'permainan batu kertas gunting ',
        play_count: 100,
        game_url: "/rps",
        thumbnail_url: "https://www.youtube.com/watch?v=ifRZ8mUw0VU",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'monopoli',
        description: 'permainan monopoli',
        play_count: 50,
        game_url: "/monopoli",
        thumbnail_url: "https://www.youtube.com/watch?v=3Y33cVYTzWI",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'congklak',
        description: 'permainan congklak',
        play_count: 20,
        game_url: "/congklak",
        thumbnail_url: "https://www.youtube.com/watch?v=pxT4BbsdybY",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'tebak angka',
        description: 'permainan tebak angka',
        thumbnail_url: "https://www.youtube.com/watch?v=JtMcVvX72wM",
        play_count: 30,
        game_url: "/tebak-angka",
        createdAt: new Date(),
        updatedAt: new Date()
      },

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('games', null, {});
  }
};
