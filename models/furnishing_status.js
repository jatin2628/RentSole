'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Furnishing_Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Furnishing_Status.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Furnishing_Status',
  });
  return Furnishing_Status;
};