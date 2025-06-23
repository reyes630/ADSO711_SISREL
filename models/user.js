'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.request); // Un usuario tiene muchas solicitudes
      models.request.belongsTo(user); // Una solicitud pertenece a un usuario
    }
  }
  user.init({
    documentUser: DataTypes.STRING,
    nameUser: DataTypes.STRING,
    emailUser: DataTypes.STRING,
    telephoneUser: DataTypes.STRING,
    passwordUser: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};