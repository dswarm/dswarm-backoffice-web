'use strict';

angular.module('mockedDataModel', [])
    .value('mockDataModelJSON', {
        "id": 1,
        "name": "Geonames_DE_1-2.csv + tsv data model",
        "description": " data model of resource 'Geonames_DE_1-2.csv' and configuration ' tsv'",
        "configuration": {
            "id": 1,
            "name": "tsv",
            "description": "tab separated values",
            "resources": [
                {
                    "id": 1
                }
            ],
            "parameters": {
                "column_delimiter": "\\t",
                "escape_character": "\\",
                "quote_character": "\"",
                "column_names": "columnN",
                "storage_type": "csv",
                "at_most_rows": "10"
            }
        },
        "schema": {
            "id": 1,
            "name": "Geonames_DE_1-2.csv schema",
            "attribute_paths": [
                {
                    "id": 3,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#asciiname",
                            "name": "asciiname"
                        }
                    ]
                },
                {
                    "id": 4,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#alternatenames",
                            "name": "alternatenames"
                        }
                    ]
                },
                {
                    "id": 1,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#geonameid",
                            "name": "geonameid"
                        }
                    ]
                },
                {
                    "id": 2,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#name",
                            "name": "name"
                        }
                    ]
                },
                {
                    "id": 7,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#feature class",
                            "name": "feature class"
                        }
                    ]
                },
                {
                    "id": 8,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#feature code",
                            "name": "feature code"
                        }
                    ]
                },
                {
                    "id": 5,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#latitude",
                            "name": "latitude"
                        }
                    ]
                },
                {
                    "id": 6,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#longitude",
                            "name": "longitude"
                        }
                    ]
                },
                {
                    "id": 11,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#admin1 code",
                            "name": "admin1 code"
                        }
                    ]
                },
                {
                    "id": 12,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#admin2 code",
                            "name": "admin2 code"
                        }
                    ]
                },
                {
                    "id": 9,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#country code",
                            "name": "country code"
                        }
                    ]
                },
                {
                    "id": 10,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#cc2",
                            "name": "cc2"
                        }
                    ]
                },
                {
                    "id": 15,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#population",
                            "name": "population"
                        }
                    ]
                },
                {
                    "id": 16,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#elevation",
                            "name": "elevation"
                        }
                    ]
                },
                {
                    "id": 13,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#admin3 code",
                            "name": "admin3 code"
                        }
                    ]
                },
                {
                    "id": 14,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#admin4 code",
                            "name": "admin4 code"
                        }
                    ]
                },
                {
                    "id": 19,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#modification date",
                            "name": "modification date"
                        }
                    ]
                },
                {
                    "id": 18,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#timezone",
                            "name": "timezone"
                        }
                    ]
                },
                {
                    "id": 17,
                    "attributes": [
                        {
                            "id": "/Geonames_DE_1-2.csv#dem",
                            "name": "dem"
                        }
                    ]
                }
            ],
            "record_class": {
                "id": "/Geonames_DE_1-2.csv#RecordType",
                "name": "record type"
            }
        },
        "data_resource": {
            "id": 1,
            "name": "Geonames_DE_1-2.csv",
            "description": "geonames",
            "type": "FILE",
            "attributes": {
                "path": "/Users/knut/Development/Projects/DMP/init/../tmp/resources/Geonames_DE_1-2.csv",
                "filesize": -1
            },
            "configurations": [
                {
                    "id": 1,
                    "name": "tsv",
                    "description": "tab separated values",
                    "resources": [
                        {
                            "id": 1
                        }
                    ],
                    "parameters": {
                        "column_delimiter": "\\t",
                        "escape_character": "\\",
                        "quote_character": "\"",
                        "column_names": "columnN",
                        "storage_type": "csv",
                        "at_most_rows": "10"
                    }
                }
            ]
        }
    });
