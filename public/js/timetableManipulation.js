var subjectList = [];
var activityList = [];
var message = document.getElementById("message");


getSubjectsAndActivities();

function getSubjectsAndActivities() {
    $.ajax({
            url: "http://localhost:3000/v2/subjects",
            type: 'GET',
            dataType: 'json'
        })
        .done(function (res) {
            for (var subject of res) {
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
    var obj = {
        name: subjectName
    };
    var myData = JSON.stringify(obj);
    $.ajax({
            url: "http://localhost:3000/z3/subject",
            type: 'POST',
            data: myData,
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function (res) {
            var obj2 = {
                name: subjectName,
                type: activityName,
                start: startTime,
                end: endTime,
                day: weekday
            }
            var myData2 = JSON.stringify(obj2);
            $.ajax({
                    url: "http://localhost:3000/z3/activity",
                    type: 'POST',
                    data: myData2,
                    dataType: 'json',
                    contentType: 'application/json'
                })
                .done(function (res) {
                    if(res.message == "Activity is not valid!"){
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
    var obj = {
        name: subjectName,
        type: activityName,
        start: startTime,
        end: endTime,
        day: weekday
    }
    var myData = JSON.stringify(obj);
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
    var subjectName = document.getElementById('subject').value;
    var activityName = document.getElementById('activity').value;
    var startTime = document.getElementById('timeStart');
    
    var hours = parseInt(startTime.value.substring(0,2));
    var minutes = parseInt(startTime.value.substring(3,5)) /60;

    var start = hours + minutes;
    var end = document.getElementById('timeEnd');
    
    hours = parseInt(end.value.substring(0,2));
    minutes = parseInt(end.value.substring(3,5)) /60;

    var endTime = hours + minutes;

    var weekday = document.getElementById('day').value;

    var subjectExists = subjectList.includes(subjectName);


    if (subjectExists) {
        sendNewActivity(subjectName, activityName, start, endTime, weekday);
    } else {
        sendSubjectWithActivity(subjectName, activityName, start, endTime, weekday);
    }
}