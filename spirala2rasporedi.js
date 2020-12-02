import {
    iscrtajRaspored,
    dodajAktivnost
} from './iscrtaj.js'

let okvir = document.getElementById('okvir');


iscrtajRaspored(okvir, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8,21);
dodajAktivnost(okvir, "WT", "Predavanje", 9, 12, "Ponedjeljak");
dodajAktivnost(okvir, "WT", "vježbe", 12, 13.5, "Ponedjeljak");
dodajAktivnost(okvir, "RMA", "predavanje", 14, 17, "Ponedjeljak");
dodajAktivnost(okvir, "RMA", "vježbe", 12.5, 14, "Utorak");
dodajAktivnost(okvir, "DM", "tutorijal", 14, 16, "Utorak");
dodajAktivnost(okvir, "DM", "predavanje", 16, 19, "Utorak");
dodajAktivnost(okvir, "OI", "predavanje", 12, 15, "Srijeda");


let okvir2 = document.getElementById('okvir2')

iscrtajRaspored(okvir2, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 11, 21);
dodajAktivnost(okvir2, "OIS", "vježbe", 12, 12.5, "Ponedjeljak");
dodajAktivnost(okvir2, "VVS", "tutorijal", 13, 13.5, "Ponedjeljak");
dodajAktivnost(okvir2, "RG", "predavanje", 14, 17, "Ponedjeljak");
dodajAktivnost(okvir2, "RG", "vježbe", 17, 17.5, "Četvrtak");
dodajAktivnost(okvir2, "OOI", "tutorijal", 14, 16, "Petak");
dodajAktivnost(okvir2, "PJP", "predavanje", 16, 19, "Petak");
dodajAktivnost(okvir2, "PJP", "vježbe", 12, 15, "Utorak");