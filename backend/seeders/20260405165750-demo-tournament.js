'use strict';
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password123', 5);

    const user = await queryInterface.bulkInsert('user', [{
      username: 'testUser',
      email: 'test@example.com',
      password: hashedPassword,
      isActivated: true,
      activationLink: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: ['id'] });

    const userId = user[0].id;

    const [tournament] = await queryInterface.bulkInsert('tournaments', [{
      userId: userId,
      title: 'Best actor',
      description: faker.lorem.sentence(),
      completed: true,
      image: '52320.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: ['id'] });

    const tournamentId = tournament.id;

    const pictures = [];
    for (let i = 0; i < 8; i++) {
      pictures.push({
        tournamentId: tournamentId,
        title: faker.person.firstName(),
        description: faker.commerce.productDescription(),
        image: '52320.jpg',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('picture', pictures);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('picture', null, {});
    await queryInterface.bulkDelete('tournaments', null, {});
    await queryInterface.bulkDelete('user', null, {});
  }
};
