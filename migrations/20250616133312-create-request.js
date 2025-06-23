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
          model: 'States',  // Nombre exacto de la tabla 
          key: 'id'   // Llave primaria real en la tabla `states`
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      // Tipo de evento
      FKeventtypes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Eventtypes',
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
          model: 'Clients',
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
          model: 'Users',
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
          model: 'Servicetypes',
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