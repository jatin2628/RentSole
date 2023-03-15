'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property_Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Property_Room.belongsTo(models.Property,{
        foreignKey:'property_id',
        onDelete:'CASCADE'
      })
      Property_Room.belongsToMany(models.Image,{
        through:'Property_Room_Image',
        onDelete:"CASCADE",
        foreignKey:'room_id'
      })
    }
  }
  Property_Room.init({
    property_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    image_id: DataTypes.INTEGER,
    url: DataTypes.STRING,
    caption: DataTypes.STRING,
    room_type: DataTypes.INTEGER,
    condition: DataTypes.STRING,
    remark: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Property_Room',
  });
  return Property_Room;
};