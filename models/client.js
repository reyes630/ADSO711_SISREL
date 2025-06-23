'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Client.hasMany(models.request); // Un cliente tiene muchas solicitudes
      models.request.belongsTo(Client); // Una solicitud pertenece a un cliente
    }
  }
  Client.init({
    DocumentClient: DataTypes.STRING,
    NameClient: DataTypes.STRING,
    EmailClient: DataTypes.STRING,
    TelephoneClient: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Client',
  });
  return Client;
};