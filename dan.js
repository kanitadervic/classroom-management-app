const Sequlize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    return Dan = sequelize.define('Dan', {
        naziv: {
            type: Sequlize.STRING,
            unique: true
        }
    });
}