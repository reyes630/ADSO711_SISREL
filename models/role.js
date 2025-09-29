'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    role.hasMany(models.user, { foreignKey: 'FKroles' });   
    models.user.belongsTo(role, { foreignKey: 'FKroles' });
    }
  }
  role.init({
    Role: DataTypes.STRING
  }, {
    sequelize,  
    modelName: 'role',
  });
  return role;
};