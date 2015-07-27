"use strict";

module.exports = function(sequelize, DataTypes) {
  var Keyword = sequelize.define("Keyword", {
    keyword: DataTypes.TEXT
  }, {
	underscored: true,
    freezeTableName: true,
    tableName: "keyword"
  });

  return Keyword;
};