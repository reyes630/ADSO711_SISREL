'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class serviceType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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