'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'coordinator', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // o false si quieres que sea obligatorio
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'coordinator');
  },
}
