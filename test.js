const assert = require('assert');
const fs = require('fs');
const request = require('sync-request');

describe('Testovi', function () {
    let file = [];
    try {
        file = fs.readFileSync('testniPodaci.txt', 'utf-8');
    } catch (error) {
        console.log("Greška sa čitanjem datoteke!");
        return;
    }

    const testovi = file.split('\n');

    for(let i = 0; i < testovi.length; i++){
        const odredjeniTest = testovi[i];
    }
})