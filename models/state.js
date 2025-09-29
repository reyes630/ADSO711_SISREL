'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    static associate(models) {
      // Un estado tiene muchas solicitudes
      State.hasMany(models.request, {
        foreignKey: 'FKstates'
      });

      // Una solicitud pertenece a un estado
      models.request.belongsTo(State, {
        foreignKey: 'FKstates'
      });
    }
  }

  State.init({
    State: DataTypes.STRING,
    Description: DataTypes.STRING,
    color: DataTypes.STRING   
  }, {
    sequelize,
    modelName: 'State',
    tableName: 'states',  
  });

  return State;
};
