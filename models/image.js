'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes,Op) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Image.belongsTo(models.User, {
        foreignKey: 'user_id',
        as:'images',
        onDelete: 'CASCADE'
      });

      // Image.hasOne(models.Property);
      
      Image.belongsToMany(models.Property,{
        through:'Property_Image',
        foreignKey:'image_id',
        onDelete:"CASCADE"
       
      })

      Image.belongsToMany(models.Property_Room,{
        through:'Property_Room_Image',
        foreignKey:'image_id',
        onDelete:"CASCADE"
        
      })
      Image.hasOne(models.Property_Applicant,{
        foreignKey:'image_id',
        onDelete:'CASCADE'
      })
    }
  }
  Image.init({
    caption: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    image: DataTypes.STRING,
    file_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};