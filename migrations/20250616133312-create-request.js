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
      // Estado
      FKstates: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'states',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      // Tipo de evento
      FKeventtypes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'eventtypes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      // Cliente
      FKclients: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      // Usuario
      FKusers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      // Tipo servicio
      FKservicetypes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'servicetypes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
