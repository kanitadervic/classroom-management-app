import {
    makeTimeTable,
    addActivity
} from './createTimetable.js'

let okvir = document.getElementById('okvir');


makeTimeTable(okvir, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8, 21);
addActivity(okvir, "WT", "Predavanje", 9, 12, "Ponedjeljak");
addActivity(okvir, "WT", "vježbe", 12, 13.5, "Ponedjeljak");
addActivity(okvir, "RMA", "predavanje", 14, 17, "Ponedjeljak");
addActivity(okvir, "RMA", "vježbe", 12.5, 14, "Utorak");
addActivity(okvir, "DM", "tutorijal", 14, 16, "Utorak");
addActivity(okvir, "DM", "predavanje", 16, 19, "Utorak");
addActivity(okvir, "OI", "predavanje", 12, 15, "Srijeda");


let okvir2 = document.getElementById('okvir2')

makeTimeTable(okvir2, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 11, 21);
addActivity(okvir2, "OIS", "vježbe", 12, 12.5, "Ponedjeljak");
addActivity(okvir2, "VVS", "tutorijal", 13, 13.5, "Ponedjeljak");
addActivity(okvir2, "RG", "predavanje", 14, 17, "Ponedjeljak");
addActivity(okvir2, "RG", "vježbe", 17, 17.5, "Četvrtak");
addActivity(okvir2, "OOI", "tutorijal", 14, 16, "Petak");
addActivity(okvir2, "PJP", "predavanje", 16, 19, "Petak");
addActivity(okvir2, "PJP", "vježbe", 12, 15, "Utorak");