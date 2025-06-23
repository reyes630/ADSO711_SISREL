'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      service.hasMany(models.servicetype); // Un servicio tiene muchos tipos de servicio
      models.servicetype.belongsTo(service); // Un tipo de servicio tiene un servicio
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