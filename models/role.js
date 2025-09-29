'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    static associate(models) {
      State.hasMany(models.request, { foreignKey: 'FKstates' });
      models.request.belongsTo(State, { foreignKey: 'FKstates' });
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
