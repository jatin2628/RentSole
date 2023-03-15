'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property_Tenant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Property_Tenant.belongsTo(models.Property,{
        foreignKey:'property_id',
        onDelete:'CASCADE'
      })
      Property_Tenant.belongsTo(models.User,{
        foreignKey:'user_id',
        onDelete:'CASCADE'
      })
    }
  }
  Property_Tenant.init({
    property_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    lease_from: DataTypes.DATE,
    lease_to: DataTypes.DATE,
    status: DataTypes.STRING,
    image: DataTypes.STRING,
    filename: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Property_Tenant',
  });
  return Property_Tenant;
};