const Sequlize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    return Subject = sequelize.define('Subject', {
        name: {
            type: Sequlize.STRING,
            unique: true
        }
    });
}