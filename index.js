const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const globalStart = 8;
const globalEnd = 20;
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const db = require('./database/database.js');

db.sequelize.sync({
    force: true
}).then(function () {
    initialize().then(function () {
        console.log("Created tables and inserted basic info!!");
    });
});

function initialize() {
    return new Promise(function (resolve, reject) {
        db.day.create({
            name: "Monday"
        });
        db.day.create({
            name: "Tuesday"
        });
        db.day.create({
            name: "Wednesday"
        });
        db.day.create({
            name: "Thursday"
        });
        db.day.create({
            name: "Friday"
        });
        resolve("Days inserted");
    })
}


function getSubjectsFromFile() {
    let file = [];

    let subjects = [];
    try {
        file = fs.readFileSync('subjects.txt', 'utf-8');
    } catch (error) {
        return 'File subjects.txt does not exist!';
    }

    let subject = file.split('\n');

    for (let s of subject) {
        if (s != '') {
            subjects.push({
                name: s
            });
        }
    }
    return subjects;
}

function getActivitiesFromFile() {
    let file = [];

    let activities = [];
    try {
        file = fs.readFileSync('activities.txt', 'utf-8');
    } catch (error) {
        return 'File activities.txt does not exist!';
    }

    let activity = file.split('\n');

    for (let a of activity) {
        let activityData = a.split(',');
        if (activityData.length == 5 || activityData[0] == '') {
            if (activityData.length == 5) {
                activities.push({
                    name: activityData[0],
                    type: activityData[1],
                    start: parseFloat(activityData[2]),
                    end: parseFloat(activityData[3]),
                    day: activityData[4]
                });
            }

        }
    }
    return activities;
}

function getActivitiesForSubject(subjectName) {
    let file = [];

    let activities = [];
    try {
        file = fs.readFileSync('activities.txt', 'utf-8');
    } catch (error) {
        return 'File activities.txt does not exist!';
    }

    let activity = file.split('\n');
    for (let a of activity) {
        let activityData = a.split(',');
        if (activityData.length == 5) {
            if (activityData[0] == subjectName) {
                activities.push({
                    name: activityData[0],
                    type: activityData[1],
                    start: parseFloat(activityData[2]),
                    end: parseFloat(activityData[3]),
                    day: activityData[4]
                });
            }
        }
    }
    return activities;
}

function validateActivity(activity) {
    exists = false;
    for (let i = 0; i < days.length; i++) {
        if (days[i] == activity.day) {
            exists = true;
        }
    }

    if (activity.name == '' ||
        activity.name == null ||
        activity.type == null ||
        activity.type == '' ||
        activity.start < globalStart || activity.end > globalEnd ||
        activity.start > activity.end ||
        activity.start == null ||
        activity.end == null ||
        activity.start % 0.5 != 0 ||
        activity.end % 0.5 != 0 ||
        !exists
    ) {
        return false;
    }
    return true;
}

function intersectingActivity(activities, newActivity) {
    for (let i = 0; i < activities.length; i++) {
        if (activities[i].day == newActivity.day) {
            if (activities[i].start == newActivity.start ||
                activities[i].end == newActivity.end ||
                (activities[i].start < newActivity.start && activities[i].end > newActivity.end) ||
                (newActivity.start < activities[i].start && newActivity.end > activities[i].end) ||
                (activities[i].start < newActivity.start && activities[i].end > newActivity.start) ||
                (newActivity.start < activities[i].start && newActivity.end > activities[i].start)
            ) {
                return true;
            }
        }
    }
    return false;
}

app.get('/v1/subjects', function (req, res) {
    var subjects = getSubjectsFromFile();

    return res.json(subjects);
});

app.get('/v1/activities', function (req, res) {
    var activities = getActivitiesFromFile();
    return res.json(activities);
});

app.get('/v1/subject/:name/activities/', function (req, res) {
    var param = req.params.name;
    var activities = getActivitiesForSubject(param);

    return res.json(activities);
});

app.post('/v1/subject', function (req, res) {
    var newSubject = req.body;
    var allSubjects = getSubjectsFromFile();

    for (let i = 0; i < allSubjects.length; i++) {
        if (allSubjects[i].name.valueOf().toLowerCase() == newSubject.name.valueOf().toLowerCase()) {
            return res.json({
                message: 'Subject already exists!'
            })
        }
    }

    fs.appendFileSync('subjects.txt', '\n' + newSubject.name);

    return res.json({
        message: 'Subject successfully added!'
    });
});

app.post('/v1/activity', function (req, res) {
    var newActivity = req.body;
    var activities = getActivitiesFromFile();
    if (!validateActivity(newActivity) || intersectingActivity(activities, newActivity)) {
        return res.json({
            message: 'Activity cannot be added!'
        });
    }

    fs.appendFileSync('activities.txt', '\n' + newActivity.name + ',' + newActivity.type + ',' + newActivity.start + ',' + newActivity.end + ',' + newActivity.day);
    return res.json({
        message: 'Activity successfully added!'
    });
});


function removeEmptyLine(text) {
    return text.replace(/^\s*[\r\n]/gm, '');
}


function removeActivityFromFile(activity) {
    var fileContents;
    try {
        fileContents = fs.readFileSync('activities.txt', 'utf-8')
    } catch (err) {
        return false;
    }

    var string = new RegExp('(' + activity + '.*)', 'g')
    var newFileContents = fileContents.toString().replace(string, '');
    newFileContents = removeEmptyLine(newFileContents);
    try {
        fs.writeFileSync('activities.txt', newFileContents);
    } catch (err) {
        return false;
    }
    return true
}

app.delete('/v1/activity/:name', function (req, res) {
    var deleteActivity = req.params.name;

    var successful = removeActivityFromFile(deleteActivity)

    if (successful) {
        return res.json({
            message: 'Activity deleted!'
        })
    } else {
        return res.json({
            message: 'Error - activity is not deleted!'
        })
    }
})

function removeSubjectFromFile(subject) {
    var fileContents;
    try {
        fileContents = fs.readFileSync('subjects.txt', 'utf-8')
    } catch (err) {
        return false;
    }
    var string = new RegExp('(' + subject + '.*)', 'g')
    var newFileContents = fileContents.toString().replace(string, '');
    newFileContents = removeEmptyLine(newFileContents)
    try {
        fs.writeFileSync('subjects.txt', newFileContents);
    } catch (err) {
        return false;
    }

    return removeActivityFromFile(subject);
}

app.delete('/v1/subject/:name', function (req, res) {
    var removeSubject = req.params.name;

    var successful = removeSubjectFromFile(removeSubject)

    if (successful) {
        return res.json({
            message: 'Subject deleted!'
        })
    } else {
        return res.json({
            message: 'Error - subject is not deleted!'
        })
    }

});

function removeAllSubjects() {
    var fileContents;
    try {
        fileContents = fs.readFileSync('subjects.txt')
    } catch (err) {
        return false;
    }
    var string = new RegExp('\n(' + '.*)', 'g')
    var newFileContents = fileContents.toString().replace((string), '');
    string = new RegExp('(' + '.*)', 'g');
    newFileContents = newFileContents.toString().replace(string, '');
    try {
        fs.writeFileSync('subjects.txt', newFileContents);
    } catch (err) {
        return false;
    }
    return true;
}

function removeAllActivities() {
    var fileContents;
    try {
        fileContents = fs.readFileSync('activities.txt')
    } catch (err) {
        return false;
    }
    var string = new RegExp('\n(' + '.*)', 'g')
    var newFileContents = fileContents.toString().replace((string), '');
    string = new RegExp('(' + '.*)', 'g');
    newFileContents = newFileContents.toString().replace(string, '');
    try {
        fs.writeFileSync('activities.txt', newFileContents);
    } catch (err) {
        return false;
    }
    return true;
}

app.delete('/v1/all', function (req, res) {
    if (removeAllSubjects() && removeAllActivities()) {
        return res.json({
            message: 'Files successfully deleted!'
        })
    } else {
        return res.json({
            message: 'Error - files cannot be deleted!'
        });
    }
})
/*
    ****************************************************
                        PREDMET
    ****************************************************
*/

/*
 **CREATE**
 */
app.post('/v2/subject', function (req, res) {
    console.log(req.body)
    var subjectName = req.body.name;
    db.subject.create({
        name: subjectName
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

/*
 **READ**
 */
app.get('/v2/subjects', function (req, res) {
    db.subject.findAll().then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

app.get('/v2/subject/:id', function (req, res) {
    var subjectId = req.params.id;
    db.subject.findOne({
        where: {
            id: subjectId
        }
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

/*
 **DELETE**
 */
app.delete('/v2/subject/:id', function (req, res) {
    var deleteSubject = req.params.id;
    console.log(deleteSubject)
    db.subject.destroy({
        where: {
            id: deleteSubject
        }
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    });
})


/*
 **UPDATE**
 */
app.put('/v2/subject/:id', function (req, res) {
    var updateSubjectId = req.params.id;
    var updateSubjectName = req.body.name;
    db.subject.findOne({
        where: {
            id: updateSubjectId
        }
    }).then(function (response) {
        response.name = updateSubjectName;
        response.save().then(function (response) {
                return res.send(JSON.stringify(response));
            },
            function (error) {
                return res.send(error.message);
            });
        console.log(response)
    })
})






/*
    ****************************************************
                        GRUPA
    ****************************************************
*/

/*
    **CREATE**
*/
app.post('/v2/group', function (req, res) {
    var groupName = req.body.name;
    var subjectId = req.body.SubjectId;
    db.group.create({
        name: groupName,
        SubjectId: subjectId
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

/*
 **READ**
 */
app.get('/v2/groups', function (req, res) {
    db.group.findAll().then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

app.get('/v2/group/:id', function (req, res) {
    var groupId = req.params.id;
    db.group.findOne({
        where: {
            id: groupId
        }
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});


/*
 **DELETE**
 */
app.delete('/v2/group/:id', function (req, res) {
    var deleteGroupId = req.params.id;
    console.log(deleteGroupId)
    db.group.destroy({
        where: {
            id: deleteGroupId
        }
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    });
})


/*
 **UPDATE**
 */
app.put('/v2/group/:id', function (req, res) {
    var updateGroupId = req.params.id;
    var updateGroupName = req.body.name;
    var subjectId = req.body.SubjectId;
    db.group.findOne({
        where: {
            id: updateGroupId
        }
    }).then(function (response) {
        response.name = updateGroupName;
        response.SubjectId = subjectId;
        response.save().then(function (response) {
                return res.send(JSON.stringify(response));
            },
            function (error) {
                return res.send(error.message);
            });
        console.log(response)
    })
})


/*
    ****************************************************
                        AKTIVNOST
    ****************************************************
*/


/*
 **CREATE**
 */
app.post('/v2/activity', function (req, res) {
    var activityName = req.body.name;
    var activityStart = req.body.start;
    var activityEnd = req.body.end;
    var subjectId = req.body.SubjectId;
    var groupId = req.body.GroupId;
    var dayId = req.body.DayId;
    var typeId = req.body.TypeId;
    db.activity.create({
        name: activityName,
        start: activityStart,
        end: activityEnd,
        SubjectId: subjectId,
        GroupId: groupId,
        DayId: dayId,
        TypeId: typeId
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

/*
 **READ**
 */
app.get('/v2/activities', function (req, res) {
    db.activity.findAll().then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

app.get('/v2/activity/:id', function (req, res) {
    var activityId = req.params.id;
    db.activity.findOne({
        where: {
            id: activityId
        }
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});


/*
 **DELETE**
 */
app.delete('/v2/activity/:id', function (req, res) {
    var deleteActivityId = req.params.id;
    db.activity.destroy({
        where: {
            id: deleteActivityId
        }
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    });
})


/*
 **UPDATE**
 */
app.put('/v2/activity/:id', function (req, res) {
    var updateActivityId = req.params.id;
    var updateActivityName = req.body.name;
    var updateActivityStart = req.body.start;
    var updateActivityEnd = req.body.end;
    var subjectId = req.body.SubjectId;
    var groupId = req.body.GroupId;
    var dayId = req.body.DayId;
    var typeId = req.body.TypeId;
    db.activity.findOne({
        where: {
            id: updateActivityId
        }
    }).then(function (response) {
        response.name = updateActivityName;
        response.start = updateActivityStart;
        response.end = updateActivityEnd;
        response.SubjectId = subjectId;
        response.GroupId = groupId;
        response.DayId = dayId;
        response.TypeId = typeId;
        response.save().then(function (response) {
                return res.send(JSON.stringify(response));
            },
            function (error) {
                return res.send(error.message);
            });
        console.log(response)
    })
})



/*
    ****************************************************
                        DAN
    ****************************************************
*/


/*
 **CREATE**
 */
app.post('/v2/day', function (req, res) {
    var dayName = req.body.name;
    db.day.create({
        name: dayName
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

/*
 **READ**
 */
app.get('/v2/days', function (req, res) {
    db.day.findAll().then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

app.get('/v2/day/:id', function (req, res) {
    var dayId = req.params.id;
    db.day.findOne({
        where: {
            id: dayId
        }
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});


/*
 **DELETE**
 */
app.delete('/v2/day/:id', function (req, res) {
    var deleteDayId = req.params.id;
    db.day.destroy({
        where: {
            id: deleteDayId
        }
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    });
})

/*
 **UPDATE**
 */
app.put('/v2/day/:id', function (req, res) {
    var updateDayId = req.params.id;
    var updateDayName = req.body.name;
    db.day.findOne({
        where: {
            id: updateDayId
        }
    }).then(function (response) {
        response.name = updateDayName;
        response.save().then(function (response) {
                return res.send(JSON.stringify(response));
            },
            function (error) {
                return res.send(error.message);
            });
        console.log(response)
    })
})


/*
    ****************************************************
                        TIP
    ****************************************************
*/

/*
 **CREATE**
 */
app.post('/v2/type', function (req, res) {
    var typeName = req.body.name;
    db.type.create({
        name: typeName
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

/*
 **READ**
 */
app.get('/v2/types', function (req, res) {
    db.type.findAll().then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

app.get('/v2/type/:id', function (req, res) {
    var typeId = req.params.id;
    db.type.findOne({
        where: {
            id: typeId
        }
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});


/*
 **DELETE**
 */
app.delete('/v2/type/:id', function (req, res) {
    var deleteTypeId = req.params.id;
    db.type.destroy({
        where: {
            id: deleteTypeId
        }
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    });
})


/*
 **UPDATE**
 */
app.put('/v2/type/:id', function (req, res) {
    var updateTypeId = req.params.id;
    var updateTypeName = req.body.name;
    db.type.findOne({
        where: {
            id: updateTypeId
        }
    }).then(function (response) {
        response.name = updateTypeName;
        response.save().then(function (response) {
                return res.send(JSON.stringify(response));
            },
            function (error) {
                return res.send(error.message);
            });
        console.log(response)
    })
})



/*
    ****************************************************
                        STUDENT
    ****************************************************
*/

/*
 **CREATE**
 */
app.post('/v2/student', function (req, res) {
    var studentName = req.body.ime;
    var studentIndex = req.body.index;
    db.student.create({
        name: studentName,
        index: studentIndex
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

/*
 **READ**
 */
app.get('/v2/students', function (req, res) {
    db.student.findAll().then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

app.get('/v2/student/:id', function (req, res) {
    var studentId = req.params.id;
    db.student.findOne({
        where: {
            id: studentId
        }
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});


/*
 **DELETE**
 */
app.delete('/v2/student/:id', function (req, res) {
    var deleteStudentId = req.params.id;
    db.student.destroy({
        where: {
            id: deleteStudentId
        }
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    });
})


/*
 **UPDATE**
 */
app.put('/v2/student/:id', function (req, res) {
    var updateStudentId = req.params.id;
    var updateStudentName = req.body.ime;
    var updateStudentIndex = req.body.index;
    db.student.findOne({
        where: {
            id: updateStudentId
        }
    }).then(function (response) {
        response.name = updateStudentName;
        response.index = updateStudentIndex;
        response.save().then(function (response) {
                return res.send(JSON.stringify(response));
            },
            function (error) {
                return res.send(error.message);
            });
        console.log(response)
    })
})

app.post('/v2/students', function (req, res) {
    var returnArray = [];
    var newStudents = req.body.students;
    var group = req.body.group;
    db.student.findAll().then(async function (response) {
            var groupForStudents = await db.group.findOne({
                where: {
                    name: group
                }
            })
            var existingStudents = JSON.parse(JSON.stringify(response));
            for (let i = 0; i < newStudents.length; i++) {
                var existingStudent = existingStudents.find(s => s.ime == newStudents[i].ime && s.index == newStudents[i].index);

                if (!existingStudent) {
                    //ne postoji student sa podudarnim imenom i prezimenom, treba provjeriti postoji li student sa istim indexom
                    var existingStudent2 = existingStudents.find(s => s.index == newStudents[i].index);

                    if (!existingStudent2) {
                        //student ne postoji, dodati u bazu
                        db.student.create({
                            name: newStudents[i].name,
                            index: newStudents[i].index
                        }).then(function (response) {
                                response.setGroups(groupForStudents);
                            },
                            function (error) {
                                console.log("AAAAAAAAAA " + error);
                            })
                    } else {
                        //student sa istim indexom postoji
                        returnArray.push('Student ' + newStudents[i].ime + ' not created because student ' + existingStudent2.ime + ' has the same index ' + existingStudent2.index);
                    }
                } else {
                    //postoji student sa istim imenom i prezimenom, update grupu
                    var student = await db.student.findOne({
                        where: {
                            name: newStudents[i].name,
                            index: newStudents[i].index
                        }
                    })
                    var studentGroups = await student.getGroups();
                    var groupIndex = 0;
                    var exists = false;
                    for (let k = 0; k < studentGroups.length; k++) {
                        if (studentGroups[k].dataValues.SubjectId == groupForStudents.dataValues.SubjecId) {
                            groupIndex = k;
                            exists = true;
                        }
                    }
                    if (exists) {
                        await student.removeGroups(studentGroups[groupIndex]);
                        await student.addGroups(groupForStudents);
                    } else {
                        await student.addGroups(groupForStudents)
                    }

                }
            }
            return res.send(returnArray);
        },
        function (error) {
            console.log("BBBBBBB " + error)
        })
})


/*
                ZADATAK 3                   
*/

app.post('/z3/subject', async function (req, res) {
    var newSubject = req.body.name;
    db.subject.findOrCreate({
        where: {
            name: newSubject
        }
    }).then(function (response) {
        return res.json({
            message: "Success!"
        })
    }, function (error) {
        console.log(error.message)
    })
})

app.delete('/z3/subject/:name', async function (req, res) {
    var subject = req.params.name;
    db.subject.destroy({
        where : {
            name: subject
        }
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    });

})

function intersectingActivitiesForDay(allActivities, newActivity, dayName) {
    if (dayName == newActivity.day) {
        for (let i = 0; i < allActivities.length; i++) {
            if (allActivities[i].start == newActivity.start ||
                allActivities[i].end == newActivity.end ||
                (allActivities[i].start < newActivity.start && allActivities[i].end > newActivity.end) ||
                (newActivity.start < allActivities[i].start && newActivity.end > allActivities[i].end) ||
                (allActivities[i].start < newActivity.start && allActivities[i].end > newActivity.start) ||
                (newActivity.start < allActivities[i].start && newActivity.end > allActivities[i].start)
            ) {
                return true;
            }

        }
    }
    return false;
}

function validateAllActivities(activity) {
    exists = false;
    for (let i = 0; i < days.length; i++) {
        if (days[i] == activity.day) {
            exists = true;
        }
    }

    if (activity.name == '' ||
        activity.name == null ||
        activity.type == null ||
        activity.type == '' ||
        activity.start < globalStart || activity.end > globalEnd ||
        activity.start > activity.end ||
        activity.start == null ||
        activity.end == null ||
        activity.start % 0.5 != 0 ||
        activity.end % 0.5 != 0 ||
        !exists
    ) {
        return false;
    }
    return true;
}


app.post('/z3/activity', async function (req, res) {
    var dayToAdd = req.body.day;
    var dayId = (await db.day.findOrCreate({
        where: {
            name: dayToAdd
        }
    }))[0].dataValues.id;

    var activityToAdd = req.body;

    var dayName = (await db.day.findByPk(dayId)).dataValues.name;

    db.activity.findAll().then(async function (response) {
        var activitiesFromDB = JSON.parse(JSON.stringify(response));
        if (intersectingActivitiesForDay(activitiesFromDB, activityToAdd, dayName) || !((validateAllActivities(activityToAdd)))) {
            return res.json({
                message: 'Activity is not valid!'
            });
        }

        var subjectToAdd = req.body.name;
        var subjectToAddId = (await db.subject.findOrCreate({
            where: {
                name: subjectToAdd
            }
        }))[0].dataValues.id

        var typeToAdd = req.body.type;
        var typeId = (await db.type.findOrCreate({
            where: {
                name: typeToAdd
            }
        }))[0].dataValues.id;

        var activityTimeStart = req.body.start;
        var activityTimeEnd = req.body.end;


        db.activity.create({
            name: typeToAdd,
            start: activityTimeStart,
            end: activityTimeEnd,
            SubjectId: subjectToAddId,
            GroupId: null,
            DayId: dayId,
            TypeId: typeId
        }).then(function (response) {
            return res.send({
                message: "Activity successfully added."
            })
        })
    });

})



app.listen(3000);