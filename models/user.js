"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING(255),
    password: DataTypes.STRING(255),
    firstname: DataTypes.STRING(255),
    lastname: DataTypes.STRING(255)
  }, {
	underscored: true,
    freezeTableName: true,
    tableName: "user"
  });

  return User;
};