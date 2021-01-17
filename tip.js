const Sequlize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    return Tip = sequelize.define('Tip', {
        naziv: {
            type: Sequlize.STRING,
            unique: true
        }
    });
}