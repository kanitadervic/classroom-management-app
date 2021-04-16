const Sequelize = require("sequelize");

const sequelize = new Sequelize("timetableManager", "root", "counter", {
    host: "localhost",
    dialect: "mysql"
});

const database = {};

database.Sequelize = Sequelize;
database.sequelize = sequelize;

require('./subject.js')(sequelize, Sequelize.DataTypes);
database.subject = sequelize.models.Subject;

require('./group.js')(sequelize, Sequelize.DataTypes);
database.group = sequelize.models.Group;

require('./day.js')(sequelize, Sequelize.DataTypes);
database.day = sequelize.models.Day;

require('./type.js')(sequelize, Sequelize.DataTypes);
database.type = sequelize.models.Type;

require('./student.js')(sequelize, Sequelize.DataTypes);
database.student = sequelize.models.Student;

require('./activity.js')(sequelize, Sequelize.DataTypes);
database.activity = sequelize.models.Activity;


/*
    DeF VeZA
*/

database.subject.hasMany(database.group, {
    foreignKey: {
        allowNull: false
    }
});
database.subject.hasMany(database.activity, {
    foreignKey: {
        allowNull: false
    }
});
database.group.hasMany(database.activity);
database.day.hasMany(database.activity, {
    foreignKey: {
        allowNull: false
    }
});
database.type.hasMany(database.activity, {
    foreignKey: {
        allowNull: false
    }
});

database.student.belongsToMany(database.group, {
    through: 'studentGroup',
    as: 'Groups',
    foreignKey: 'studentId'
});

database.group.belongsToMany(database.student, {
    through: 'studentGroup',
    as: 'Students',
    foreignKey: 'groupId'
});

module.exports = database;