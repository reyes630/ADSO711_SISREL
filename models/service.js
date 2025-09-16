'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class service extends Model {
    static associate(models) {
      // Un servicio tiene muchos tipos de servicio
      service.hasMany(models.serviceType, {
        foreignKey: 'FKservices'
      });
      models.serviceType.belongsTo(service, {
        foreignKey: 'FKservices'
      });
    }
  }

  service.init({
    service: DataTypes.STRING,
    color: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'service',
  });

  return service;
};
