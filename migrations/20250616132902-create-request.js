'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventDate: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      municipality: {
        type: Sequelize.STRING
      },
      observations: {
        type: Sequelize.STRING
      },
      passwordUser: {
        type: Sequelize.STRING
      },
      comments: {
        type: Sequelize.STRING
      },
      requestMethod: {
        type: Sequelize.STRING
      },
      needDescription: {
        type: Sequelize.STRING
      },
      assignment: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('requests');
  }
};