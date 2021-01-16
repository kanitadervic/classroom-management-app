const Sequlize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    return Student = sequelize.define('Student', {
        ime: Sequlize.STRING,
        index: Sequlize.STRING
    });
}