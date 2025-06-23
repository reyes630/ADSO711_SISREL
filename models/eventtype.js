'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class eventType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      eventType.hasMany(models.request); // Un tipo evento tiene muchas solicitudes
      models.request.belongsTo(eventType); // Una solicitud pertenece a un tipo evento
    }
  }
  eventType.init({
    eventType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'eventType',
  });
  return eventType;
};