var chai = require('chai');
var chaiHttp = require('chai-http');
const should = chai.should();
var expect = chai.expect;
const fs = require('fs');

chai.use(chaiHttp)

describe('Testovi', function () {
    let testovi2 = [];
    try {
        testovi2 = fs.readFileSync('test/testniPodaci.txt', 'utf-8');
    } catch (error) {
        console.log("Greška " + error);
    }

    const testovi = testovi2.split('\n');

    for (let i = 0; i < testovi.length; i++) {
        let test = testovi[i];
        test = test.replace(/\\/g, '');
        test = test.replace(/”/g, '"');
        test = test.replace(/\[\[/g, '[');
        test = test.replace(/\]\]/g, ']');



        let dijeloviTesta = test.split(',');

        let operacija = dijeloviTesta[0];
        let ruta = dijeloviTesta[1];
        let ulaz = dijeloviTesta[2];
        let izlaz = dijeloviTesta[3];
        let temp = 3;
        if (ulaz[ulaz.length - 1] != "}" && ulaz != null && dijeloviTesta.length > 4) {
            for (let i = 3; i < dijeloviTesta.length; i++) {
                if(dijeloviTesta[2].includes('{') && !dijeloviTesta[2].includes('}')) {
                    dijeloviTesta[2] += ',' + dijeloviTesta[i];
                    temp = i+1;
                } else if(temp!=i){
                    dijeloviTesta[temp] += ',' + dijeloviTesta[i];
                }

            }
        }

        ulaz = dijeloviTesta[2];
        izlaz = dijeloviTesta[temp];
        it('Test ' + operacija + ' ' + ruta + ' ' + ulaz + ' ' + izlaz, function (done) {
            if (operacija == 'GET') {
                chai.request('http://localhost:3000')
                    .get('/' + ruta.toString().substring(1))
                    .send(JSON.parse(ulaz))
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        res.body.should.be.eql(JSON.parse(izlaz))
                        done();
                    });
            }
            if (operacija == 'POST') {
                chai.request('http://localhost:3000')
                    .post('/' + ruta.toString().substring(1))
                    .send(JSON.parse(ulaz))
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        res.body.should.be.eql(JSON.parse(izlaz))
                        done();
                    });
            }
            if (operacija == 'DELETE') {
                chai.request('http://localhost:3000')
                    .delete('/' + ruta.toString().substring(1))
                    .send(JSON.parse(ulaz))
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        res.body.should.be.eql(JSON.parse(izlaz))
                        done();
                    });
            }
        });
    }

});