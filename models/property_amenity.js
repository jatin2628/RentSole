'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property_Amenity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Property_Amenity.belongsTo(models.Property,{foreignKey:'property_id'})
      // Property_Amenity.belongsTo(models.Amenity,{foreignKey:'amenity_id'})
    }
  }
  Property_Amenity.init({
    property_id: DataTypes.INTEGER,
    amenity_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Property_Amenity',
  });
  return Property_Amenity;
};