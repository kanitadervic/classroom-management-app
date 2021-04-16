const Sequlize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    return Day = sequelize.define('Day', {
        name: {
            type: Sequlize.STRING,
            unique: true
        }
    });
}