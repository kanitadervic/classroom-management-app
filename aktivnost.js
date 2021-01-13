const Sequlize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    return Aktivnost = sequelize.define('Aktivnost', {
        naziv: Sequlize.STRING,
        pocetak: Sequlize.FLOAT,
        kraj: Sequlize.FLOAT
    });
}