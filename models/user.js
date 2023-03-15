'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // User.hasMany(models.Property)
      // User.hasMany(models.Image)
      User.hasOne(models.Property_Tenant,{
        foreignKey:'user_id',
        onDelete:'CASCADE'
      })
      User.hasMany(models.Property,{
        foreignKey:'user_id',
        onDelete:'CASCADE'
      })
      User.hasOne(models.Image,{
        foreignKey:'user_id',
        onDelete:'CASCADE'
      })
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isBlocked:{
      type:DataTypes.INTEGER,
      defaultValue:'0'
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};