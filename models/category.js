"use strict";

module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define("Category", {
    name: DataTypes.STRING(255),
    description: DataTypes.STRING(255),
    image: DataTypes.STRING(255)
  }, {
    classMethods: {
      associate: function(models) {
    	Category.belongsTo(models.Principal);  
        Category.hasMany(models.Product);
      }
    },
    underscored: true,
    freezeTableName: true,
    tableName: "category"
  });

  return Category;
};