const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const pocetak = 8;
const kraj = 20;
const dani = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'];

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


function dajPredmeteIzDatoteke() {
    let datoteka = [];

    let predmeti = [];
    try {
        datoteka = fs.readFileSync('predmeti.txt', 'utf-8');
    } catch (error) {
        return 'Datoteka predmeti.txt ne postojii!';
    }

    let izdvoji = datoteka.split('\n');

    for (let linija of izdvoji) {
        if (linija != '') {
            predmeti.push({
                naziv: linija
            });
        }
    }
    return predmeti;
}

function dajAktivnostiIzDatoteke() {
    let datoteka = [];

    let aktivnosti = [];
    try {
        datoteka = fs.readFileSync('aktivnosti.txt', 'utf-8');
    } catch (error) {
        return 'Datoteka aktivnosti.txt ne postojii!';
    }

    let izdvoji = datoteka.split('\n');

    for (let linija of izdvoji) {
        let podaci = linija.split(',');
        if (podaci.length == 5 || podaci[0] == '') {
            if (podaci.length == 5) {
                aktivnosti.push({
                    naziv: podaci[0],
                    tip: podaci[1],
                    pocetak: parseFloat(podaci[2]),
                    kraj: parseFloat(podaci[3]),
                    dan: podaci[4]
                });
            }

        } 
    }
    return aktivnosti;
}

function dajAktivnostiZaPredmet(nazivPredmeta) {
    let datoteka = [];

    let aktivnosti = [];
    try {
        datoteka = fs.readFileSync('aktivnosti.txt', 'utf-8');
    } catch (error) {
        return 'Datoteka aktivnosti.txt ne postojii!';
    }

    let izdvoji = datoteka.split('\n');
    for (let linija of izdvoji) {
        let podaci = linija.split(',');
        if (podaci.length == 5) {
            if (podaci[0] == nazivPredmeta) {
                aktivnosti.push({
                    naziv: podaci[0],
                    tip: podaci[1],
                    pocetak: parseFloat(podaci[2]),
                    kraj: parseFloat(podaci[3]),
                    dan: podaci[4]
                });
            }
        } 
    }
    return aktivnosti;
}

function validirajAktivnost(aktivnost) {
    postoji = false;
    for (let i = 0; i < dani.length; i++) {
        if (dani[i] == aktivnost.dan) {
            postoji = true;
        }
    }

    if (aktivnost.naziv == '' ||
        aktivnost.naziv == null ||
        aktivnost.tip == null ||
        aktivnost.tip == '' ||
        aktivnost.pocetak < pocetak || aktivnost.kraj > kraj ||
        aktivnost.pocetak > aktivnost.kraj ||
        aktivnost.pocetak == null ||
        aktivnost.kraj == null ||
        aktivnost.pocetak % 0.5 != 0 ||
        aktivnost.kraj % 0.5 != 0 ||
        !postoji
    ) {
        return false;
    }
    return true;
}

function podudarnaAktivnost(aktivnosti, dodajAktivnost) {
    for (let i = 0; i < aktivnosti.length; i++) {
        if (aktivnosti[i].dan == dodajAktivnost.dan) {
            if (aktivnosti[i].pocetak == dodajAktivnost.pocetak ||
                aktivnosti[i].kraj == dodajAktivnost.kraj ||
                (aktivnosti[i].pocetak < dodajAktivnost.pocetak && aktivnosti[i].kraj > dodajAktivnost.kraj) ||
                (dodajAktivnost.pocetak < aktivnosti[i].pocetak && dodajAktivnost.kraj > aktivnosti[i].kraj) ||
                (aktivnosti[i].pocetak < dodajAktivnost.pocetak && aktivnosti[i].kraj > dodajAktivnost.pocetak) ||
                (dodajAktivnost.pocetak < aktivnosti[i].pocetak && dodajAktivnost.kraj > aktivnosti[i].pocetak)
            ) {
                return true;
            }
        }
    }
    return false;
}

app.get('/predmeti', function (req, res) {
    var predmeti = dajPredmeteIzDatoteke();

    return res.json(predmeti);
});

app.get('/aktivnosti', function (req, res) {
    var aktivnosti = dajAktivnostiIzDatoteke();
    return res.json(aktivnosti);
});

app.get('/predmet/:naziv/aktivnost/', function (req, res) {
    var parametar = req.params.naziv;
    var aktivnosti = dajAktivnostiZaPredmet(parametar);

    return res.json(aktivnosti);
});

app.post('/predmet', function (req, res) {
    var dodajPredmet = req.body;
    var predmeti = dajPredmeteIzDatoteke();

    for (let i = 0; i < predmeti.length; i++) {
        if (predmeti[i].naziv.valueOf().toLowerCase() == dodajPredmet.naziv.valueOf().toLowerCase()) {
            return res.json({
                message: 'Naziv predmeta postoji!'
            })
        }
    }

    fs.appendFileSync('predmeti.txt', '\n' + dodajPredmet.naziv);

    return res.json({
        message: 'Uspješno dodan predmet!'
    });
});

app.post('/aktivnost', function (req, res) {
    var dodajAktivnost = req.body;
    var aktivnosti = dajAktivnostiIzDatoteke();
    if (!validirajAktivnost(dodajAktivnost) || podudarnaAktivnost(aktivnosti, dodajAktivnost)) {
        return res.json({
            message: 'Aktivnost nije validna!'
        });
    }

    fs.appendFileSync('aktivnosti.txt', '\n' + dodajAktivnost.naziv + ',' + dodajAktivnost.tip + ',' + dodajAktivnost.pocetak + ',' + dodajAktivnost.kraj + ',' + dodajAktivnost.dan);
    return res.json({
        message: 'Uspješno dodana aktivnost!'
    });
});


function removeEmptyLine(text) {
    return text.replace(/^\s*[\r\n]/gm, '');
}


function obrisiAktivnostIzDatoteke(aktivnost) {
    var fileContents;
    try {
        fileContents = fs.readFileSync('aktivnosti.txt', 'utf-8')
    } catch (err) {
        return false;
    }

    var string = new RegExp('(' + aktivnost + '.*)', 'g')
    var novaDatoteka = fileContents.toString().replace(string, '');
    novaDatoteka = removeEmptyLine(novaDatoteka);
    try {
        fs.writeFileSync('aktivnosti.txt', novaDatoteka);
    } catch (err) {
        return false;
    }
    return true
}

app.delete('/aktivnost/:naziv', function (req, res) {
    var izbrisiAktivnost = req.params.naziv;

    var uspjelo = obrisiAktivnostIzDatoteke(izbrisiAktivnost)

    if (uspjelo) {
        return res.json({
            message: 'Uspješno obrisana aktivnost!'
        })
    } else {
        return res.json({
            message: 'Greška - aktivnost nije obrisana!'
        })
    }
})

function obrisiPredmetIzDatoteke(predmet) {
    var fileContents;
    try {
        fileContents = fs.readFileSync('predmeti.txt', 'utf-8')
    } catch (err) {
        return false;
    }
    var string = new RegExp('(' + predmet + '.*)', 'g')
    var novaDatoteka = fileContents.toString().replace(string, '');
    novaDatoteka = removeEmptyLine(novaDatoteka)
    try {
        fs.writeFileSync('predmeti.txt', novaDatoteka);
    } catch (err) {
        return false;
    }

    return obrisiAktivnostIzDatoteke(predmet);
}

app.delete('/predmet/:naziv', function (req, res) {
    var izbrisiPredmet = req.params.naziv;

    var uspjelo = obrisiPredmetIzDatoteke(izbrisiPredmet)

    if (uspjelo) {
        return res.json({
            message: 'Uspješno obrisan predmet!'
        })
    } else {
        return res.json({
            message: 'Greška - predmet nije obrisan!'
        })
    }

});

function obrisiSvePredmete() {
    var fileContents;
    try {
        fileContents = fs.readFileSync('predmeti.txt')
    } catch (err) {
        return false;
    }
    var string = new RegExp('\n(' + '.*)', 'g')
    var novaDatoteka = fileContents.toString().replace((string), '');
    string = new RegExp('(' + '.*)', 'g');
    novaDatoteka = novaDatoteka.toString().replace(string, '');
    try {
        fs.writeFileSync('predmeti.txt', novaDatoteka);
    } catch (err) {
        return false;
    }
    return true;
}

function obrisiSveAktivnosti() {
    var fileContents;
    try {
        fileContents = fs.readFileSync('aktivnosti.txt')
    } catch (err) {
        return false;
    }
    var string = new RegExp('\n(' + '.*)', 'g')
    var novaDatoteka = fileContents.toString().replace((string), '');
    string = new RegExp('(' + '.*)', 'g');
    novaDatoteka = novaDatoteka.toString().replace(string, '');
    try {
        fs.writeFileSync('aktivnosti.txt', novaDatoteka);
    } catch (err) {
        return false;
    }
    return true;
}

app.delete('/all', function (req, res) {
    if (obrisiSvePredmete() && obrisiSveAktivnosti()) {
        return res.json({
            message: 'Uspješno obrisan sadržaj datoteka!'
        })
    } else {
        return res.json({
            message: 'Greška - sadržaj datoteka nije moguće obrisati!'
        });
    }
})
app.listen(3000);