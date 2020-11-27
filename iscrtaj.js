var hours = ['0', '2', '4', '6', '8', '10', '12', '15', '17', '19', '21', '23']
var allHours = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', ' 12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']


var hoursLabel = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '15:00', '17:00', '19:00', '21:00', '23:00']
var alLHoursLabel = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']

function isValidHour(hour) {
  return hour % 1 == 0;
}

function isValidHourWithDecimal(hour) {
  var isValid = false;

  if ((hour % 1 == 0.5 || hour % 1 == 0)) {

    isValid = true;
  }

  return isValid;
}



function iscrtajRaspored(div, dani, satPocetak, satKraj) {

  var body = document.getElementById(div.id);

  if (satPocetak >= satKraj || (satPocetak > 24 || satPocetak < 0) || (satKraj > 24 || satKraj < 0) || !isValidHour(satPocetak) || !isValidHour(satKraj)) {
    body.innerHTML = "Greška - Pogrešan format rasporeda"
    return ("Greška - Pogrešan format rasporeda");
  }

  var tbl = document.createElement('table');
  tbl.style.width = '100%';
  tbl.setAttribute('border', '1');
  var tbdy = document.createElement('tbody');
  var hourArray = []

  for (let i = 0; i < allHours.length; i++) {
    if (allHours[i] == satPocetak) {
      hourArray.push(alLHoursLabel[i])
    }
  }

  for (let i = 0; i < hours.length; i++) {

    if (hours[i] > satPocetak && hours[i] <= satKraj) {

      hourArray.push(hoursLabel[i]);
    }

  }
  hourArray.pop();
  console.log(hourArray)

  var i = 0;
  for (var j = 0, i = 0; j < (satKraj - satPocetak) * 2 && i < hourArray.length; j++) {
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
    td.classList.add("hours")

    tbdy.appendChild(td)
  }

  for (var i = 0; i < dani.length; i++) {
    var tr = document.createElement('tr');
    for (var j = 0; j < (satKraj - satPocetak) * 2 + 1; j++) {
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

}

function elementIsEmpty(el) {
  return (/^(\s|&nbsp;)*$/.test(el.innerHTML))
}

function checkCells(raspored, day, start, columnspan, vrijemePocetak, vrijemeKraj) {
  var body = document.getElementById(raspored.id);
  for (let i = start; i < start + columnspan * 2; i++) {
    let variable = body.getElementsByTagName('tr')[day].getElementsByTagName('td')[i];
    if (elementIsEmpty(variable) && variable.style.display == "none") {
      alert("Greška - termin " + vrijemePocetak + "-" + vrijemeKraj + " zauzet")
      return true;
    }
  }

}

function dodajAktivnost(raspored, naziv, tip, vrijemePocetak, vrijemeKraj, dan) {
  var body = document.getElementById(raspored.id);

  if (raspored == null || body == null) {
    alert("Greška - raspored nije kreiran")

  }
  if (!isValidHourWithDecimal(vrijemePocetak) || !isValidHourWithDecimal(vrijemeKraj) || vrijemeKraj < vrijemePocetak) {
    alert("Greška - Format za vrijeme nije ispravan!")
    return
  }

  var row = body.getElementsByClassName("weekday");
  let indexOfDay;
  for (let i = 0; i < row.length; i++) {

    if (row[i].innerHTML == dan) {
      indexOfDay = i
      break;
    }
  }

  let timesOfTable = body.getElementsByClassName('hours'); //kolone po vremenima


  if (parseInt(timesOfTable[0].innerHTML.substring(0, 2)) > vrijemePocetak || parseInt(timesOfTable[timesOfTable.length - 1].innerHTML.substring(0, 2)) < vrijemeKraj) {
    alert("Greška - Format za raspored nije ispravan");
    return;
  }

  let tempTime = vrijemePocetak - parseInt(timesOfTable[0].innerHTML.substring(0, 2));

  let columnsp = vrijemeKraj - vrijemePocetak;
  if (checkCells(raspored, indexOfDay, tempTime * 2 + 1, columnsp, vrijemePocetak, vrijemeKraj)) {
    return;
  }
  let aktivnost = body.getElementsByTagName('tr')[indexOfDay].getElementsByTagName('td')[tempTime * 2 + 1];
  aktivnost.colSpan = columnsp * 2;
  aktivnost.classList.add("input")
  aktivnost.innerHTML = naziv + "<br>" + tip

  let temp = tempTime * 2 + 1;

  for (let i = temp + 1; i < temp + columnsp * 2; i++) {
    let prazno = body.getElementsByTagName('tr')[indexOfDay].getElementsByTagName('td')[i];
    prazno.style.display = "none"
  }
}


export {
  iscrtajRaspored,
  dodajAktivnost
};