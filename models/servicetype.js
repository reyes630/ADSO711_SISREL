'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class serviceType extends Model {
    static associate(models) {
      // Un tipo de servicio tiene muchas solicitudes
      serviceType.hasMany(models.request, {
        foreignKey: 'FKservicetypes'
      });
      models.request.belongsTo(serviceType, {
        foreignKey: 'FKservicetypes'
      });

      // Un tipo de servicio pertenece a un servicio
      serviceType.belongsTo(models.service, {
        foreignKey: 'FKservices'
      });
    }
  }

  serviceType.init({
    serviceType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'serviceType',
  });

  return serviceType;
};
