'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question.hasMany(models.Question_Option,{
        foreignKey:'question_id',
        onDelete:'CASCADE'
      })

      Question.hasMany(models.Property_Question,{
        foreignKey:'question_id',
        onDelete:'CASCADE'
      })
    }
  }
  Question.init({
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    has_other: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};