"use strict";

module.exports = function(sequelize, DataTypes) {
  var Settings = sequelize.define("Settings", {
    title: DataTypes.STRING(255),
    tagline: DataTypes.STRING(255),
    url: DataTypes.STRING(255),
    logo: DataTypes.STRING(255),
    email: DataTypes.STRING(255),
    contact: DataTypes.STRING(45)
  },{
	underscored: true,
    freezeTableName: true,
    tableName: "settings"  
  });

  return Settings;
};