const Sequlize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    return Tip = sequelize.define('Tip', {
        naziv: Sequlize.STRING
    });
}