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
      // define association here
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