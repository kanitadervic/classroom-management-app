const Sequlize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    return Predmet = sequelize.define('Predmet', {
        naziv: {
            type: Sequlize.STRING,
            unique: true
        }
    });
}