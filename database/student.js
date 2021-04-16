const Sequlize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    return Student = sequelize.define('Student', {
        name: Sequlize.STRING,
        index: Sequlize.STRING
    });
}