"use strict";

module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define("Product", {
    name: DataTypes.STRING(50),
    description: DataTypes.TEXT,
    image: DataTypes.STRING(255)
  }, {
    classMethods: {
      associate: function(models) {
        Product.belongsTo(models.Category);
      }
    },
    underscored: true,
    freezeTableName: true,
    tableName: "product"
  });

  return Product;
};