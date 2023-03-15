'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Property.belongsTo(models.User, {
        foreignKey: 'user_id',
        as:'properties',
        onDelete: 'CASCADE'
      });

      Property.belongsToMany(models.Image,{
        through:'Property_Image',
        foreignKey:'property_id',
        onDelete:"CASCADE"
       
      })
      Property.belongsToMany(models.Amenity,{
        through:'Property_Amenity',
        foreignKey:'property_id',
        onDelete:"CASCADE"
        
      })

      Property.hasMany(models.Property_Room,{
        foreignKey:'property_id',
        onDelete:'CASCADE'
      })
      Property.hasMany(models.Property_Applicant,{
        foreignKey:'property_id',
        onDelete:'CASCADE'
      })
      Property.hasOne(models.Property_Tenant,{
        foreignKey:'property_id',
        onDelete:'CASCADE'
      })

      Property.hasMany(models.Property_Question,{
        foreignKey:'property_id',
        onDelete:'CASCADE'
      })

    //   // Property.hasOne(models.Property_Amenity)
    }
  }
  Property.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    property_type: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue:''
    },
    tenancy_status: {
      type: DataTypes.INTEGER,
      defaultValue:0,
    },
    address: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          street:this.street,
          city:this.city,
          state:this.state,
          postal_code:this.postal_code,
          country:this.country,
          latitude:this.latitude,
          longitude:this.longitude
        };
      }
     
    },
    street:{
      type: DataTypes.STRING,
      allowNull:false,
    },
    city:{
      type: DataTypes.STRING,
      allowNull:false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    latitude:{
      type: DataTypes.DOUBLE,
      defaultValue:0
    },
    longitude:{
      type: DataTypes.DOUBLE,
      defaultValue:0
    },
    area: { 
      type: DataTypes.STRING,
      allowNull:false,
    },
    furnishing_status: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },

    share_property_url: {
      type: DataTypes.STRING,
      defaultValue:''
    },
  }, {
    sequelize,
    modelName: 'Property',
  });
  return Property;
};