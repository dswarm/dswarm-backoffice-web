'use strict';

angular.module('mockedDataModel', [])
    .value('mockDataModelJSON', {
        "uuid": 1,
        "name": "Geonames_DE_1-2.csv + tsv data model",
        "description": " data model of resource 'Geonames_DE_1-2.csv' and configuration ' tsv'",
        "configuration": {
            "uuid": 1,
            "name": "tsv",
            "description": "tab separated values",
            "resources": [
                {
                    "uuid": 1
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
            "uuid": 1,
            "name": "Geonames_DE_1-2.csv schema",
            "attribute_paths": [
                {
                    "uuid": 3,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#asciiname",
                            "name": "asciiname"
                        }
                    ]
                },
                {
                    "uuid": 4,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#alternatenames",
                            "name": "alternatenames"
                        }
                    ]
                },
                {
                    "uuid": 1,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#geonameid",
                            "name": "geonameid"
                        }
                    ]
                },
                {
                    "uuid": 2,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#name",
                            "name": "name"
                        }
                    ]
                },
                {
                    "uuid": 7,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#feature class",
                            "name": "feature class"
                        }
                    ]
                },
                {
                    "uuid": 8,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#feature code",
                            "name": "feature code"
                        }
                    ]
                },
                {
                    "uuid": 5,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#latitude",
                            "name": "latitude"
                        }
                    ]
                },
                {
                    "uuid": 6,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#longitude",
                            "name": "longitude"
                        }
                    ]
                },
                {
                    "uuid": 11,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#admin1 code",
                            "name": "admin1 code"
                        }
                    ]
                },
                {
                    "uuid": 12,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#admin2 code",
                            "name": "admin2 code"
                        }
                    ]
                },
                {
                    "uuid": 9,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#country code",
                            "name": "country code"
                        }
                    ]
                },
                {
                    "uuid": 10,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#cc2",
                            "name": "cc2"
                        }
                    ]
                },
                {
                    "uuid": 15,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#population",
                            "name": "population"
                        }
                    ]
                },
                {
                    "uuid": 16,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#elevation",
                            "name": "elevation"
                        }
                    ]
                },
                {
                    "uuid": 13,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#admin3 code",
                            "name": "admin3 code"
                        }
                    ]
                },
                {
                    "uuid": 14,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#admin4 code",
                            "name": "admin4 code"
                        }
                    ]
                },
                {
                    "uuid": 19,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#modification date",
                            "name": "modification date"
                        }
                    ]
                },
                {
                    "uuid": 18,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#timezone",
                            "name": "timezone"
                        }
                    ]
                },
                {
                    "uuid": 17,
                    "attributes": [
                        {
                            "uuid": "/Geonames_DE_1-2.csv#dem",
                            "name": "dem"
                        }
                    ]
                }
            ],
            "record_class": {
                "uuid": "/Geonames_DE_1-2.csv#RecordType",
                "name": "record type"
            }
        },
        "data_resource": {
            "uuid": 1,
            "name": "Geonames_DE_1-2.csv",
            "description": "geonames",
            "type": "FILE",
            "attributes": {
                "path": "/Users/knut/Development/Projects/DMP/init/../tmp/resources/Geonames_DE_1-2.csv",
                "filesize": -1
            },
            "configurations": [
                {
                    "uuid": 1,
                    "name": "tsv",
                    "description": "tab separated values",
                    "resources": [
                        {
                            "uuid": 1
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
        {
            "name": "Internal Data Model BiboDocument",
            "description": "Internal Data Model BiboDocument",
            "schema": {
                "name": "bibo:Document-Schema (KIM-Titeldaten)",
                "uuid": 2,
                "attribute_paths": [
                    {
                        "uuid": 37,
                        "attributes": [
                            {
                                "name": "contributor",
                                "uri": "http://purl.org/dc/terms/contributor",
                                "uuid": 10
                            },
                            {
                                "name": "type",
                                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                "uuid": 1
                            }
                        ]
                    },
                    {
                        "uuid": 38,
                        "attributes": [
                            {
                                "name": "contributor",
                                "uri": "http://purl.org/dc/terms/contributor",
                                "uuid": 10
                            },
                            {
                                "name": "familyName",
                                "uri": "http://xmlns.com/foaf/0.1/familyName",
                                "uuid": 34
                            }
                        ]
                    },
                    {
                        "uuid": 39,
                        "attributes": [
                            {
                                "name": "contributor",
                                "uri": "http://purl.org/dc/terms/contributor",
                                "uuid": 10
                            },
                            {
                                "name": "givenName",
                                "uri": "http://xmlns.com/foaf/0.1/givenName",
                                "uuid": 35
                            }
                        ]
                    },
                    {
                        "uuid": 33,
                        "attributes": [
                            {
                                "name": "bibliographicCitation",
                                "uri": "http://purl.org/dc/terms/bibliographicCitation",
                                "uuid": 33
                            }
                        ]
                    },
                    {
                        "uuid": 34,
                        "attributes": [
                            {
                                "name": "creator",
                                "uri": "http://purl.org/dc/terms/creator",
                                "uuid": 8
                            },
                            {
                                "name": "type",
                                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                "uuid": 1
                            }
                        ]
                    },
                    {
                        "uuid": 35,
                        "attributes": [
                            {
                                "name": "creator",
                                "uri": "http://purl.org/dc/terms/creator",
                                "uuid": 8
                            },
                            {
                                "name": "familyName",
                                "uri": "http://xmlns.com/foaf/0.1/familyName",
                                "uuid": 34
                            }
                        ]
                    },
                    {
                        "uuid": 36,
                        "attributes": [
                            {
                                "name": "creator",
                                "uri": "http://purl.org/dc/terms/creator",
                                "uuid": 8
                            },
                            {
                                "name": "givenName",
                                "uri": "http://xmlns.com/foaf/0.1/givenName",
                                "uuid": 35
                            }
                        ]
                    },
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
                        "uuid": 7,
                        "attributes": [
                            {
                                "name": "shortTitle",
                                "uri": "http://purl.org/ontology/bibo/shortTitle",
                                "uuid": 7
                            }
                        ]
                    },
                    {
                        "uuid": 8,
                        "attributes": [
                            {
                                "name": "creator",
                                "uri": "http://purl.org/dc/terms/creator",
                                "uuid": 8
                            }
                        ]
                    },
                    {
                        "uuid": 5,
                        "attributes": [
                            {
                                "name": "otherTitleInformation",
                                "uri": "http://rdvocab.info/Elements/otherTitleInformation",
                                "uuid": 5
                            }
                        ]
                    },
                    {
                        "uuid": 6,
                        "attributes": [
                            {
                                "name": "alternative",
                                "uri": "http://purl.org/dc/terms/alternative",
                                "uuid": 6
                            }
                        ]
                    },
                    {
                        "uuid": 11,
                        "attributes": [
                            {
                                "name": "contributor",
                                "uri": "http://purl.org/dc/elements/1.1/contributor",
                                "uuid": 11
                            }
                        ]
                    },
                    {
                        "uuid": 12,
                        "attributes": [
                            {
                                "name": "publicationStatement",
                                "uri": "http://rdvocab.info/Elements/publicationStatement",
                                "uuid": 12
                            }
                        ]
                    },
                    {
                        "uuid": 9,
                        "attributes": [
                            {
                                "name": "creator",
                                "uri": "http://purl.org/dc/elements/1.1/creator",
                                "uuid": 9
                            }
                        ]
                    },
                    {
                        "uuid": 10,
                        "attributes": [
                            {
                                "name": "contributor",
                                "uri": "http://purl.org/dc/terms/contributor",
                                "uuid": 10
                            }
                        ]
                    },
                    {
                        "uuid": 15,
                        "attributes": [
                            {
                                "name": "issued",
                                "uri": "http://purl.org/dc/terms/issued",
                                "uuid": 15
                            }
                        ]
                    },
                    {
                        "uuid": 16,
                        "attributes": [
                            {
                                "name": "sameAs",
                                "uri": "http://www.w3.org/2002/07/owl#sameAs",
                                "uuid": 16
                            }
                        ]
                    },
                    {
                        "uuid": 13,
                        "attributes": [
                            {
                                "name": "placeOfPublication",
                                "uri": "http://rdvocab.info/Elements/placeOfPublication",
                                "uuid": 13
                            }
                        ]
                    },
                    {
                        "uuid": 14,
                        "attributes": [
                            {
                                "name": "publisher",
                                "uri": "http://purl.org/dc/elements/1.1/publisher",
                                "uuid": 14
                            }
                        ]
                    },
                    {
                        "uuid": 20,
                        "attributes": [
                            {
                                "name": "lccn",
                                "uri": "http://purl.org/ontology/bibo/lccn",
                                "uuid": 20
                            }
                        ]
                    },
                    {
                        "uuid": 19,
                        "attributes": [
                            {
                                "name": "eissn",
                                "uri": "http://purl.org/ontology/bibo/eissn",
                                "uuid": 19
                            }
                        ]
                    },
                    {
                        "uuid": 18,
                        "attributes": [
                            {
                                "name": "issn",
                                "uri": "http://purl.org/ontology/bibo/issn",
                                "uuid": 18
                            }
                        ]
                    },
                    {
                        "uuid": 17,
                        "attributes": [
                            {
                                "name": "isLike",
                                "uri": "http://umbel.org/umbel#isLike",
                                "uuid": 17
                            }
                        ]
                    },
                    {
                        "uuid": 24,
                        "attributes": [
                            {
                                "name": "hasPart",
                                "uri": "http://purl.org/dc/terms/hasPart",
                                "uuid": 24
                            }
                        ]
                    },
                    {
                        "uuid": 23,
                        "attributes": [
                            {
                                "name": "medium",
                                "uri": "http://purl.org/dc/terms/medium",
                                "uuid": 23
                            }
                        ]
                    },
                    {
                        "uuid": 22,
                        "attributes": [
                            {
                                "name": "isbn",
                                "uri": "http://purl.org/ontology/bibo/isbn",
                                "uuid": 22
                            }
                        ]
                    },
                    {
                        "uuid": 21,
                        "attributes": [
                            {
                                "name": "oclcnum",
                                "uri": "http://purl.org/ontology/bibo/oclcnum",
                                "uuid": 21
                            }
                        ]
                    },
                    {
                        "uuid": 28,
                        "attributes": [
                            {
                                "name": "precededBy",
                                "uri": "http://rdvocab.info/Elements/precededBy",
                                "uuid": 28
                            }
                        ]
                    },
                    {
                        "uuid": 27,
                        "attributes": [
                            {
                                "name": "isFormatOf",
                                "uri": "http://purl.org/dc/terms/isFormatOf",
                                "uuid": 27
                            }
                        ]
                    },
                    {
                        "uuid": 26,
                        "attributes": [
                            {
                                "name": "hasVersion",
                                "uri": "http://purl.org/dc/terms/hasVersion",
                                "uuid": 26
                            }
                        ]
                    },
                    {
                        "uuid": 25,
                        "attributes": [
                            {
                                "name": "isPartOf",
                                "uri": "http://purl.org/dc/terms/isPartOf",
                                "uuid": 25
                            }
                        ]
                    },
                    {
                        "uuid": 32,
                        "attributes": [
                            {
                                "name": "edition",
                                "uri": "http://purl.org/ontology/bibo/edition",
                                "uuid": 32
                            }
                        ]
                    },
                    {
                        "uuid": 31,
                        "attributes": [
                            {
                                "name": "1053",
                                "uri": "http://iflastandards.info/ns/isbd/elements/1053",
                                "uuid": 31
                            }
                        ]
                    },
                    {
                        "uuid": 30,
                        "attributes": [
                            {
                                "name": "language",
                                "uri": "http://purl.org/dc/terms/language",
                                "uuid": 30
                            }
                        ]
                    },
                    {
                        "uuid": 29,
                        "attributes": [
                            {
                                "name": "succeededBy",
                                "uri": "http://rdvocab.info/Elements/succeededBy",
                                "uuid": 29
                            }
                        ]
                    }
                ],
                "record_class": {
                    "name": "Document",
                    "uri": "http://purl.org/ontology/bibo/Document",
                    "uuid": 2
                }
            },
            "uuid": 2
        },
        {
            "name": "Internal Data Model mabxml",
            "description": "Internal Data Model mabxml",
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
                                "name": "id",
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
            "uuid": 3
        }
    ]);
