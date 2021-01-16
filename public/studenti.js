var listaGrupa = document.getElementById("grupe")

dajGrupeIzBaze();

function dajGrupeIzBaze() {
    $.ajax({
            url: "http://localhost:3000/v2/grupe",
            type: 'GET'
        })
        .done(function (res) {
            //console.log(res);
            var grupeIzBaze = JSON.parse(res);
            //console.log(grupeIzBaze)
            for (var i = 0; i < grupeIzBaze.length; i++) {
                var grupa = document.createElement("option");
                grupa.text = grupeIzBaze[i].naziv;
                listaGrupa.add(grupa);
            }
        })
        .fail(function (error) {
            console.log(error);
        })
}

function dodajStudente() {
    var tekstualnoPolje = document.getElementById("studenti");
    var studenti = tekstualnoPolje.value;
    var pomocniStudenti = studenti.split("\n");
    var postZahtjev = [];

    for (let i = 0; i < pomocniStudenti.length; i++) {
        if (pomocniStudenti[i] != ' ') {
            var student = pomocniStudenti[i].split(",");
            postZahtjev.push({
                ime: student[0],
                index: student[1]
            })
        }
    }
    console.log(postZahtjev)
    console.log(listaGrupa.value)

    $.ajax({
            url: "http://localhost:3000/v2/studenti",
            type: 'POST',
            data: {
                studenti: postZahtjev,
                grupa: listaGrupa.value
            }
        })
        .done(function (res) {
            //dajPredmeteIAktivnost();
            //poruka.innerHTML = res.message;
            console.log(res)
            tekstualnoPolje.value = res.join('\n');
        })
        .fail(function (error) {
            tekstualnoPolje.value = error.statusText;
        })
}