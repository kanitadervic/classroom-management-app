var chai = require('chai');
var chaiHttp = require('chai-http');
const should = chai.should();
var expect = chai.expect;
const fs = require('fs');

chai.use(chaiHttp)

describe('Tests', function () {
    let testData = [];
    try {
        testData = fs.readFileSync('test/testData.txt', 'utf-8');
    } catch (error) {
        console.log("Error: " + error);
    }

    const tests = testData.split('\n');

    for (let i = 0; i < tests.length; i++) {
        let test = tests[i];
        test = test.replace(/\\/g, '');
        test = test.replace(/”/g, '"');
        test = test.replace(/\[\[/g, '[');
        test = test.replace(/\]\]/g, ']');


        let testParts = test.split(',');

        let testMethod = testParts[0];
        let testRoute = testParts[1];
        let testInput = testParts[2];
        let testOutput = testParts[3];
        let temp = 3;
        if (testInput[testInput.length - 1] != "}" && testInput != null && testParts.length > 4) {
            for (let i = 3; i < testParts.length; i++) {
                if (testParts[2].includes('{') && !testParts[2].includes('}')) {
                    testParts[2] += ',' + testParts[i];
                    temp = i + 1;
                } else if (temp != i) {
                    testParts[temp] += ',' + testParts[i];
                }

            }
        }

        testInput = testParts[2];
        testOutput = testParts[temp];
        it('Test ' + testMethod + ' ' + testRoute + ' ' + testInput + ' ' + testOutput, function (done) {
            if (testMethod == 'GET') {
                chai.request('http://localhost:3000')
                    .get('/' + testRoute.toString().substring(1))
                    .send(JSON.parse(testInput))
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        res.body.should.be.eql(JSON.parse(testOutput))
                        done();
                    });
            }
            if (testMethod == 'POST') {
                chai.request('http://localhost:3000')
                    .post('/' + testRoute.toString().substring(1))
                    .send(JSON.parse(testInput))
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        res.body.should.be.eql(JSON.parse(testOutput))
                        done();
                    });
            }
            if (testMethod == 'DELETE') {
                chai.request('http://localhost:3000')
                    .delete('/' + testRoute.toString().substring(1))
                    .send(JSON.parse(testInput))
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        res.body.should.be.eql(JSON.parse(testOutput))
                        done();
                    });
            }
        });
    }

});