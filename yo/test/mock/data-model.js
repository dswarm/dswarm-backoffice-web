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
    })
    .value('mockDataModelsJSON', [
        {
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
        {
            "name": "Internal Data Model BiboDocument",
            "description": "Internal Data Model BiboDocument",
            "schema": {
                "name": "bibo:Document-Schema (KIM-Titeldaten)",
                "id": 2,
                "attribute_paths": [
                    {
                        "id": 37,
                        "attributes": [
                            {
                                "name": "contributor",
                                "uri": "http://purl.org/dc/terms/contributor",
                                "id": 10
                            },
                            {
                                "name": "type",
                                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                "id": 1
                            }
                        ]
                    },
                    {
                        "id": 38,
                        "attributes": [
                            {
                                "name": "contributor",
                                "uri": "http://purl.org/dc/terms/contributor",
                                "id": 10
                            },
                            {
                                "name": "familyName",
                                "uri": "http://xmlns.com/foaf/0.1/familyName",
                                "id": 34
                            }
                        ]
                    },
                    {
                        "id": 39,
                        "attributes": [
                            {
                                "name": "contributor",
                                "uri": "http://purl.org/dc/terms/contributor",
                                "id": 10
                            },
                            {
                                "name": "givenName",
                                "uri": "http://xmlns.com/foaf/0.1/givenName",
                                "id": 35
                            }
                        ]
                    },
                    {
                        "id": 33,
                        "attributes": [
                            {
                                "name": "bibliographicCitation",
                                "uri": "http://purl.org/dc/terms/bibliographicCitation",
                                "id": 33
                            }
                        ]
                    },
                    {
                        "id": 34,
                        "attributes": [
                            {
                                "name": "creator",
                                "uri": "http://purl.org/dc/terms/creator",
                                "id": 8
                            },
                            {
                                "name": "type",
                                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                "id": 1
                            }
                        ]
                    },
                    {
                        "id": 35,
                        "attributes": [
                            {
                                "name": "creator",
                                "uri": "http://purl.org/dc/terms/creator",
                                "id": 8
                            },
                            {
                                "name": "familyName",
                                "uri": "http://xmlns.com/foaf/0.1/familyName",
                                "id": 34
                            }
                        ]
                    },
                    {
                        "id": 36,
                        "attributes": [
                            {
                                "name": "creator",
                                "uri": "http://purl.org/dc/terms/creator",
                                "id": 8
                            },
                            {
                                "name": "givenName",
                                "uri": "http://xmlns.com/foaf/0.1/givenName",
                                "id": 35
                            }
                        ]
                    },
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
                        "id": 7,
                        "attributes": [
                            {
                                "name": "shortTitle",
                                "uri": "http://purl.org/ontology/bibo/shortTitle",
                                "id": 7
                            }
                        ]
                    },
                    {
                        "id": 8,
                        "attributes": [
                            {
                                "name": "creator",
                                "uri": "http://purl.org/dc/terms/creator",
                                "id": 8
                            }
                        ]
                    },
                    {
                        "id": 5,
                        "attributes": [
                            {
                                "name": "otherTitleInformation",
                                "uri": "http://rdvocab.info/Elements/otherTitleInformation",
                                "id": 5
                            }
                        ]
                    },
                    {
                        "id": 6,
                        "attributes": [
                            {
                                "name": "alternative",
                                "uri": "http://purl.org/dc/terms/alternative",
                                "id": 6
                            }
                        ]
                    },
                    {
                        "id": 11,
                        "attributes": [
                            {
                                "name": "contributor",
                                "uri": "http://purl.org/dc/elements/1.1/contributor",
                                "id": 11
                            }
                        ]
                    },
                    {
                        "id": 12,
                        "attributes": [
                            {
                                "name": "publicationStatement",
                                "uri": "http://rdvocab.info/Elements/publicationStatement",
                                "id": 12
                            }
                        ]
                    },
                    {
                        "id": 9,
                        "attributes": [
                            {
                                "name": "creator",
                                "uri": "http://purl.org/dc/elements/1.1/creator",
                                "id": 9
                            }
                        ]
                    },
                    {
                        "id": 10,
                        "attributes": [
                            {
                                "name": "contributor",
                                "uri": "http://purl.org/dc/terms/contributor",
                                "id": 10
                            }
                        ]
                    },
                    {
                        "id": 15,
                        "attributes": [
                            {
                                "name": "issued",
                                "uri": "http://purl.org/dc/terms/issued",
                                "id": 15
                            }
                        ]
                    },
                    {
                        "id": 16,
                        "attributes": [
                            {
                                "name": "sameAs",
                                "uri": "http://www.w3.org/2002/07/owl#sameAs",
                                "id": 16
                            }
                        ]
                    },
                    {
                        "id": 13,
                        "attributes": [
                            {
                                "name": "placeOfPublication",
                                "uri": "http://rdvocab.info/Elements/placeOfPublication",
                                "id": 13
                            }
                        ]
                    },
                    {
                        "id": 14,
                        "attributes": [
                            {
                                "name": "publisher",
                                "uri": "http://purl.org/dc/elements/1.1/publisher",
                                "id": 14
                            }
                        ]
                    },
                    {
                        "id": 20,
                        "attributes": [
                            {
                                "name": "lccn",
                                "uri": "http://purl.org/ontology/bibo/lccn",
                                "id": 20
                            }
                        ]
                    },
                    {
                        "id": 19,
                        "attributes": [
                            {
                                "name": "eissn",
                                "uri": "http://purl.org/ontology/bibo/eissn",
                                "id": 19
                            }
                        ]
                    },
                    {
                        "id": 18,
                        "attributes": [
                            {
                                "name": "issn",
                                "uri": "http://purl.org/ontology/bibo/issn",
                                "id": 18
                            }
                        ]
                    },
                    {
                        "id": 17,
                        "attributes": [
                            {
                                "name": "isLike",
                                "uri": "http://umbel.org/umbel#isLike",
                                "id": 17
                            }
                        ]
                    },
                    {
                        "id": 24,
                        "attributes": [
                            {
                                "name": "hasPart",
                                "uri": "http://purl.org/dc/terms/hasPart",
                                "id": 24
                            }
                        ]
                    },
                    {
                        "id": 23,
                        "attributes": [
                            {
                                "name": "medium",
                                "uri": "http://purl.org/dc/terms/medium",
                                "id": 23
                            }
                        ]
                    },
                    {
                        "id": 22,
                        "attributes": [
                            {
                                "name": "isbn",
                                "uri": "http://purl.org/ontology/bibo/isbn",
                                "id": 22
                            }
                        ]
                    },
                    {
                        "id": 21,
                        "attributes": [
                            {
                                "name": "oclcnum",
                                "uri": "http://purl.org/ontology/bibo/oclcnum",
                                "id": 21
                            }
                        ]
                    },
                    {
                        "id": 28,
                        "attributes": [
                            {
                                "name": "precededBy",
                                "uri": "http://rdvocab.info/Elements/precededBy",
                                "id": 28
                            }
                        ]
                    },
                    {
                        "id": 27,
                        "attributes": [
                            {
                                "name": "isFormatOf",
                                "uri": "http://purl.org/dc/terms/isFormatOf",
                                "id": 27
                            }
                        ]
                    },
                    {
                        "id": 26,
                        "attributes": [
                            {
                                "name": "hasVersion",
                                "uri": "http://purl.org/dc/terms/hasVersion",
                                "id": 26
                            }
                        ]
                    },
                    {
                        "id": 25,
                        "attributes": [
                            {
                                "name": "isPartOf",
                                "uri": "http://purl.org/dc/terms/isPartOf",
                                "id": 25
                            }
                        ]
                    },
                    {
                        "id": 32,
                        "attributes": [
                            {
                                "name": "edition",
                                "uri": "http://purl.org/ontology/bibo/edition",
                                "id": 32
                            }
                        ]
                    },
                    {
                        "id": 31,
                        "attributes": [
                            {
                                "name": "1053",
                                "uri": "http://iflastandards.info/ns/isbd/elements/1053",
                                "id": 31
                            }
                        ]
                    },
                    {
                        "id": 30,
                        "attributes": [
                            {
                                "name": "language",
                                "uri": "http://purl.org/dc/terms/language",
                                "id": 30
                            }
                        ]
                    },
                    {
                        "id": 29,
                        "attributes": [
                            {
                                "name": "succeededBy",
                                "uri": "http://rdvocab.info/Elements/succeededBy",
                                "id": 29
                            }
                        ]
                    }
                ],
                "record_class": {
                    "name": "Document",
                    "uri": "http://purl.org/ontology/bibo/Document",
                    "id": 2
                }
            },
            "id": 2
        },
        {
            "name": "Internal Data Model mabxml",
            "description": "Internal Data Model mabxml",
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
            "id": 3
        }
    ]);
