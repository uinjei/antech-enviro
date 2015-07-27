"use strict";

module.exports = function(sequelize, DataTypes) {
  var Slider = sequelize.define("Slider", {
    image: DataTypes.STRING(255),
    is_active: {
    	type: DataTypes.BOOLEAN,
    	defaultValue: false
    },
    position: DataTypes.INTEGER(10),
    title: DataTypes.STRING(255),
    description: DataTypes.STRING(255),
    link: DataTypes.STRING(100)
  }, {
	underscored: true,
    freezeTableName: true,
    tableName: "slider"
  });

  return Slider;
};