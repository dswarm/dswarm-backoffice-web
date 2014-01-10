'use strict';

angular.module('mockedProject', [])
    .value('mockProjectJSON', {
        "id": 6,
        "name": "baz",
        "mappings": [],
        "functions": [],
        "input_data_model": {
            "id": 34,
            "name": "test_csv.csv + null data model",
            "description": " data model of resource 'test_csv.csv' and configuration ' null'",
            "configuration": {
                "id": 50,
                "resources": [
                    {
                        "id": 43
                    }
                ],
                "parameters": {
                    "column_delimiter": ";",
                    "escape_character": "\\",
                    "quote_character": "\"",
                    "column_names": "columnN",
                    "storage_type": "csv"
                }
            },
            "schema": {
                "id": 39,
                "name": "test_csv.csv schema",
                "attribute_paths": [
                    {
                        "id": 132,
                        "attributes": [
                            {
                                "id": "/test_csv.csv#id",
                                "name": "id"
                            }
                        ]
                    },
                    {
                        "id": 136,
                        "attributes": [
                            {
                                "id": "/test_csv.csv#year",
                                "name": "year"
                            }
                        ]
                    },
                    {
                        "id": 135,
                        "attributes": [
                            {
                                "id": "/test_csv.csv#isbn",
                                "name": "isbn"
                            }
                        ]
                    },
                    {
                        "id": 134,
                        "attributes": [
                            {
                                "id": "/test_csv.csv#description",
                                "name": "description"
                            }
                        ]
                    },
                    {
                        "id": 133,
                        "attributes": [
                            {
                                "id": "/test_csv.csv#name",
                                "name": "name"
                            }
                        ]
                    }
                ],
                "record_class": {
                    "id": "/test_csv.csv#RecordType",
                    "name": "record type"
                }
            },
            "data_resource": {
                "id": 43,
                "name": "test_csv.csv",
                "description": "this is a description",
                "type": "FILE",
                "attributes": {
                    "path": "/var/www/dmp/init/../tmp/resources/test_csv.csv",
                    "filesize": 766
                },
                "configurations": [
                    {
                        "id": 50,
                        "resources": [
                            {
                                "id": 43
                            }
                        ],
                        "parameters": {
                            "column_delimiter": ";",
                            "escape_character": "\\",
                            "quote_character": "\"",
                            "column_names": "columnN",
                            "storage_type": "csv"
                        }
                    }
                ]
            }
        }
    });
