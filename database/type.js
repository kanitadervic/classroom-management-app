const Sequlize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    return Type = sequelize.define('Type', {
        name: {
            type: Sequlize.STRING,
            unique: true
        }
    });
}