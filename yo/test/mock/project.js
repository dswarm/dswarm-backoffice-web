'use strict';

angular.module('mockedProject', [])
    .value('mockProjectJSON', {
        "uuid": 6,
        "name": "baz",
        "mappings": [],
        "functions": [],
        "input_data_model": {
            "uuid": 34,
            "name": "test_csv.csv + null data model",
            "description": " data model of resource 'test_csv.csv' and configuration ' null'",
            "configuration": {
                "uuid": 50,
                "resources": [
                    {
                        "uuid": 43
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
                "uuid": 39,
                "name": "test_csv.csv schema",
                "attribute_paths": [
                    {
                        type : "SchemaAttributePathInstance",
                        name : null,
                        uuid : 61,
                        attribute_path : {
                            "uuid": 132,
                            "attributes": [
                                {
                                    "uuid": "/test_csv.csv#id",
                                    "name": "uuid"
                                }
                            ]
                        }
                    },
                    {
                        type : "SchemaAttributePathInstance",
                        name : null,
                        uuid : 62,
                        attribute_path : {
                            "uuid": 136,
                            "attributes": [
                                {
                                    "uuid": "/test_csv.csv#year",
                                    "name": "year"
                                }
                            ]
                        }
                    },
                    {
                        type : "SchemaAttributePathInstance",
                        name : null,
                        uuid : 63,
                        attribute_path : {
                            "uuid": 135,
                            "attributes": [
                                {
                                    "uuid": "/test_csv.csv#isbn",
                                    "name": "isbn"
                                }
                            ]
                        }
                    },
                    {
                        type : "SchemaAttributePathInstance",
                        name : null,
                        uuid : 64,
                        attribute_path : {
                            "uuid": 134,
                            "attributes": [
                                {
                                    "uuid": "/test_csv.csv#description",
                                    "name": "description"
                                }
                            ]
                        }
                    },
                    {
                        type : "SchemaAttributePathInstance",
                        name : null,
                        uuid : 65,
                        attribute_path : {
                            "uuid": 133,
                            "attributes": [
                                {
                                    "uuid": "/test_csv.csv#name",
                                    "name": "name"
                                }
                            ]
                        }
                    }
                ],
                "record_class": {
                    "uuid": "/test_csv.csv#RecordType",
                    "name": "record type"
                }
            },
            "data_resource": {
                "uuid": 43,
                "name": "test_csv.csv",
                "description": "this is a description",
                "type": "FILE",
                "attributes": {
                    "path": "/var/www/dmp/init/../tmp/resources/test_csv.csv",
                    "filesize": 766
                },
                "configurations": [
                    {
                        "uuid": 50,
                        "resources": [
                            {
                                "uuid": 43
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
    })
    .value('mockProjectJSON2', {
        "name": "newww",
        "description": null,
        "uuid": 25,
        "input_data_model": {
            "name": "mabxml_dmp.xml",
            "description": "sdff",
            "configuration": {
                "name": "xml",
                "description": "xml with id 2",
                "uuid": 2,
                "resources": [
                    {
                        "uuid": 2
                    }
                ],
                "parameters": {
                    "storage_type": "mabxml",
                    "record_tag": "datensatz"
                }
            },
            "schema": {
                "name": "mabxml schema",
                "uuid": 3,
                "attribute_paths": [
                    {
                        "uuid": 53,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "uuid": 40
                            },
                            {
                                "name": "tf",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tf",
                                "uuid": 45
                            }
                        ]
                    },
                    {
                        "uuid": 40,
                        "attributes": [
                            {
                                "name": "uuid",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#id",
                                "uuid": 36
                            }
                        ]
                    },
                    {
                        "uuid": 50,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "uuid": 40
                            },
                            {
                                "name": "ns",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ns",
                                "uuid": 44
                            }
                        ]
                    },
                    {
                        "uuid": 49,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "uuid": 40
                            },
                            {
                                "name": "ns",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ns",
                                "uuid": 44
                            }
                        ]
                    },
                    {
                        "uuid": 52,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "uuid": 40
                            },
                            {
                                "name": "tf",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tf",
                                "uuid": 45
                            }
                        ]
                    },
                    {
                        "uuid": 51,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "uuid": 40
                            },
                            {
                                "name": "ns",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ns",
                                "uuid": 44
                            },
                            {
                                "name": "value",
                                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                                "uuid": 43
                            }
                        ]
                    },
                    {
                        "uuid": 45,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "uuid": 40
                            }
                        ]
                    },
                    {
                        "uuid": 46,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "uuid": 40
                            },
                            {
                                "name": "nr",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr",
                                "uuid": 41
                            }
                        ]
                    },
                    {
                        "uuid": 47,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "uuid": 40
                            },
                            {
                                "name": "ind",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind",
                                "uuid": 42
                            }
                        ]
                    },
                    {
                        "uuid": 48,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "uuid": 40
                            },
                            {
                                "name": "value",
                                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                                "uuid": 43
                            }
                        ]
                    },
                    {
                        "uuid": 41,
                        "attributes": [
                            {
                                "name": "typ",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#typ",
                                "uuid": 37
                            }
                        ]
                    },
                    {
                        "uuid": 42,
                        "attributes": [
                            {
                                "name": "status",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#status",
                                "uuid": 38
                            }
                        ]
                    },
                    {
                        "uuid": 43,
                        "attributes": [
                            {
                                "name": "mabVersion",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#mabVersion",
                                "uuid": 39
                            }
                        ]
                    },
                    {
                        "uuid": 44,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "uuid": 40
                            }
                        ]
                    }
                ],
                "record_class": {
                    "name": "datensatzType",
                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datensatzType",
                    "uuid": 3
                },
                "content_schema": {
                    "name": "mab content schema",
                    "uuid": 1,
                    "key_attribute_paths": [
                        {
                            "uuid": 46,
                            "attributes": [
                                {
                                    "name": "feld",
                                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                    "uuid": 40
                                },
                                {
                                    "name": "nr",
                                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr",
                                    "uuid": 41
                                }
                            ]
                        },
                        {
                            "uuid": 47,
                            "attributes": [
                                {
                                    "name": "feld",
                                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                    "uuid": 40
                                },
                                {
                                    "name": "ind",
                                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind",
                                    "uuid": 42
                                }
                            ]
                        }
                    ],
                    "value_attribute_path": {
                        "uuid": 48,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "uuid": 40
                            },
                            {
                                "name": "value",
                                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                                "uuid": 43
                            }
                        ]
                    }
                }
            },
            "uuid": 18,
            "data_resource": {
                "name": "mabxml_dmp.xml",
                "description": "sdff",
                "type": "FILE",
                "uuid": 2,
                "resource_attributes": {
                    "path": "/var/www/dmp/init/../tmp/resources/mabxml_dmp.xml",
                    "filesize": -1,
                    "filetype": "application/xml"
                },
                "configurations": [
                    {
                        "name": "xml",
                        "description": "xml with id 2",
                        "uuid": 2,
                        "resources": [
                            {
                                "uuid": 2
                            }
                        ],
                        "parameters": {
                            "storage_type": "mabxml",
                            "record_tag": "datensatz"
                        }
                    }
                ]
            }
        },
        "output_data_model": {
            "name": "Internal Data Model ContractItem",
            "description": "Internal Data Model ContractItem",
            "schema": {
                "name": "bibrm:ContractItem-Schema (ERM-Scenario)",
                "uuid": 1,
                "attribute_paths": [
                    {
                        "uuid": 3,
                        "attributes": [
                            {
                                "name": "title",
                                "uri": "http://purl.org/dc/elements/1.1/title",
                                "uuid": 3
                            }
                        ]
                    },
                    {
                        "uuid": 4,
                        "attributes": [
                            {
                                "name": "price",
                                "uri": "http://vocab.ub.uni-leipzig.de/bibrm/price",
                                "uuid": 4
                            }
                        ]
                    },
                    {
                        "uuid": 1,
                        "attributes": [
                            {
                                "name": "type",
                                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                "uuid": 1
                            }
                        ]
                    },
                    {
                        "uuid": 2,
                        "attributes": [
                            {
                                "name": "EISSN",
                                "uri": "http://vocab.ub.uni-leipzig.de/bibrm/EISSN",
                                "uuid": 2
                            }
                        ]
                    }
                ],
                "record_class": {
                    "name": "ContractItem",
                    "uri": "http://vocab.ub.uni-leipzig.de/bibrm/ContractItem",
                    "uuid": 1
                }
            },
            "uuid": 1
        },
        "mappings": [],
        "functions": [
            {
                "type": "Function",
                "name": "concat",
                "description": "Collects all received values and concatenates them on record end.",
                "uuid": 23,
                "function_description": {
                    "name": "concat",
                    "dsl": "metafacture",
                    "reference": "concat",
                    "description": "Collects all received values and concatenates them on record end.",
                    "parameters": {
                        "delimiter": {
                            "type": "text"
                        },
                        "prefix": {
                            "type": "text",
                            "optional": true
                        },
                        "postfix": {
                            "type": "text",
                            "optional": true
                        }
                    }
                },
                "parameters": [
                    "delimiter",
                    "prefix",
                    "postfix"
                ]
            }
        ]
    })
    .value("mockProjectJSON3", {
        "name": "csv",
        "description": null,
        "uuid": 26,
        "input_data_model": {
            "name": "TB_data_dictionary_2013-11-11.csv + null data model",
            "description": " data model of resource 'TB_data_dictionary_2013-11-11.csv' and configuration ' null'",
            "configuration": {
                "name": null,
                "description": null,
                "uuid": 10,
                "resources": [
                    {
                        "uuid": 1
                    }
                ],
                "parameters": {
                    "column_delimiter": ",",
                    "escape_character": "\\",
                    "quote_character": "\"",
                    "first_row_is_headings": true,
                    "column_names": "columnN",
                    "storage_type": "csv"
                }
            },
            "schema": {
                "name": "TB_data_dictionary_2013-11-11.csv schema",
                "uuid": 10,
                "attribute_paths": [
                    {
                        "uuid": 54,
                        "attributes": [
                            {
                                "name": "variable_name",
                                "uri": "http://data.slub-dresden.de/resources/1/schema#variable_name",
                                "uuid": 46,
                                "_$path_id": 54
                            }
                        ]
                    },
                    {
                        "uuid": 56,
                        "attributes": [
                            {
                                "name": "code_list",
                                "uri": "http://data.slub-dresden.de/resources/1/schema#code_list",
                                "uuid": 48,
                                "_$path_id": 56
                            }
                        ]
                    },
                    {
                        "uuid": 1,
                        "attributes": [
                            {
                                "name": "type",
                                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                "uuid": 1,
                                "_$path_id": 1
                            }
                        ]
                    },
                    {
                        "uuid": 55,
                        "attributes": [
                            {
                                "name": "dataset",
                                "uri": "http://data.slub-dresden.de/resources/1/schema#dataset",
                                "uuid": 47,
                                "_$path_id": 55
                            }
                        ]
                    },
                    {
                        "uuid": 57,
                        "attributes": [
                            {
                                "name": "definition",
                                "uri": "http://data.slub-dresden.de/resources/1/schema#definition",
                                "uuid": 49,
                                "_$path_id": 57
                            }
                        ]
                    }
                ],
                "record_class": {
                    "name": "record type",
                    "uri": "http://data.slub-dresden.de/resources/1/schema#RecordType",
                    "uuid": 4
                }
            },
            "uuid": 19,
            "data_resource": {
                "name": "TB_data_dictionary_2013-11-11.csv",
                "description": "TB",
                "type": "FILE",
                "uuid": 1,
                "resource_attributes": {
                    "path": "/var/www/dmp/init/../tmp/resources/TB_data_dictionary_2013-11-11.csv",
                    "filesize": -1,
                    "filetype": "text/csv"
                },
                "configurations": [
                    {
                        "name": null,
                        "description": null,
                        "uuid": 3,
                        "resources": [
                            {
                                "uuid": 1
                            }
                        ],
                        "parameters": {
                            "column_delimiter": ",",
                            "escape_character": "\\",
                            "quote_character": "\"",
                            "first_row_is_headings": true,
                            "column_names": "columnN",
                            "storage_type": "csv"
                        }
                    },
                    {
                        "name": null,
                        "description": null,
                        "uuid": 1,
                        "resources": [
                            {
                                "uuid": 1
                            }
                        ],
                        "parameters": {
                            "column_delimiter": ",",
                            "escape_character": "\\",
                            "quote_character": "\"",
                            "first_row_is_headings": true,
                            "column_names": "columnN",
                            "storage_type": "csv"
                        }
                    },
                    {
                        "name": null,
                        "description": null,
                        "uuid": 9,
                        "resources": [
                            {
                                "uuid": 1
                            }
                        ],
                        "parameters": {
                            "column_delimiter": ",",
                            "escape_character": "\\",
                            "quote_character": "\"",
                            "first_row_is_headings": true,
                            "column_names": "columnN",
                            "storage_type": "csv"
                        }
                    },
                    {
                        "name": null,
                        "description": null,
                        "uuid": 10,
                        "resources": [
                            {
                                "uuid": 1
                            }
                        ],
                        "parameters": {
                            "column_delimiter": ",",
                            "escape_character": "\\",
                            "quote_character": "\"",
                            "first_row_is_headings": true,
                            "column_names": "columnN",
                            "storage_type": "csv"
                        }
                    }
                ]
            }
        },
        "mappings": [
            {
                "uuid": -1410185900845,
                "_$connection_id": "con_5",
                "name": "gffggf",
                "transformation": {
                    "name": "transformation",
                    "description": "transformation",
                    "function": {
                        "name": "transformation",
                        "description": "transformation",
                        "parameters": [],
                        "type": "Transformation",
                        "components": [
                            {
                                "function": {
                                    "name": "concat",
                                    "description": "Collects all received values and concatenates them on record end.",
                                    "uuid": 23,
                                    "function_description": {
                                        "name": "concat",
                                        "dsl": "metafacture",
                                        "reference": "concat",
                                        "description": "Collects all received values and concatenates them on record end.",
                                        "parameters": {
                                            "delimiter": {
                                                "type": "text"
                                            },
                                            "prefix": {
                                                "type": "text",
                                                "optional": true
                                            },
                                            "postfix": {
                                                "type": "text",
                                                "optional": true
                                            }
                                        }
                                    },
                                    "parameters": [
                                        "delimiter",
                                        "prefix",
                                        "postfix"
                                    ],
                                    "type": "Function"
                                },
                                "name": "component1410195726811",
                                "uuid": -1410195726280,
                                "output_components": [],
                                "input_components": [],
                                "description": "{\"x\":\"dataset__-1410185900851\",\"y\":0}",
                                "parameter_mappings": {
                                    "inputString": "dataset__-1410185900851,definition__-1410185903886"
                                }
                            }
                        ]
                    },
                    "parameter_mappings": {
                        "dataset__-1410185900851": "http://data.slub-dresden.de/resources/1/schema#dataset",
                        "definition__-1410185903886": "http://data.slub-dresden.de/resources/1/schema#definition",
                        "type__-1410186655082": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                        "__TRANSFORMATION_OUTPUT_VARIABLE__1": "http://vocab.ub.uni-leipzig.de/bibrm/EISSN"
                    }
                },
                "input_attribute_paths": [
                    {
                        "type": "MappingAttributePathInstance",
                        "name": "dataset__-1410185900851",
                        "uuid": -1410185900851,
                        "attribute_path": {
                            "uuid": 55,
                            "attributes": [
                                {
                                    "name": "dataset",
                                    "uri": "http://data.slub-dresden.de/resources/1/schema#dataset",
                                    "uuid": 47,
                                    "_$path_id": 55
                                }
                            ]
                        },
                        "$$hashKey": "0CF"
                    },
                    {
                        "type": "MappingAttributePathInstance",
                        "name": "definition__-1410185903886",
                        "uuid": -1410185903886,
                        "attribute_path": {
                            "uuid": 57,
                            "attributes": [
                                {
                                    "name": "definition",
                                    "uri": "http://data.slub-dresden.de/resources/1/schema#definition",
                                    "uuid": 49,
                                    "_$path_id": 57
                                }
                            ]
                        },
                        "$$hashKey": "0CG"
                    },
                    {
                        "type": "MappingAttributePathInstance",
                        "name": "type__-1410186655082",
                        "uuid": -1410186655082,
                        "attribute_path": {
                            "uuid": 1,
                            "attributes": [
                                {
                                    "name": "type",
                                    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                    "uuid": 1,
                                    "_$path_id": 1
                                }
                            ]
                        },
                        "$$hashKey": "0CH"
                    }
                ],
                "output_attribute_path": {
                    "type": "MappingAttributePathInstance",
                    "name": "output mapping attribute path instance",
                    "uuid": -1410185900852,
                    "attribute_path": {
                        "uuid": 2,
                        "attributes": [
                            {
                                "name": "EISSN",
                                "uri": "http://vocab.ub.uni-leipzig.de/bibrm/EISSN",
                                "uuid": 2,
                                "_$path_id": 2
                            }
                        ]
                    },
                    "$$hashKey": "0CO"
                },
                "_$components": []
            }
        ],
        "functions": [
            {
                "name": "concat",
                "description": "Collects all received values and concatenates them on record end.",
                "uuid": 23,
                "function_description": {
                    "name": "concat",
                    "dsl": "metafacture",
                    "reference": "concat",
                    "description": "Collects all received values and concatenates them on record end.",
                    "parameters": {
                        "delimiter": {
                            "type": "text"
                        },
                        "prefix": {
                            "type": "text",
                            "optional": true
                        },
                        "postfix": {
                            "type": "text",
                            "optional": true
                        }
                    }
                },
                "parameters": [
                    "delimiter",
                    "prefix",
                    "postfix"
                ],
                "type": "Function"
            }
        ],
        "_$input_data_model_schema": {
            "name": "TB_data_dictionary_2013-11-11.csv schema",
            "$show": false,
            "editableTitle": false,
            "$wasRendered": false,
            "hasChildren": true,
            "children": [
                {
                    "uuid": 46,
                    "uri": "http://data.slub-dresden.de/resources/1/schema#variable_name",
                    "name": "variable_name",
                    "_$path_id": 54,
                    "$show": false,
                    "editableTitle": false,
                    "$wasRendered": false,
                    "hasChildren": false,
                    "$$hashKey": "05R"
                },
                {
                    "uuid": 48,
                    "uri": "http://data.slub-dresden.de/resources/1/schema#code_list",
                    "name": "code_list",
                    "_$path_id": 56,
                    "$show": false,
                    "editableTitle": false,
                    "$wasRendered": false,
                    "hasChildren": false,
                    "$$hashKey": "05S"
                },
                {
                    "uuid": 1,
                    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                    "name": "type",
                    "_$path_id": 1,
                    "$show": true,
                    "editableTitle": false,
                    "$wasRendered": true,
                    "hasChildren": false,
                    "$$hashKey": "05T"
                },
                {
                    "uuid": 47,
                    "uri": "http://data.slub-dresden.de/resources/1/schema#dataset",
                    "name": "dataset",
                    "_$path_id": 55,
                    "$show": true,
                    "editableTitle": false,
                    "$wasRendered": true,
                    "hasChildren": false,
                    "$$hashKey": "05U"
                },
                {
                    "uuid": 49,
                    "uri": "http://data.slub-dresden.de/resources/1/schema#definition",
                    "name": "definition",
                    "_$path_id": 57,
                    "$show": true,
                    "editableTitle": false,
                    "$wasRendered": true,
                    "hasChildren": false,
                    "$$hashKey": "05V"
                }
            ]
        },
        "output_data_model": {
            "name": "Internal Data Model ContractItem",
            "description": "Internal Data Model ContractItem",
            "schema": {
                "name": "bibrm:ContractItem-Schema (ERM-Scenario)",
                "uuid": 1,
                "attribute_paths": [
                    {
                        "uuid": 3,
                        "attributes": [
                            {
                                "name": "title",
                                "uri": "http://purl.org/dc/elements/1.1/title",
                                "uuid": 3,
                                "_$path_id": 3
                            }
                        ]
                    },
                    {
                        "uuid": 4,
                        "attributes": [
                            {
                                "name": "price",
                                "uri": "http://vocab.ub.uni-leipzig.de/bibrm/price",
                                "uuid": 4,
                                "_$path_id": 4
                            }
                        ]
                    },
                    {
                        "uuid": 1,
                        "attributes": [
                            {
                                "name": "type",
                                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                "uuid": 1,
                                "_$path_id": 1
                            }
                        ]
                    },
                    {
                        "uuid": 2,
                        "attributes": [
                            {
                                "name": "EISSN",
                                "uri": "http://vocab.ub.uni-leipzig.de/bibrm/EISSN",
                                "uuid": 2,
                                "_$path_id": 2
                            }
                        ]
                    }
                ],
                "record_class": {
                    "name": "ContractItem",
                    "uri": "http://vocab.ub.uni-leipzig.de/bibrm/ContractItem",
                    "uuid": 1
                }
            },
            "uuid": 1,
            "_$name": "bibrm:ContractItem-Schema (ERM-Scenario) (Internal Data Model ContractItem)",
            "_$description": "4 attribute paths, record class: ContractItem"
        },
        "_$output_data_model_schema": {
            "name": "bibrm:ContractItem-Schema (ERM-Scenario)",
            "$show": false,
            "editableTitle": false,
            "$wasRendered": false,
            "hasChildren": true,
            "children": [
                {
                    "uuid": 3,
                    "uri": "http://purl.org/dc/elements/1.1/title",
                    "name": "title",
                    "_$path_id": 3,
                    "$show": false,
                    "editableTitle": false,
                    "$wasRendered": false,
                    "hasChildren": false,
                    "$$hashKey": "061"
                },
                {
                    "uuid": 4,
                    "uri": "http://vocab.ub.uni-leipzig.de/bibrm/price",
                    "name": "price",
                    "_$path_id": 4,
                    "$show": false,
                    "editableTitle": false,
                    "$wasRendered": false,
                    "hasChildren": false,
                    "$$hashKey": "062"
                },
                {
                    "uuid": 1,
                    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                    "name": "type",
                    "_$path_id": 1,
                    "$show": false,
                    "editableTitle": false,
                    "$wasRendered": false,
                    "hasChildren": false,
                    "$$hashKey": "063"
                },
                {
                    "uuid": 2,
                    "uri": "http://vocab.ub.uni-leipzig.de/bibrm/EISSN",
                    "name": "EISSN",
                    "_$path_id": 2,
                    "$show": false,
                    "editableTitle": false,
                    "$wasRendered": false,
                    "hasChildren": false,
                    "$$hashKey": "064"
                }
            ]
        }
    });
