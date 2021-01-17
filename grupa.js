const Sequlize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    return Grupa = sequelize.define('Grupa', {
        naziv: {
            type: Sequlize.STRING,
            unique: true
        }
    });
}