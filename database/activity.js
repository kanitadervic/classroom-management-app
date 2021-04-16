const Sequlize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    return Activity = sequelize.define('Activity', {
        name: Sequlize.STRING,
        start: Sequlize.FLOAT,
        end: Sequlize.FLOAT
    });
}