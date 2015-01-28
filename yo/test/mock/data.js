'use strict';

angular.module('mockedData', [])
    .value('mockDataJSON', [
    {
        "recordId": "3",
        "Name": "Chefchen",
        "uuid": "3",
        "Email": "cc@testung.tt",
        "Vorname": "Carlo"
    },
    {
        "recordId": "2",
        "Name": "User",
        "uuid": "2",
        "Email": "uu@testung.tt",
        "Vorname": "Undine"
    },
    {
        "recordId": "1",
        "Name": "Tester",
        "uuid": "1",
        "Email": "tt@testung.tst",
        "Vorname": "Testine"
    }
    ]);
