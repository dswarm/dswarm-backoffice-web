'use strict';

angular.module('mockedDataConfig', [])
    .value('mockDataConfigSaveJSON', {
        'uuid': 4,
        'resources': [
            { 'uuid': 2 }
        ],
        'parameters': {
            'column_delimiter': ';',
            'escape_character': '\\\\',
            'quote_character': '\\\'',
            'column_names': 'columnN',
            'storage_type': 'csv'
        }
    })
    .value('mockDataConfigGetJSON', {
        "uuid": 4,
        "resources": [
            {
                "uuid": 2
            }
        ],
        "parameters": {
            "column_delimiter": ";",
            "escape_character": "\\\\",
            "quote_character": "\\\"",
            "column_names": "columnN",
            "storage_type": "csv"
        }
    })
    .value('mockDataResourceGetJson', {
        "uuid": 42,
        configurations: [{
            uuid: 1337,
            name: 'foo',
            description: 'Lorem ipsum dolor sit amet.',
            parameters: {
                ignore_lines: 0,
                discard_rows: 2,
                at_most_rows: 5,
                column_delimiter: "^",
                escape_character: "\\\\",
                quote_character: "\\\"",
                column_names: "columnN",
                storage_type: "csv"
            }
        }]
    })
    .value('mockDataConfigXMLResource', {
        uuid: 42,
        configurations: [{
            uuid: 4,
            name: 'foooo',
            description: 'bar baz',
            resources: [{
                uuid: 42
            }],
            parameters: {
                schema_file: {
                    uuid: 1337,
                    name: 'foo',
                    description: 'bar'
                },
                storage_type: 'xml'
            }
        }]
    });
