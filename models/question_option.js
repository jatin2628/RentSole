'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question_Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question_Option.belongsTo(models.Question,{
        foreignKey:'question_id',
        onDelete:'CASCADE'
      })
      Question_Option.belongsToMany(models.Property_Question,{
        through:'Property_Question_Option',
        foreignKey:'option_id',
        onDelete:'CASCADE'
      })
    }
  }
  Question_Option.init({
    question_id: DataTypes.INTEGER,
    text: DataTypes.STRING,
    prefered: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Question_Option',
  });
  return Question_Option;
};