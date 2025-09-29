'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class eventType extends Model {
    static associate(models) {
      // Un tipo de evento tiene muchas solicitudes
      eventType.hasMany(models.request, {
        foreignKey: 'FKeventtypes'
      });

      // Una solicitud pertenece a un tipo de evento
      models.request.belongsTo(eventType, {
        foreignKey: 'FKeventtypes'
      });
    }
  }

  eventType.init({
    eventType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'eventType',
    tableName: 'eventtypes',
  });

  return eventType;
};
