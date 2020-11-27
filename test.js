let assert = chai.assert;
describe('Modul', function () {
    describe('iscrtajRaspored()', function () {
        it('should have 4 rows for days and 6 hours in first row', function () {
            let okvir = document.createElement("div");
            okvir.id = "okvir"
            document.body.appendChild(okvir)
            let body = Modul.iscrtajRaspored(okvir, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak"], 8, 21);
            let row = body.getElementsByClassName('weekday')
            let col = body.getElementsByClassName('hours')
            assert.equal(row.length, 4)
            assert.equal(col.length, 6)
        });

        it('should have 3 rows for days and 3 hours in first row', function () {
            let okvir2 = document.createElement('div');
            okvir2.id = "okvir2"
            document.body.appendChild(okvir2)
            let body2 = Modul.iscrtajRaspored(okvir2, ["Ponedjeljak", "Utorak", "Srijeda"], 8, 15);
            let row = body2.getElementsByClassName('weekday')
            let cols = body2.getElementsByClassName('hours')
            assert.equal(row.length, 3)
            assert.equal(cols.length, 3)
        });

        it('should have 5 rows for days and 2 hours in first row', function () {
            let okvir3 = document.createElement('div');
            okvir3.id = "okvir3"
            document.body.appendChild(okvir3)
            let body3 = Modul.iscrtajRaspored(okvir3, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 15, 19);
            let row = body3.getElementsByClassName('weekday')
            let cols = body3.getElementsByClassName('hours')
            assert.equal(row.length, 5)
            assert.equal(cols.length, 2)
        });

        it('should have 2 rows for days and 11 hours in first row', function () {
            let okvir4 = document.createElement('div');
            okvir4.id = "okvir4"
            document.body.appendChild(okvir4)
            let body4 = Modul.iscrtajRaspored(okvir4, ["Ponedjeljak", "Utorak"], 0, 23);
            let row = body4.getElementsByClassName('weekday')
            let cols = body4.getElementsByClassName('hours')
            assert.equal(row.length, 2)
            assert.equal(cols.length, 11)
        });


        it('should have 1 row for days and 1 hour in first row', function () {
            let okvir5 = document.createElement('div');
            okvir5.id = "okvir5"
            document.body.appendChild(okvir5)
            let body5 = Modul.iscrtajRaspored(okvir5, ["Ponedjeljak"], 0, 2);
            let row = body5.getElementsByClassName('weekday')
            let cols = body5.getElementsByClassName('hours')
            assert.equal(row.length, 1)
            assert.equal(cols.length, 1)
        });

        it('should have 3 rows for days and 6 hours in first row', function () {
            let okvir6 = document.createElement('div');
            okvir6.id = "okvir6"
            document.body.appendChild(okvir6)
            let body6 = Modul.iscrtajRaspored(okvir6, ["Ponedjeljak", "Utorak", "Srijeda"], 0, 12);
            let row = body6.getElementsByClassName('weekday')
            let cols = body6.getElementsByClassName('hours')
            assert.equal(row.length, 3)
            assert.equal(cols.length, 6)
        });

        it('should have 7 rows for days and 5 hours in first row', function () {
            let okvir7 = document.createElement('div');
            okvir7.id = "okvir7"
            document.body.appendChild(okvir7)
            let body7 = Modul.iscrtajRaspored(okvir7, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 12, 23);
            let row = body7.getElementsByClassName('weekday')
            let cols = body7.getElementsByClassName('hours')
            assert.equal(row.length, 7)
            assert.equal(cols.length, 5)
        });

        it('should have 6 rows for days and 7 hours in first row', function () {
            let okvir8 = document.createElement('div');
            okvir8.id = "okvir8"
            document.body.appendChild(okvir8)
            let body8 = Modul.iscrtajRaspored(okvir8, ["Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 8, 23);
            let row = body8.getElementsByClassName('weekday')
            let cols = body8.getElementsByClassName('hours')
            assert.equal(row.length, 6)
            assert.equal(cols.length, 7)
        });

        it('should have 3 rows for days and 6 hours in first row', function () {
            let okvir9 = document.createElement('div');
            okvir9.id = "okvir9"
            document.body.appendChild(okvir9)
            let body9 = Modul.iscrtajRaspored(okvir9, ["Petak", "Subota", "Nedjelja"], 8, 21);
            let row = body9.getElementsByClassName('weekday')
            let cols = body9.getElementsByClassName('hours')
            assert.equal(row.length, 3)
            assert.equal(cols.length, 6)
        });

        it('should have 7 rows for days and 4 hours in first row', function () {
            let okvir10 = document.createElement('div');
            okvir10.id = "okvir10"
            document.body.appendChild(okvir10)
            let body10 = Modul.iscrtajRaspored(okvir10, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 12, 21);
            let row = body10.getElementsByClassName('weekday')
            let cols = body10.getElementsByClassName('hours')
            assert.equal(row.length, 7)
            assert.equal(cols.length, 4)
        });


        //FAILED METHODS:
        it('wrong parameters for timetable (end is before start of schedule)', function () {
            let okvir11 = document.createElement('div');
            okvir11.id = "okvir11"
            document.body.appendChild(okvir11)
            let body11 = Modul.iscrtajRaspored(okvir11, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 23, 21);

            assert.equal(body11, "Greška - Pogrešan format rasporeda");

        });

        it('wrong parameters for timetable (start is after end of schedule)', function () {
            let okvir12 = document.createElement('div');
            okvir12.id = "okvir12"
            document.body.appendChild(okvir12)
            let body12 = Modul.iscrtajRaspored(okvir12, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 17, 11);

            assert.equal(body12, "Greška - Pogrešan format rasporeda");

        });



        it('wrong parameters for timetable (end is before start of schedule)', function () {
            let okvir13 = document.createElement('div');
            okvir13.id = "okvir13"
            document.body.appendChild(okvir13)
            let body13 = Modul.iscrtajRaspored(okvir13, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 9, 5);

            assert.equal(body13, "Greška - Pogrešan format rasporeda");

        });

        it('wrong parameters for timetable (end is at the same time as the start of schedule)', function () {
            let okvir14 = document.createElement('div');
            okvir14.id = "okvir14"
            document.body.appendChild(okvir14)
            let body14 = Modul.iscrtajRaspored(okvir14, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 15, 15);

            assert.equal(body14, "Greška - Pogrešan format rasporeda");

        });

        it('wrong parameters for timetable (end is not an integer)', function () {
            let okvir15 = document.createElement('div');
            okvir15.id = "okvir15"
            document.body.appendChild(okvir15)
            let body15 = Modul.iscrtajRaspored(okvir15, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 9, 15.2);

            assert.equal(body15, "Greška - Pogrešan format rasporeda");

        });

        it('wrong parameters for timetable (start is not an integer)', function () {
            let okvir16 = document.createElement('div');
            okvir16.id = "okvir16"
            document.body.appendChild(okvir16)
            let body16 = Modul.iscrtajRaspored(okvir16, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 9.56, 15);

            assert.equal(body16, "Greška - Pogrešan format rasporeda");

        });

        it('wrong parameters for timetable (start and end are not integers)', function () {
            let okvir17 = document.createElement('div');
            okvir17.id = "okvir17"
            document.body.appendChild(okvir17)
            let body17 = Modul.iscrtajRaspored(okvir17, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 9.56, 15.89);

            assert.equal(body17, "Greška - Pogrešan format rasporeda");

        });

        it('wrong parameters for timetable (start is a negative integer)', function () {
            let okvir18 = document.createElement('div');
            okvir18.id = "okvir18"
            document.body.appendChild(okvir18)
            let body18 = Modul.iscrtajRaspored(okvir18, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], -5, 15);

            assert.equal(body18, "Greška - Pogrešan format rasporeda");

        });

        it('wrong parameters for timetable (end is a negative integer)', function () {
            let okvir19 = document.createElement('div');
            okvir19.id = "okvir19"
            document.body.appendChild(okvir19)
            let body19 = Modul.iscrtajRaspored(okvir19, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 5, -15);

            assert.equal(body19, "Greška - Pogrešan format rasporeda");

        });

        it('wrong parameters for timetable (start is an integer greater than 24)', function () {
            let okvir20 = document.createElement('div');
            okvir20.id = "okvir20"
            document.body.appendChild(okvir20)
            let body20 = Modul.iscrtajRaspored(okvir20, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 26, 15);

            assert.equal(body20, "Greška - Pogrešan format rasporeda");

        });

        it('wrong parameters for timetable (end is an integer greater than 24)', function () {
            let okvir200 = document.createElement('div');
            okvir200.id = "okvir200"
            document.body.appendChild(okvir200)
            let body200 = Modul.iscrtajRaspored(okvir200, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 0, 30);

            assert.equal(body200, "Greška - Pogrešan format rasporeda");

        });
    });

    describe('dodajAktivnost()', function () {
        it('should have 2 added activities on monday from 9 to 12, on wednesday from 12 to 12:30', function () {
            let okvir21 = document.createElement("div");
            okvir21.id = "okvir21"
            document.body.appendChild(okvir21)
            Modul.iscrtajRaspored(okvir21, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak"], 8, 21);
            let body = Modul.dodajAktivnost(okvir21, "WT", "Predavanje", 9, 12, "Ponedjeljak");
            body = Modul.dodajAktivnost(okvir21, "OOI", "Vježbe", 12, 12.5, "Srijeda");
            assert.equal(body.getElementsByClassName('input').length, 2)
            assert.equal(body.getElementsByClassName('input')[0].innerHTML, "WT<br>Predavanje")
            assert.equal(body.getElementsByClassName('input')[1].innerHTML, "OOI<br>Vježbe")
        });

        it('should have 3 added activities on thursday from 13 to 13:30, on wednesday from 12 to 13:00 and friday from 12 to 13', function () {
            let okvir22 = document.createElement('div');
            okvir22.id = "okvir22"
            document.body.appendChild(okvir22)
            Modul.iscrtajRaspored(okvir22, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 15, 19);

            let body2 = Modul.dodajAktivnost(okvir22, "OIS", "Tutorijal", 15, 15.5, "Ponedjeljak");
            body2 = Modul.dodajAktivnost(okvir22, "VVS", "Predavanje", 15, 18, "Srijeda");
            body2 = Modul.dodajAktivnost(okvir22, "RG", "Vježbe", 16, 18.5, "Petak");
            assert.equal(body2.getElementsByClassName('input').length, 3)
            assert.equal(body2.getElementsByClassName('input')[1].innerHTML, "VVS<br>Predavanje")
            assert.equal(body2.getElementsByClassName('input')[0].innerHTML, "OIS<br>Tutorijal")
            assert.equal(body2.getElementsByClassName('input')[2].innerHTML, "RG<br>Vježbe")
        });

        it('should have 5 added activities (2xmonday, 3xtuesday)', function () {
            let okvir23 = document.createElement('div');
            okvir23.id = "okvir23"
            document.body.appendChild(okvir23)
            Modul.iscrtajRaspored(okvir23, ["Ponedjeljak", "Utorak", "Srijeda"], 8, 15);

            let body = Modul.dodajAktivnost(okvir23, "OIS", "Tutorijal", 8, 8.5, "Ponedjeljak");
            body = Modul.dodajAktivnost(okvir23, "VVS", "Predavanje", 10, 11, "Utorak");
            body = Modul.dodajAktivnost(okvir23, "RG", "Vježbe", 9, 12, "Ponedjeljak");
            body = Modul.dodajAktivnost(okvir23, "WT", "Predavanje", 8, 9.5, "Utorak");
            body = Modul.dodajAktivnost(okvir23, "WT", "Spirala", 11, 11.5, "Utorak");
            assert.equal(body.getElementsByClassName('input').length, 5)
            assert.equal(body.getElementsByClassName('input')[2].innerHTML, "WT<br>Predavanje")
            assert.equal(body.getElementsByClassName('input')[3].innerHTML, "VVS<br>Predavanje")
            assert.equal(body.getElementsByClassName('input')[0].innerHTML, "OIS<br>Tutorijal")
            assert.equal(body.getElementsByClassName('input')[1].innerHTML, "RG<br>Vježbe")
            assert.equal(body.getElementsByClassName('input')[4].innerHTML, "WT<br>Spirala")
        });

        it('should have 2 added activities on the same day', function () {
            let okvir25 = document.createElement('div');
            okvir25.id = "okvir25"
            document.body.appendChild(okvir25)
            Modul.iscrtajRaspored(okvir25, ["Ponedjeljak"], 0, 2);
            let body = Modul.dodajAktivnost(okvir25, "RG", "zadaća", 0, 1.5, "Ponedjeljak");
            body = Modul.dodajAktivnost(okvir25, "VVS", "Predavanje", 1.5, 2, "Ponedjeljak");

            assert.equal(body.getElementsByClassName('input').length, 2)
        });

        it('should have 7 added activities (3xFriday, 2xSaturday, 2xSunday', function () {
            let okvir29 = document.createElement('div');
            okvir29.id = "okvir29"
            document.body.appendChild(okvir29)
            Modul.iscrtajRaspored(okvir29, ["Petak", "Subota", "Nedjelja"], 8, 21);

            let body = Modul.dodajAktivnost(okvir29, "RG", "zadaća", 8, 10, "Petak"); //
            body = Modul.dodajAktivnost(okvir29, "VVS", "Predavanje", 10, 11.5, "Petak"); //
            body = Modul.dodajAktivnost(okvir29, "OIS", "Projekat", 14.5, 15.5, "Subota"); //
            body = Modul.dodajAktivnost(okvir29, "WT", "Predavanje", 18, 19.5, "Subota"); //
            body = Modul.dodajAktivnost(okvir29, "WT", "Spirala", 14, 15, "Nedjelja"); //
            body = Modul.dodajAktivnost(okvir29, "RG", "Rok za projekat", 15, 16.5, "Petak");
            body = Modul.dodajAktivnost(okvir29, "PJP", "Projekat", 18, 20.5, "Nedjelja");
            assert.equal(body.getElementsByClassName('input').length, 7)
        });

        it('should have 7 added activities on all days of week', function () {
            let okvir27 = document.createElement('div');
            okvir27.id = "okvir27"
            document.body.appendChild(okvir27)
            Modul.iscrtajRaspored(okvir27, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 11, 23);

            let body = Modul.dodajAktivnost(okvir27, "RG", "zadaća", 12, 14, "Ponedjeljak");
            body = Modul.dodajAktivnost(okvir27, "VVS", "Predavanje", 15, 16.5, "Utorak");
            body = Modul.dodajAktivnost(okvir27, "OIS", "Projekat", 14.5, 15.5, "Četvrtak");
            body = Modul.dodajAktivnost(okvir27, "WT", "Predavanje", 17, 20, "Srijeda");
            body = Modul.dodajAktivnost(okvir27, "WT", "Spirala", 19, 22, "Petak");
            body = Modul.dodajAktivnost(okvir27, "RG", "Rok za projekat", 15, 16, "Subota");
            body = Modul.dodajAktivnost(okvir27, "PJP", "Projekat", 18, 21, "Nedjelja");
            assert.equal(body.getElementsByClassName('input').length, 7)
        });

        it('should have 5 added activities (from Monday to Friday)', function () {
            let okvir30 = document.createElement('div');
            okvir30.id = "okvir30"
            document.body.appendChild(okvir30)
            Modul.iscrtajRaspored(okvir30, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 12, 21);

            let body = Modul.dodajAktivnost(okvir30, "RG", "zadaća", 12, 14, "Ponedjeljak");
            body = Modul.dodajAktivnost(okvir30, "VVS", "Predavanje", 15, 16.5, "Utorak");
            body = Modul.dodajAktivnost(okvir30, "OIS", "Projekat", 14.5, 15.5, "Četvrtak");
            body = Modul.dodajAktivnost(okvir30, "WT", "Predavanje", 17, 20, "Srijeda");
            body = Modul.dodajAktivnost(okvir30, "WT", "Spirala", 19, 20.5, "Petak");

            assert.equal(body.getElementsByClassName('input').length, 5)
        });

        it('should have 5 added activities (all days except monday and saturday)', function () {
            let okvir28 = document.createElement('div');
            okvir28.id = "okvir28"
            document.body.appendChild(okvir28)
            Modul.iscrtajRaspored(okvir28, ["Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 8, 23);

            let body = Modul.dodajAktivnost(okvir28, "RG", "zadaća", 12, 14, "Nedjelja");
            body = Modul.dodajAktivnost(okvir28, "VVS", "Predavanje", 15, 16.5, "Utorak");
            body = Modul.dodajAktivnost(okvir28, "OIS", "Projekat", 14.5, 15.5, "Četvrtak");
            body = Modul.dodajAktivnost(okvir28, "WT", "Predavanje", 17, 20, "Srijeda");
            body = Modul.dodajAktivnost(okvir28, "WT", "Spirala", 19, 20.5, "Petak");

            assert.equal(body.getElementsByClassName('input').length, 5)
        });

        //TESTOVI SA IZUZECIMA

        it('wrong parameters for adding activities (timetable not created)', function () {
            let okvir29 = document.createElement('div');

            let body = Modul.dodajAktivnost(okvir29, "RG", "zadaća", 12, 14, "Nedjelja");
            body = Modul.dodajAktivnost(okvir29, "VVS", "Predavanje", 15, 16.5, "Utorak");
            body = Modul.dodajAktivnost(okvir29, "OIS", "Projekat", 14.5, 15.5, "Četvrtak");
            body = Modul.dodajAktivnost(okvir29, "WT", "Predavanje", 17, 20, "Srijeda");
            body = Modul.dodajAktivnost(okvir29, "WT", "Spirala", 19, 20.5, "Petak");
            assert.equal(body, "Greška - raspored nije kreiran")
        });

        it('wrong parameters for adding activities (timetable is null)', function () {
            let okvir30 = document.createElement('div')
            let body = Modul.dodajAktivnost(okvir30, "RG", "zadaća", 12, 14, "Nedjelja");
            body = Modul.dodajAktivnost(okvir30, "VVS", "Predavanje", 15, 16.5, "Utorak");
            body = Modul.dodajAktivnost(okvir30, "OIS", "Projekat", 14.5, 15.5, "Četvrtak");
            body = Modul.dodajAktivnost(okvir30, "WT", "Predavanje", 17, 20, "Srijeda");
            body = Modul.dodajAktivnost(okvir30, "WT", "Spirala", 19, 20.5, "Petak");
            assert.equal(body, "Greška - raspored nije kreiran")
        });

        it('wrong parameters for adding activities (start time of activity is before the start of timetable)', function () {
            let okvir31 = document.createElement('div')
            okvir31.id = "okvir31"
            document.body.appendChild(okvir31)
            Modul.iscrtajRaspored(okvir31, ["Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 8, 23);
            let body = Modul.dodajAktivnost(okvir31, "RG", "zadaća", 5, 14, "Nedjelja");
            assert.equal(body, "Greška - Format za raspored nije ispravan")
        });

        it('wrong parameters for adding activities (incorrect format of start of activity)', function () {
            let okvir32 = document.createElement('div')
            okvir32.id = "okvir32"
            document.body.appendChild(okvir32)
            Modul.iscrtajRaspored(okvir32, ["Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 10, 18);
            let body = Modul.dodajAktivnost(okvir32, "RG", "zadaća", 13.9, 15, "Nedjelja");
            assert.equal(body, "Greška - Format za vrijeme nije ispravan")
        });

        it('wrong parameters for adding activities (incorrect format of end of activity)', function () {
            let okvir33 = document.createElement('div')
            okvir33.id = "okvir33"
            document.body.appendChild(okvir33)
            Modul.iscrtajRaspored(okvir33, ["Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 10, 18);
            let body = Modul.dodajAktivnost(okvir33, "RG", "zadaća", 13, 15.23, "Nedjelja");
            assert.equal(body, "Greška - Format za vrijeme nije ispravan")
        });

        it('wrong parameters for adding activities (end is before the start of the activity)', function () {
            let okvir34 = document.createElement('div')
            okvir34.id = "okvir34"
            document.body.appendChild(okvir34)
            Modul.iscrtajRaspored(okvir34, ["Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 10, 18);
            let body = Modul.dodajAktivnost(okvir34, "RG", "zadaća", 11, 10, "Nedjelja");
            assert.equal(body, "Greška - Format za vrijeme nije ispravan")
        });

        it('wrong parameters for adding activities (start is at the same time as the end of the activity)', function () {
            let okvir35 = document.createElement('div')
            okvir35.id = "okvir35"
            document.body.appendChild(okvir35)
            Modul.iscrtajRaspored(okvir35, ["Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 10, 18);
            let body = Modul.dodajAktivnost(okvir35, "RG", "zadaća", 14.5, 14.5, "Nedjelja");
            assert.equal(body, "Greška - Format za vrijeme nije ispravan")
        });

        it('wrong parameters for adding activities (time of activity is already taken)', function () {
            let okvir36 = document.createElement('div')
            okvir36.id = "okvir36"
            document.body.appendChild(okvir36)
            Modul.iscrtajRaspored(okvir36, ["Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 10, 18);
            let body = Modul.dodajAktivnost(okvir36, "RG", "zadaća", 14, 16, "Nedjelja");
            body = Modul.dodajAktivnost(okvir36, "OIS", "projekat", 12, 15, "Nedjelja");
            assert.equal(body, "Greška - termin 12-15 zauzet")
        });

        it('wrong parameters for adding activities (time of activity is already taken)', function () {
            let okvir37 = document.createElement('div')
            okvir37.id = "okvir37"
            document.body.appendChild(okvir37)
            Modul.iscrtajRaspored(okvir37, ["Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 10, 18);
            let body = Modul.dodajAktivnost(okvir37, "RG", "zadaća", 14.5, 16.5, "Nedjelja");
            body = Modul.dodajAktivnost(okvir37, "OIS", "projekat", 12, 15, "Nedjelja");
            assert.equal(body, "Greška - termin 12-15 zauzet")
        });

        it('wrong parameters for adding activities (time of activity is already taken)', function () {
            let okvir38 = document.createElement('div')
            okvir38.id = "okvir38"
            document.body.appendChild(okvir38)
            Modul.iscrtajRaspored(okvir38, ["Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 10, 18);
            let body = Modul.dodajAktivnost(okvir38, "RG", "zadaća", 14.5, 17, "Nedjelja");
            body = Modul.dodajAktivnost(okvir38, "OIS", "projekat", 13, 15, "Nedjelja");
            assert.equal(body, "Greška - termin 13-15 zauzet")
        });

        it('wrong parameters for adding activities (day is not a row in table)', function () {
            let okvir39 = document.createElement('div')
            okvir39.id = "okvir39"
            document.body.appendChild(okvir39)
            Modul.iscrtajRaspored(okvir39, ["Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"], 10, 18);
            let body = Modul.dodajAktivnost(okvir39, "RG", "zadaća", 14.5, 17, "Ponedjeljak");
            assert.equal(body, "Greška - Dan ne postoji u tabeli")
        });

        it('wrong parameters for adding activities (day is not a row in table)', function () {
            let okvir40 = document.createElement('div')
            okvir40.id = "okvir40"
            document.body.appendChild(okvir40)
            Modul.iscrtajRaspored(okvir40, ["Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"], 10, 18);
            let body = Modul.dodajAktivnost(okvir40, "RG", "zadaća", 14.5, 17, "Nedjelja");
            assert.equal(body, "Greška - Dan ne postoji u tabeli")
        });

    });
});