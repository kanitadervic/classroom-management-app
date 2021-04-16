const groupList = document.getElementById("groups");

getGroupsFromDataBase();

function getGroupsFromDataBase() {
    $.ajax({
        url: "http://localhost:3000/v2/groups",
        type: 'GET'
    })
        .done(function (res) {
            const groupsFromDB = JSON.parse(res);
            console.log(groupsFromDB)
            for (let i = 0; i < groupsFromDB.length; i++) {
                const group = document.createElement("option");
                group.text = groupsFromDB[i].name;
                groupList.add(group);
            }
        })
        .fail(function (error) {
            console.log(error);
        })
}

function addStudents() {
    const textAreaValue = document.getElementById("students");
    const students = textAreaValue.value;
    const studentsSplit = students.split("\n");
    const postRequest = [];

    for (let i = 0; i < studentsSplit.length; i++) {
        if (studentsSplit[i] != ' ') {
            const student = studentsSplit[i].split(",");
            postRequest.push({
                name: student[0],
                index: student[1]
            })
        }
    }

    $.ajax({
        url: "http://localhost:3000/v2/students",
        type: 'POST',
        data: {
            students: postRequest,
            group: groupList.value
        }
    })
        .done(function (res) {
            textAreaValue.value = res.join('\n');
        })
        .fail(function (error) {
            console.log(error)
            textAreaValue.value = error.statusText;
        })
}