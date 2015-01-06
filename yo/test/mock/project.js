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
                        type : "SchemaAttributePathInstance",
                        name : null,
                        id : 61,
                        attribute_path : {
                            "id": 132,
                            "attributes": [
                                {
                                    "id": "/test_csv.csv#id",
                                    "name": "id"
                                }
                            ]
                        }
                    },
                    {
                        type : "SchemaAttributePathInstance",
                        name : null,
                        id : 62,
                        attribute_path : {
                            "id": 136,
                            "attributes": [
                                {
                                    "id": "/test_csv.csv#year",
                                    "name": "year"
                                }
                            ]
                        }
                    },
                    {
                        type : "SchemaAttributePathInstance",
                        name : null,
                        id : 63,
                        attribute_path : {
                            "id": 135,
                            "attributes": [
                                {
                                    "id": "/test_csv.csv#isbn",
                                    "name": "isbn"
                                }
                            ]
                        }
                    },
                    {
                        type : "SchemaAttributePathInstance",
                        name : null,
                        id : 64,
                        attribute_path : {
                            "id": 134,
                            "attributes": [
                                {
                                    "id": "/test_csv.csv#description",
                                    "name": "description"
                                }
                            ]
                        }
                    },
                    {
                        type : "SchemaAttributePathInstance",
                        name : null,
                        id : 65,
                        attribute_path : {
                            "id": 133,
                            "attributes": [
                                {
                                    "id": "/test_csv.csv#name",
                                    "name": "name"
                                }
                            ]
                        }
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
    })
    .value('mockProjectJSON2', {
        "name": "newww",
        "description": null,
        "id": 25,
        "input_data_model": {
            "name": "mabxml_dmp.xml",
            "description": "sdff",
            "configuration": {
                "name": "xml",
                "description": "xml with id 2",
                "id": 2,
                "resources": [
                    {
                        "id": 2
                    }
                ],
                "parameters": {
                    "storage_type": "mabxml",
                    "record_tag": "datensatz"
                }
            },
            "schema": {
                "name": "mabxml schema",
                "id": 3,
                "attribute_paths": [
                    {
                        "id": 53,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "id": 40
                            },
                            {
                                "name": "tf",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tf",
                                "id": 45
                            }
                        ]
                    },
                    {
                        "id": 40,
                        "attributes": [
                            {
                                "name": "id",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#id",
                                "id": 36
                            }
                        ]
                    },
                    {
                        "id": 50,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "id": 40
                            },
                            {
                                "name": "ns",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ns",
                                "id": 44
                            }
                        ]
                    },
                    {
                        "id": 49,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "id": 40
                            },
                            {
                                "name": "ns",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ns",
                                "id": 44
                            }
                        ]
                    },
                    {
                        "id": 52,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "id": 40
                            },
                            {
                                "name": "tf",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tf",
                                "id": 45
                            }
                        ]
                    },
                    {
                        "id": 51,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "id": 40
                            },
                            {
                                "name": "ns",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ns",
                                "id": 44
                            },
                            {
                                "name": "value",
                                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                                "id": 43
                            }
                        ]
                    },
                    {
                        "id": 45,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "id": 40
                            }
                        ]
                    },
                    {
                        "id": 46,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "id": 40
                            },
                            {
                                "name": "nr",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr",
                                "id": 41
                            }
                        ]
                    },
                    {
                        "id": 47,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "id": 40
                            },
                            {
                                "name": "ind",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind",
                                "id": 42
                            }
                        ]
                    },
                    {
                        "id": 48,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "id": 40
                            },
                            {
                                "name": "value",
                                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                                "id": 43
                            }
                        ]
                    },
                    {
                        "id": 41,
                        "attributes": [
                            {
                                "name": "typ",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#typ",
                                "id": 37
                            }
                        ]
                    },
                    {
                        "id": 42,
                        "attributes": [
                            {
                                "name": "status",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#status",
                                "id": 38
                            }
                        ]
                    },
                    {
                        "id": 43,
                        "attributes": [
                            {
                                "name": "mabVersion",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#mabVersion",
                                "id": 39
                            }
                        ]
                    },
                    {
                        "id": 44,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "id": 40
                            }
                        ]
                    }
                ],
                "record_class": {
                    "name": "datensatzType",
                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datensatzType",
                    "id": 3
                },
                "content_schema": {
                    "name": "mab content schema",
                    "id": 1,
                    "key_attribute_paths": [
                        {
                            "id": 46,
                            "attributes": [
                                {
                                    "name": "feld",
                                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                    "id": 40
                                },
                                {
                                    "name": "nr",
                                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr",
                                    "id": 41
                                }
                            ]
                        },
                        {
                            "id": 47,
                            "attributes": [
                                {
                                    "name": "feld",
                                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                    "id": 40
                                },
                                {
                                    "name": "ind",
                                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind",
                                    "id": 42
                                }
                            ]
                        }
                    ],
                    "value_attribute_path": {
                        "id": 48,
                        "attributes": [
                            {
                                "name": "feld",
                                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                                "id": 40
                            },
                            {
                                "name": "value",
                                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                                "id": 43
                            }
                        ]
                    }
                }
            },
            "id": 18,
            "data_resource": {
                "name": "mabxml_dmp.xml",
                "description": "sdff",
                "type": "FILE",
                "id": 2,
                "resource_attributes": {
                    "path": "/var/www/dmp/init/../tmp/resources/mabxml_dmp.xml",
                    "filesize": -1,
                    "filetype": "application/xml"
                },
                "configurations": [
                    {
                        "name": "xml",
                        "description": "xml with id 2",
                        "id": 2,
                        "resources": [
                            {
                                "id": 2
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
                "id": 1,
                "attribute_paths": [
                    {
                        "id": 3,
                        "attributes": [
                            {
                                "name": "title",
                                "uri": "http://purl.org/dc/elements/1.1/title",
                                "id": 3
                            }
                        ]
                    },
                    {
                        "id": 4,
                        "attributes": [
                            {
                                "name": "price",
                                "uri": "http://vocab.ub.uni-leipzig.de/bibrm/price",
                                "id": 4
                            }
                        ]
                    },
                    {
                        "id": 1,
                        "attributes": [
                            {
                                "name": "type",
                                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                "id": 1
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "attributes": [
                            {
                                "name": "EISSN",
                                "uri": "http://vocab.ub.uni-leipzig.de/bibrm/EISSN",
                                "id": 2
                            }
                        ]
                    }
                ],
                "record_class": {
                    "name": "ContractItem",
                    "uri": "http://vocab.ub.uni-leipzig.de/bibrm/ContractItem",
                    "id": 1
                }
            },
            "id": 1
        },
        "mappings": [],
        "functions": [
            {
                "type": "Function",
                "name": "concat",
                "description": "Collects all received values and concatenates them on record end.",
                "id": 23,
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
        "id": 26,
        "input_data_model": {
            "name": "TB_data_dictionary_2013-11-11.csv + null data model",
            "description": " data model of resource 'TB_data_dictionary_2013-11-11.csv' and configuration ' null'",
            "configuration": {
                "name": null,
                "description": null,
                "id": 10,
                "resources": [
                    {
                        "id": 1
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
                "id": 10,
                "attribute_paths": [
                    {
                        "id": 54,
                        "attributes": [
                            {
                                "name": "variable_name",
                                "uri": "http://data.slub-dresden.de/resources/1/schema#variable_name",
                                "id": 46,
                                "_$path_id": 54
                            }
                        ]
                    },
                    {
                        "id": 56,
                        "attributes": [
                            {
                                "name": "code_list",
                                "uri": "http://data.slub-dresden.de/resources/1/schema#code_list",
                                "id": 48,
                                "_$path_id": 56
                            }
                        ]
                    },
                    {
                        "id": 1,
                        "attributes": [
                            {
                                "name": "type",
                                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                "id": 1,
                                "_$path_id": 1
                            }
                        ]
                    },
                    {
                        "id": 55,
                        "attributes": [
                            {
                                "name": "dataset",
                                "uri": "http://data.slub-dresden.de/resources/1/schema#dataset",
                                "id": 47,
                                "_$path_id": 55
                            }
                        ]
                    },
                    {
                        "id": 57,
                        "attributes": [
                            {
                                "name": "definition",
                                "uri": "http://data.slub-dresden.de/resources/1/schema#definition",
                                "id": 49,
                                "_$path_id": 57
                            }
                        ]
                    }
                ],
                "record_class": {
                    "name": "record type",
                    "uri": "http://data.slub-dresden.de/resources/1/schema#RecordType",
                    "id": 4
                }
            },
            "id": 19,
            "data_resource": {
                "name": "TB_data_dictionary_2013-11-11.csv",
                "description": "TB",
                "type": "FILE",
                "id": 1,
                "resource_attributes": {
                    "path": "/var/www/dmp/init/../tmp/resources/TB_data_dictionary_2013-11-11.csv",
                    "filesize": -1,
                    "filetype": "text/csv"
                },
                "configurations": [
                    {
                        "name": null,
                        "description": null,
                        "id": 3,
                        "resources": [
                            {
                                "id": 1
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
                        "id": 1,
                        "resources": [
                            {
                                "id": 1
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
                        "id": 9,
                        "resources": [
                            {
                                "id": 1
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
                        "id": 10,
                        "resources": [
                            {
                                "id": 1
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
                "id": -1410185900845,
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
                                    "id": 23,
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
                                "id": -1410195726280,
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
                        "id": -1410185900851,
                        "attribute_path": {
                            "id": 55,
                            "attributes": [
                                {
                                    "name": "dataset",
                                    "uri": "http://data.slub-dresden.de/resources/1/schema#dataset",
                                    "id": 47,
                                    "_$path_id": 55
                                }
                            ]
                        },
                        "$$hashKey": "0CF"
                    },
                    {
                        "type": "MappingAttributePathInstance",
                        "name": "definition__-1410185903886",
                        "id": -1410185903886,
                        "attribute_path": {
                            "id": 57,
                            "attributes": [
                                {
                                    "name": "definition",
                                    "uri": "http://data.slub-dresden.de/resources/1/schema#definition",
                                    "id": 49,
                                    "_$path_id": 57
                                }
                            ]
                        },
                        "$$hashKey": "0CG"
                    },
                    {
                        "type": "MappingAttributePathInstance",
                        "name": "type__-1410186655082",
                        "id": -1410186655082,
                        "attribute_path": {
                            "id": 1,
                            "attributes": [
                                {
                                    "name": "type",
                                    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                    "id": 1,
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
                    "id": -1410185900852,
                    "attribute_path": {
                        "id": 2,
                        "attributes": [
                            {
                                "name": "EISSN",
                                "uri": "http://vocab.ub.uni-leipzig.de/bibrm/EISSN",
                                "id": 2,
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
                "id": 23,
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
                    "id": 46,
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
                    "id": 48,
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
                    "id": 1,
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
                    "id": 47,
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
                    "id": 49,
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
                "id": 1,
                "attribute_paths": [
                    {
                        "id": 3,
                        "attributes": [
                            {
                                "name": "title",
                                "uri": "http://purl.org/dc/elements/1.1/title",
                                "id": 3,
                                "_$path_id": 3
                            }
                        ]
                    },
                    {
                        "id": 4,
                        "attributes": [
                            {
                                "name": "price",
                                "uri": "http://vocab.ub.uni-leipzig.de/bibrm/price",
                                "id": 4,
                                "_$path_id": 4
                            }
                        ]
                    },
                    {
                        "id": 1,
                        "attributes": [
                            {
                                "name": "type",
                                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                "id": 1,
                                "_$path_id": 1
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "attributes": [
                            {
                                "name": "EISSN",
                                "uri": "http://vocab.ub.uni-leipzig.de/bibrm/EISSN",
                                "id": 2,
                                "_$path_id": 2
                            }
                        ]
                    }
                ],
                "record_class": {
                    "name": "ContractItem",
                    "uri": "http://vocab.ub.uni-leipzig.de/bibrm/ContractItem",
                    "id": 1
                }
            },
            "id": 1,
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
                    "id": 3,
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
                    "id": 4,
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
                    "id": 1,
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
                    "id": 2,
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
