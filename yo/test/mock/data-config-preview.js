'use strict';

angular.module('mockedDataConfigPreview', [])
    .value('mockDataConfigPreviewJSON', {
        "data": [
            {name: "Moroni", age: 50},
            {name: "Tiancum", age: 43},
            {name: "Jacob", age: 27},
            {name: "Nephi", age: 29},
            {name: "Enos", age: 34}
        ],
        "columnDefs": [
            {field:'name', displayName:'Name'},
            {field:'age', displayName:'Age'}
        ]
    });