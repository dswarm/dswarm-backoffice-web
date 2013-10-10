'use strict';

angular.module('mockedDataConfig', [])
    .value('mockDataConfigSaveJSON', {
        'id' : 4,
        'resources' :
            [ { 'id' : 2 } ],
        'parameters' : {
            'column_delimiter':';',
            'escape_character':'\\\\',
            'quote_character':'\\\'',
            'column_names':'columnN',
            'storage_type':'csv'
        }
    })
    .value('mockDataConfigGetJSON', [
        {
            "id": 4,
            "resources": [
                {
                    "id": 2
                }
            ],
            "parameters": {
                "column_delimiter": ";",
                "escape_character": "\\\\",
                "quote_character": "\\\"",
                "column_names": "columnN",
                "storage_type": "csv"
            }
        },
        {
            "id": 5,
            "resources": [
                {
                    "id": 2
                }
            ],
            "parameters": {
                "column_delimiter": ";",
                "escape_character": "\\\\",
                "quote_character": "\\\"",
                "column_names": "columnN",
                "storage_type": "csv"
            }
        }
    ]);