'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
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
    tableName: 'clients',      
    freezeTableName: true      
  });
  return Client;
};
