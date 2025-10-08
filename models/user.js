'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      // Un usuario tiene muchas solicitudes
      user.hasMany(models.request, {
        foreignKey: 'FKusers'
      });

      // Una solicitud pertenece a un usuario
      models.request.belongsTo(user, {
        foreignKey: 'FKusers'
      });

      // Un usuario pertenece a un rol
      user.belongsTo(models.role, {
        foreignKey: 'FKroles'
      });
    }
  }

  user.init({
    documentUser: DataTypes.STRING,
    nameUser: DataTypes.STRING,
    emailUser: DataTypes.STRING,
    telephoneUser: DataTypes.STRING,
    passwordUser: DataTypes.STRING,
    FKroles: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    coordinator: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    // Nuevos campos para recuperación de contraseña
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'user',
  });

  return user;
};
