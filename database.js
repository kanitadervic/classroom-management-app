const Sequelize = require("sequelize");

const sequelize = new Sequelize("wt2018176", "root", "root", {
    host: "localhost",
    dialect: "mysql"
});

const database = {};
/*
    IMPORTOVANJ MODLA
*/
database.Sequelize = Sequelize;
database.sequelize = sequelize;

require('./predmet.js')(sequelize, Sequelize.DataTypes);
database.predmet = sequelize.models.Predmet;

require('./grupa.js')(sequelize, Sequelize.DataTypes);
database.grupa = sequelize.models.Grupa;

require('./dan.js')(sequelize, Sequelize.DataTypes);
database.dan = sequelize.models.Dan;

require('./tip.js')(sequelize, Sequelize.DataTypes);
database.tip = sequelize.models.Tip;

require('./student.js')(sequelize, Sequelize.DataTypes);
database.student = sequelize.models.Student;

require('./aktivnost.js')(sequelize, Sequelize.DataTypes);
database.aktivnost = sequelize.models.Aktivnost;


/*
    DeF VeZA
*/

database.predmet.hasMany(database.grupa, {
    foreignKey: {
        allowNull: false
    }
});
database.predmet.hasMany(database.aktivnost, {
    foreignKey: {
        allowNull: false
    }
});
database.grupa.hasMany(database.aktivnost);
database.dan.hasMany(database.aktivnost, {
    foreignKey: {
        allowNull: false
    }
});
database.tip.hasMany(database.aktivnost, {
    foreignKey: {
        allowNull: false
    }
});

database.student.belongsToMany(database.grupa, {
    through: 'studentGrupa',
    as: 'Grupe',
    foreignKey: 'idStudenta'
});

database.grupa.belongsToMany(database.student, {
    through: 'studentGrupa',
    as: 'Studenti',
    foreignKey: 'idGrupe'
});

module.exports = database;