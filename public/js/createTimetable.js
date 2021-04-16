var hours = ['0', '2', '4', '6', '8', '10', '12', '15', '17', '19', '21', '23']
var allHours = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', ' 12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']


var hoursLabel = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '15:00', '17:00', '19:00', '21:00', '23:00']
var alLHoursLabel = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']

function isValidHour(hour) {
  return hour % 1 == 0;
}

var isValidHourWithDecimal = function (hour) {
  var isValid = false;

  if ((hour % 1 == 0.5 || hour % 1 == 0)) {

    isValid = true;
  }

  return isValid;
}



var makeTimeTable = function (div, dani, startTime, endTime) {

  var body = document.getElementById(div.id);

  if (startTime >= endTime || (startTime > 24 || startTime < 0) || (endTime > 24 || endTime < 0) || !isValidHour(startTime) || !isValidHour(endTime)) {
    body.innerHTML = "Error - wrong timetable format"
    body.style.textAlign = "center"
    return ("Error - wrong timetable format");
  }

  var tbl = document.createElement('table');
  tbl.style.width = '100%';
  tbl.setAttribute('border', '1');
  var tbdy = document.createElement('tbody');
  var hourArray = []

  for (let i = 0; i < allHours.length; i++) {
    if (allHours[i] == startTime) {
      hourArray.push(alLHoursLabel[i])
    }
  }

  for (let i = 0; i < hours.length; i++) {
    if (hours[i] > startTime && hours[i] <= endTime) {

      hourArray.push(hoursLabel[i]);
    }
  }
  hourArray.pop();

  var i = 0;
  for (var j = 0, i = 0; j < (endTime - startTime) * 2 && i < hourArray.length; j++) {
    var td = document.createElement('td')
    if (j == 0) {
      td.id = "empty"
      tbdy.appendChild(td);
      continue;
    }

    td.innerText = hourArray[i]
    if (hourArray[i] == "12:00" || hourArray.length == i + 1) td.colSpan = 6;
    else if (parseInt(hourArray[0].substring(0, 2)) + 1 == parseInt(hourArray[1].substring(0, 2)) && i == 0) td.colSpan = 2;
    else td.colSpan = 4;
    i++


    td.classList.add("border", "hours", "td")

    tbdy.appendChild(td)
  }

  for (var i = 0; i < dani.length; i++) {
    var tr = document.createElement('tr');
    for (var j = 0; j < (endTime - startTime) * 2 + 1; j++) {
      var td = document.createElement('td');
      if (j == 0) {
        td.classList.add("weekday")
        td.innerText = dani[i]
      }

      tr.appendChild(td)

    }
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);

  tbl.style = "table"
  tbl.style.border = "none"
  tbl.style.margin = "auto"
  body.appendChild(tbl);
  return body;
}

var elementIsEmpty = function (el) {

  return (/^(\s|&nbsp;)*$/.test(el))
}

var checkCells = function (timetable, day, start, columnspan, timeStart, timeEnd) {
  var body = document.getElementById(timetable.id);
  for (let i = start; i < start + columnspan * 2; i++) {
    let variable = body.getElementsByTagName('tr')[day].getElementsByTagName('td')[i];
    if (!elementIsEmpty(variable.innerHTML) || variable.style.display == "none") {
      alert("Error - term " + timeStart + "-" + timeEnd + " is taken")
      return true;
    }
  }

}

var addActivity = function (timetable, name, type, timeStart, timeEnd, weekday) {
  var body = document.getElementById(timetable.id);

  if (timetable == null || body == null) {
    alert("Error - no available timetable")
    return ("Error - no available timetable");

  }
  if (!isValidHourWithDecimal(timeStart) || !isValidHourWithDecimal(timeEnd) || timeEnd < timeStart || timeEnd == timeStart) {
    alert("Error - time format is not valid!")
    return ("Error - time format is not valid!");
  }

  var row = body.getElementsByClassName("weekday");
  let indexOfDay = -1;
  for (let i = 0; i < row.length; i++) {

    if (row[i].innerHTML == weekday) {
      indexOfDay = i
      break;
    }
  }
  if (indexOfDay == -1) {
    alert("Error - weekday does not exist in table")
    return ("Error - weekday does not exist in table");
  }
  let timesOfTable = body.getElementsByClassName('hours'); //kolone po vremenima

  if (parseInt(timesOfTable[0].innerHTML.substring(0, 2)) > timeStart || parseInt(timesOfTable[timesOfTable.length - 1].innerHTML.substring(0, 2) + 2) < timeEnd) {
    alert("Error - timetable format is not valid!");
    return ("Error - timetable format is not valid!");
  }

  let tempTime = timeStart - parseInt(timesOfTable[0].innerHTML.substring(0, 2));

  let columnsp = timeEnd - timeStart;
  if (checkCells(timetable, indexOfDay, tempTime * 2 + 1, columnsp, timeStart, timeEnd)) {
    return ("Error - term " + timeStart + "-" + timeEnd + " is not available");
  }
  let activity = body.getElementsByTagName('tr')[indexOfDay].getElementsByTagName('td')[tempTime * 2 + 1];
  activity.colSpan = columnsp * 2;
  activity.classList.add("input")
  activity.innerHTML = name + "<br>" + type

  let temp = tempTime * 2 + 1;

  for (let i = temp + 1; i < temp + columnsp * 2; i++) {
    let empty = body.getElementsByTagName('tr')[indexOfDay].getElementsByTagName('td')[i];
    empty.style.display = "none"
  }
  return body
}


export {
  makeTimeTable,
  addActivity
};