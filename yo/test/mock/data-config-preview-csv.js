'use strict';

angular.module('mockedDataConfigPreviewCsv', [])
    .value('mockDataConfigPreviewCsvJSON', {
        "data": [
            {name: "Moroni", age: 50},
            {name: "Tiancum", age: 43},
            {name: "Jacob", age: 27},
            {name: "Nephi", age: 29},
            {name: "Enos", age: 34}
        ],
        "schema": ["name", "age"]
    })
    .value('mockDataConfigPreview', 'foo;bar;noobar'+"\n"+'1;2;3'+"\n"+'4,5,6');