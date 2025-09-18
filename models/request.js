'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class request extends Model {
    static associate(models) {
      models.State.hasMany(models.request, { foreignKey: 'FKstates' });
      models.request.belongsTo(models.State, { foreignKey: 'FKstates' });

      models.eventType.hasMany(models.request, { foreignKey: 'FKeventtypes' });
      models.request.belongsTo(models.eventType, { foreignKey: 'FKeventtypes' });

      models.Client.hasMany(models.request, { foreignKey: 'FKclients' });
      models.request.belongsTo(models.Client, { foreignKey: 'FKclients' });

      models.user.hasMany(models.request, { foreignKey: 'FKusers' });
      models.request.belongsTo(models.user, { foreignKey: 'FKusers' });

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
    assignment: DataTypes.STRING,
    archive_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'request',
    tableName: 'requests'
  });

  return request;
};
