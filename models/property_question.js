'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property_Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Property_Question.belongsTo(models.Property,{
        foreignKey:'property_id',
        onDelete:'CASCADE'
      })
      Property_Question.belongsTo(models.Question,{
        foreignKey:'question_id',
        onDelete:'CASCADE'
      })
      Property_Question.belongsToMany(models.Question_Option,{
        through:'Property_Question_Option',
        foreignKey:'property_question_id',
        onDelete:'CASCADE'
      })
    }

    
  }
  Property_Question.init({
    property_id: DataTypes.INTEGER,
    question_id: DataTypes.INTEGER,
    option_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    has_other: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Property_Question',
  });
  return Property_Question;
};