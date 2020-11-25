var hours = ['0', '2', '4', '6', '8', '10', '12', '15', '17', '19', '21', '23']
var hoursLabel = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '15:00', '17:00', '19:00', '21:00', '23:00']

function isValidHour(hour){
  var isValid = false;
  for(let i = 0; i < hours.length; i++){
    if(hours[i] == hour){
      isValid = true;
      break;
    }
  }
  return isValid;
}

function isValidHourWithDecimal(hour){
  var isValid = false;

    if((hour%1 == 0.5 || hour%1 == 0)){
      
      isValid = true;
    }
  
  return isValid;
}



function iscrtajRaspored(div, dani, satPocetak, satKraj){
    var body = document.getElementById(div);
    console.log("bla")
    if(satPocetak>=satKraj || (satPocetak > 24 || satPocetak < 0) || (satKraj > 24 || satKraj <0) || !isValidHour(satPocetak) || !isValidHour(satKraj)){
      body.innerHTML = "Greška"
      return;
    }

    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');
    var hourArray= []
    for(let i = 0; i < hours.length; i++){
      if(hours[i] >= satPocetak && hours[i] <= satKraj){
        if(hours[i] == "15") {
          exists = true;
          indexOfExists = hourArray.length ;
        }
        hourArray.push(hoursLabel[i]);
      }
    }
    hourArray.pop();

    var i = 0; 
    for(var j = 0, i = 0; j < (satKraj - satPocetak)*2 && i < hourArray.length; j++){
      var td = document.createElement('td')
      if(j == 0){
        td.id = "empty"
        tbdy.appendChild(td);
        continue;
      }

        td.innerText = hourArray[i]
        if(hourArray[i] == "12:00" || hourArray.length == i+1) td.colSpan = 6;
        else td.colSpan = 4;
        i++
      

        td.classList.add("border", "hours","td")

      tbdy.appendChild(td)
    }

    for (var i = 0; i < dani.length; i++) {
      var tr = document.createElement('tr');
      for (var j = 0; j < (satKraj-satPocetak)*2+1; j++) {
          var td = document.createElement('td');
          if(j == 0){
            td.classList.add("weekday")
            td.innerText = dani[i]
          }
          
          tr.appendChild(td)
          
      }
      tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.style.width = "1000px";
    body.style.height = "600px"
    body.style.margin = "auto"
    tbl.style.border = "none"
    body.appendChild(tbl);
}



function dodajAktivnost(raspored, naziv, tip, vrijemePocetak, vrijemeKraj, dan){
  var body = document.getElementById(raspored);

  if(raspored == null || body == null) {
    alert("Greška - raspored nije kreiran")
  }
  if(!isValidHourWithDecimal(vrijemePocetak) || !isValidHourWithDecimal(vrijemeKraj) || vrijemeKraj < vrijemePocetak){
    alert("Greška - Format za vrijeme nije ispravan!")
  }

  var row = document.getElementsByClassName("weekday");
  let indexOfDay;
  for(let i = 0; i < row.length; i++){
    console.log(row[i].innerHTML)
    if(row[i].innerHTML == dan){
      indexOfDay = i
      break;
    }
  }
  let v = document.getElementsByTagName('tr')[indexOfDay].getElementsByTagName('td'); //red dana u kojem ubacujemo aktivnost
  let timesOfTable = body.getElementsByClassName('hours'); //kolone po vremenima
  

  if(parseInt(timesOfTable[0].innerHTML.substring(0,2)) > vrijemePocetak || parseInt(timesOfTable[timesOfTable.length-1].innerHTML.substring(0,2)) < vrijemeKraj){
    alert("Greška - Format za raspored nije ispravan");
  }
  
  let tempTime = vrijemePocetak - parseInt(timesOfTable[0].innerHTML.substring(0,2));

  let columnsp = vrijemeKraj - vrijemePocetak;

  let aktivnost = document.getElementsByTagName('tr')[indexOfDay].getElementsByTagName('td')[tempTime*timesOfTable[0].colSpan/2+1];
  aktivnost.colSpan = columnsp*2;
  aktivnost.classList.add("input")
  aktivnost.innerHTML = naziv + "<br>" + tip

  let temp = tempTime*timesOfTable[0].colSpan/2+1;

  for(let i = temp + 1; i < temp + columnsp*2; i++){
    let prazno = document.getElementsByTagName('tr')[indexOfDay].getElementsByTagName('td')[i];
    prazno.style.display = "none"
  }
}


//export {iscrtajRaspored, dodajAktivnost};