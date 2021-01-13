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

const db = require('./database.js');

db.sequelize.sync().then(function () {
    initialize().then(function () {
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        //process.exit();
    });
});

function initialize() {
    return new Promise(function (resolve, reject) {
        db.dan.create({
            naziv: "Ponedjeljak"
        });
        db.dan.create({
            naziv: "Utorak"
        });
        db.dan.create({
            naziv: "Srijeda"
        });
        db.dan.create({
            naziv: "Četvrtak"
        });
        db.dan.create({
            naziv: "Petak"
        });
        resolve("Ucitao dane");
    })
}


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
/*
    ****************************************************
                        PREDMET
    ****************************************************
*/

/*
    **CREATE**
*/
app.post('/v2/predmet', function (req, res) {
    var nazivPredmeta = req.body.naziv;
    db.predmet.create({
        naziv: nazivPredmeta
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

/*
    **READ**
*/
app.get('/v2/predmeti', function (req, res) {
    db.predmet.findAll().then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

app.get('/v2/predmet/:id', function (req, res) {
    var predmetId = req.params.id;
    db.predmet.findOne({
        where: {
            id: predmetId
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
app.delete('/v2/predmet/:id', function (req, res) {
    var izbrisiPredmetId = req.params.id;
    console.log(izbrisiPredmetId)
    db.predmet.destroy({
        where: {
            id: izbrisiPredmetId
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
app.put('/v2/predmet/:id', function (req, res) {
    var updatePredmetId = req.params.id;
    var updatePredmetNaziv = req.body.naziv;
    console.log(updatePredmetId + " " + updatePredmetNaziv)
    db.predmet.findOne({
        where: {
            id: updatePredmetId
        }
    }).then(function (response) {
        response.naziv = updatePredmetNaziv;
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
app.post('/v2/grupa', function (req, res) {
    var nazivGrupe = req.body.naziv;
    db.grupa.create({
        naziv: nazivGrupe
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

/*
    **READ**
*/
app.get('/v2/grupe', function (req, res) {
    db.grupa.findAll().then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

app.get('/v2/grupa/:id', function (req, res) {
    var grupaId = req.params.id;
    db.grupa.findOne({
        where: {
            id: grupaId
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
app.delete('/v2/grupa/:id', function (req, res) {
    var izbrisiGrupuId = req.params.id;
    console.log(izbrisiGrupuId)
    db.grupa.destroy({
        where: {
            id: izbrisiGrupuId
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
app.put('/v2/grupa/:id', function (req, res) {
    var updateGrupaId = req.params.id;
    var updateGrupaNaziv = req.body.naziv;
    //console.log(updatePredmetId + " " + updatePredmetNaziv)
    db.grupa.findOne({
        where: {
            id: updateGrupaId
        }
    }).then(function (response) {
        response.naziv = updateGrupaNaziv;
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
app.post('/v2/aktivnost', function (req, res) {
    var nazivAktivnosti = req.body.naziv;
    var pocetakAktivnosti = req.body.pocetak;
    var krajAktivnosti = req.body.kraj;
    db.aktivnost.create({
        naziv: nazivAktivnosti,
        pocetak: pocetakAktivnosti,
        kraj: krajAktivnosti
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

/*
    **READ**
*/
app.get('/v2/aktivnost', function (req, res) {
    db.aktivnost.findAll().then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

app.get('/v2/aktivnost/:id', function (req, res) {
    var aktivnostId = req.params.id;
    db.aktivnost.findOne({
        where: {
            id: aktivnostId
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
app.delete('/v2/aktivnost/:id', function (req, res) {
    var izbrisiAktivnostId = req.params.id;
    db.aktivnost.destroy({
        where: {
            id: izbrisiAktivnostId
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
app.put('/v2/aktivnost/:id', function (req, res) {
    var updateAktivnostId = req.params.id;
    var updateAktivnostNaziv = req.body.naziv;
    var updateAktivnostPocetak = req.body.pocetak;
    var updateAktivnostKraj = req.body.kraj;
    //console.log(updatePredmetId + " " + updatePredmetNaziv)
    db.aktivnost.findOne({
        where: {
            id: updateAktivnostId
        }
    }).then(function (response) {
        response.naziv = updateAktivnostNaziv;
        response.pocetak = updateAktivnostPocetak;
        response.kraj = updateAktivnostKraj;
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
app.post('/v2/dan', function (req, res) {
    var nazivDana = req.body.naziv;
    db.dan.create({
        naziv: nazivDana
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

/*
    **READ**
*/
app.get('/v2/dani', function (req, res) {
    db.dan.findAll().then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

app.get('/v2/dan/:id', function (req, res) {
    var danId = req.params.id;
    db.dan.findOne({
        where: {
            id: danId
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
app.delete('/v2/dan/:id', function (req, res) {
    var izbrisiDanId = req.params.id;
    db.dan.destroy({
        where: {
            id: izbrisiDanId
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
app.put('/v2/aktivnost/:id', function (req, res) {
    var updateDanId = req.params.id;
    var updateDanNaziv = req.body.naziv;
    //console.log(updatePredmetId + " " + updatePredmetNaziv)
    db.dan.findOne({
        where: {
            id: updateDanId
        }
    }).then(function (response) {
        response.naziv = updateDanNaziv;
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
app.post('/v2/tip', function (req, res) {
    var nazivTipa = req.body.naziv;
    db.tip.create({
        naziv: nazivTipa
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

/*
    **READ**
*/
app.get('/v2/tipovi', function (req, res) {
    db.tip.findAll().then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

app.get('/v2/tip/:id', function (req, res) {
    var tipId = req.params.id;
    db.tip.findOne({
        where: {
            id: tipId
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
app.delete('/v2/tip/:id', function (req, res) {
    var izbrisiTipId = req.params.id;
    db.dan.destroy({
        where: {
            id: izbrisiTipId
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
app.put('/v2/tip/:id', function (req, res) {
    var updateTipId = req.params.id;
    var updateTipNaziv = req.body.naziv;
    //console.log(updatePredmetId + " " + updatePredmetNaziv)
    db.tip.findOne({
        where: {
            id: updateTipId
        }
    }).then(function (response) {
        response.naziv = updateTipNaziv;
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
    var nazivStudenta = req.body.ime;
    var indexStudenta = req.body.index;
    db.student.create({
        ime: nazivStudenta,
        index: indexStudenta
    }).then(function (response) {
        return res.send(JSON.stringify(response));
    }, function (error) {
        return res.send(error.message);
    })
});

/*
    **READ**
*/
app.get('/v2/studenti', function (req, res) {
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
    var izbrisiStudentaId = req.params.id;
    db.student.destroy({
        where: {
            id: izbrisiStudentaId
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
    var updateStudentNaziv = req.body.ime;
    var updateStudentIndex = req.body.index;
    //console.log(updatePredmetId + " " + updatePredmetNaziv)
    db.student.findOne({
        where: {
            id: updateStudentId
        }
    }).then(function (response) {
        response.ime = updateStudentNaziv;
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


app.listen(3000);