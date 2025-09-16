'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Una solicitud pertenece a un estado
      models.State.hasMany(models.request, { foreignKey: 'FKstates' });
      models.request.belongsTo(models.State, { foreignKey: 'FKstates' });
      
      // Una solicitud pertenece a un tipo de evento
      models.eventType.hasMany(models.request, { foreignKey: 'FKeventtypes' });
      models.request.belongsTo(models.eventType, { foreignKey: 'FKeventtypes' });
      
      // Una solicitud pertenece a un cliente
      models.Client.hasMany(models.request, { foreignKey: 'FKclients' });
      models.request.belongsTo(models.Client, { foreignKey: 'FKclients' });
      
      // Una solicitud pertenece a un usuario
      models.user.hasMany(models.request, { foreignKey: 'FKusers' });
      models.request.belongsTo(models.user, { foreignKey: 'FKusers' });
      
      // Una solicitud pertenece a un tipo de servicio
      models.serviceType.hasMany(models.request, { foreignKey: 'FKservicetypes' });
      models.request.belongsTo(models.serviceType, { foreignKey: 'FKservicetypes' });
    }
  }
  request.init({
    eventDate: DataTypes.STRING,
    location: DataTypes.STRING,
    municipality: DataTypes.STRING,
    observations: DataTypes.STRING,
    comments: DataTypes.STRING,
    requestMethod: DataTypes.STRING,
    needDescription: DataTypes.STRING,
    assignment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'request',
  });
  return request;
};