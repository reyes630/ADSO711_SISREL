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
      Client.hasMany(models.request, { foreignKey: 'FKclients' });
      models.request.belongsTo(Client, { foreignKey: 'FKclients' });
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