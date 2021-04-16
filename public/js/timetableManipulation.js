const subjectList = [];
let activityList = [];
const message = document.getElementById("message");


getSubjectsAndActivities();

function getSubjectsAndActivities() {
    $.ajax({
        url: "http://localhost:3000/v2/subjects",
        type: 'GET',
        dataType: 'json'
    })
        .done(function (res) {
            for (let subject of res) {
                subjectList.push(subject.name);
            }
            $.ajax({
                url: "http://localhost:3000/v2/activities",
                type: 'GET',
                dataType: 'json'
            })
                .done(function (res) {
                    activityList = res;
                })
                .fail(function (error) {
                    message.innerHTML = error.statusText;
                })
        })
        .fail(function (error) {
            message.innerHTML = error.statusText;
        })
}

function deleteSubject(subject) {
    $.ajax({
        url: "http://localhost:3000/z3/subject/" + subject,
        method: 'DELETE'
    })
        .done(function (res) {
            getSubjectsAndActivities();
        })
        .fail(function (error) {
            message.innerHTML = error.statusText;
        })
}

function sendSubjectWithActivity(subjectName, activityName, startTime, endTime, weekday) {
    const obj = {
        name: subjectName
    };
    const myData = JSON.stringify(obj);
    $.ajax({
        url: "http://localhost:3000/z3/subject",
        type: 'POST',
        data: myData,
        dataType: 'json',
        contentType: 'application/json'
    })
        .done(function (res) {
            const obj2 = {
                name: subjectName,
                type: activityName,
                start: startTime,
                end: endTime,
                day: weekday
            };
            const myData2 = JSON.stringify(obj2);
            $.ajax({
                url: "http://localhost:3000/z3/activity",
                type: 'POST',
                data: myData2,
                dataType: 'json',
                contentType: 'application/json'
            })
                .done(function (res) {
                    if (res.message == "Activity is not valid!") {
                        deleteSubject(subjectName);
                    } else {
                        getSubjectsAndActivities();
                    }
                    message.innerHTML = res.message;
                })
                .fail(function (error) {
                    message.innerHTML = error.statusText;
                })
        })
        .fail(function (error) {
            message.innerHTML = error.statusText;
        })
}

function sendNewActivity(subjectName, activityName, startTime, endTime, weekday) {
    const obj = {
        name: subjectName,
        type: activityName,
        start: startTime,
        end: endTime,
        day: weekday
    };
    const myData = JSON.stringify(obj);
    $.ajax({
        url: "http://localhost:3000/z3/activity",
        type: 'POST',
        data: myData,
        dataType: 'json',
        contentType: 'application/json'
    })
        .done(function (res) {
            getSubjectsAndActivities();
            message.innerHTML = res.message;
        })
        .fail(function (error) {
            message.innerHTML = error.statusText;
        })
}

function addActivity() {
    const subjectName = document.getElementById('subject').value;
    const activityName = document.getElementById('activity').value;
    const startTime = document.getElementById('timeStart');

    let hours = parseInt(startTime.value.substring(0, 2));
    let minutes = parseInt(startTime.value.substring(3, 5)) / 60;

    const start = hours + minutes;
    const end = document.getElementById('timeEnd');

    hours = parseInt(end.value.substring(0, 2));
    minutes = parseInt(end.value.substring(3, 5)) / 60;

    const endTime = hours + minutes;

    const weekday = document.getElementById('day').value;

    const subjectExists = subjectList.includes(subjectName);


    if (subjectExists) {
        sendNewActivity(subjectName, activityName, start, endTime, weekday);
    } else {
        sendSubjectWithActivity(subjectName, activityName, start, endTime, weekday);
    }
}