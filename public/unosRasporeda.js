var listaPredmeta = [];
var listaAktivnosti = [];
var poruka = document.getElementById("poruka");


dajPredmeteIAktivnost();

function dajPredmeteIAktivnost() {
    $.ajax({
            url: "http://localhost:3000/v2/predmeti",
            type: 'GET',
            dataType: 'json'
        })
        .done(function (res) {
            for (var predmet of res) {
                listaPredmeta.push(predmet.naziv);
            }
            $.ajax({
                    url: "http://localhost:3000/v2/aktivnosti",
                    type: 'GET',
                    dataType: 'json'
                })
                .done(function (res) {
                    listaAktivnosti = res;
                })
                .fail(function (error) {
                    poruka.innerHTML = error.statusText;
                })
        })
        .fail(function (error) {
            poruka.innerHTML = error.statusText;
        })
}

function izbrisiPredmet(predmet) {
    $.ajax({
            url: "http://localhost:3000/z3/predmet/" + predmet,
            method: 'DELETE'
        })
        .done(function (res) {
            dajPredmeteIAktivnost();
        })
        .fail(function (error) {
            poruka.innerHTML = error.statusText;
        })
}

function posaljiPredmetIAktivnost(nazivPredmeta, nazivAktivnosti, vrijemePocetka, vrijemeKraja, danUSedmici) {
    var obj = {
        naziv: nazivPredmeta
    };
    var myData = JSON.stringify(obj);
    $.ajax({
            url: "http://localhost:3000/z3/predmet",
            type: 'POST',
            data: myData,
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function (res) {
            //treba dodati i aktivnost
            var obj2 = {
                naziv: nazivPredmeta,
                tip: nazivAktivnosti,
                pocetak: vrijemePocetka,
                kraj: vrijemeKraja,
                dan: danUSedmici
            }
            var myData2 = JSON.stringify(obj2);
            console.log(myData2)
            $.ajax({
                    url: "http://localhost:3000/z3/aktivnost",
                    type: 'POST',
                    data: myData2,
                    dataType: 'json',
                    contentType: 'application/json'
                })
                .done(function (res) {
                    if(res.message == "Aktivnost nije validna!"){
                        izbrisiPredmet(nazivPredmeta);
                        console.log("ovdje")
                    } else {
                        dajPredmeteIAktivnost();
                        console.log("bbb")
                    }
                    poruka.innerHTML = res.message;
                })
                .fail(function (error) {
                    poruka.innerHTML = error.statusText;
                })
        })
        .fail(function (error) {
            poruka.innerHTML = error.statusText;
        })
}

function posaljiAktivnost(nazivPredmeta, nazivAktivnosti, vrijemePocetka, vrijemeKraja, danUSedmici) {
    var obj = {
        naziv: nazivPredmeta,
        tip: nazivAktivnosti,
        pocetak: vrijemePocetka,
        kraj: vrijemeKraja,
        dan: danUSedmici
    }
    var myData = JSON.stringify(obj);
    $.ajax({
            url: "http://localhost:3000/z3/aktivnost",
            type: 'POST',
            data: myData,
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function (res) {
            dajPredmeteIAktivnost();
            poruka.innerHTML = res.message;
        })
        .fail(function (error) {
            poruka.innerHTML = error.statusText;
        })
}

function dodajAktivnost() {
    var nazivPredmeta = document.getElementById('subject').value;
    var nazivAktivnosti = document.getElementById('activity').value;
    var vp = document.getElementById('timeStart');
    
    var sati = parseInt(vp.value.substring(0,2)); 
    var minute = parseInt(vp.value.substring(3,5)) /60;

    var vrijemePocetka = sati + minute;
    var vk = document.getElementById('timeEnd');
    
    sati = parseInt(vk.value.substring(0,2)); 
    minute = parseInt(vk.value.substring(3,5)) /60;

    var vrijemeKraja = sati + minute;

    console.log(vrijemePocetka + " " + vrijemeKraja)

    var danUSedmici = document.getElementById('day').value;

    var predmetPostoji = listaPredmeta.includes(nazivPredmeta);


    if (predmetPostoji) {
        posaljiAktivnost(nazivPredmeta, nazivAktivnosti, vrijemePocetka, vrijemeKraja, danUSedmici);
    } else {
        posaljiPredmetIAktivnost(nazivPredmeta, nazivAktivnosti, vrijemePocetka, vrijemeKraja, danUSedmici);
    }
}