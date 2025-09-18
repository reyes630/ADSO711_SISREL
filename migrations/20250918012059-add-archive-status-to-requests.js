'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('requests', 'archive_status', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addIndex('requests', ['archive_status'], {
      name: 'id_archive_status'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('requests', 'id_archive_status');
    await queryInterface.removeColumn('requests', 'archive_status');
  }
};
