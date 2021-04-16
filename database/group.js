const Sequlize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    return Group = sequelize.define('Group', {
        name: {
            type: Sequlize.STRING,
            unique: true
        }
    });
}