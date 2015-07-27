"use strict";

module.exports = function(sequelize, DataTypes) {
  var Principal = sequelize.define("Principal", {
    name: DataTypes.STRING(255),
    logo: DataTypes.STRING(255),
    url: DataTypes.STRING(255)
  }, {
	classMethods: {
	    associate: function(models) {
	    Principal.hasMany(models.Category);
	  }
	},
	underscored: true,
    freezeTableName: true,
    tableName: "principal"
  });

  return Principal;
};