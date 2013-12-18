'use strict';

angular.module('mockedData', [])
    .value('mockDataJSON', [
    {
        "recordId": "3",
        "Name": "Chefchen",
        "ID": "3",
        "Email": "cc@testung.tt",
        "Vorname": "Carlo"
    },
    {
        "recordId": "2",
        "Name": "User",
        "ID": "2",
        "Email": "uu@testung.tt",
        "Vorname": "Undine"
    },
    {
        "recordId": "1",
        "Name": "Tester",
        "ID": "1",
        "Email": "tt@testung.tst",
        "Vorname": "Testine"
    }
    ]);
