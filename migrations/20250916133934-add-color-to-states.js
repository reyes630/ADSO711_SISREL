module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('states', 'color', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('states', 'color');
  }
};
