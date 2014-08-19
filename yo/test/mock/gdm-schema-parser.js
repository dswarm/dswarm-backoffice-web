'use strict';

angular.module('mockedSchemas', [])
    .value('mockCsvSchema', {
        id: 42,
        name: 'foobar',
        attribute_paths: [
            {
                id: 9,
                attributes: [
                    {
                        id: 'csv:foo',
                        uri: 'csv:foo',
                        name: 'foo'
                    }
                ]
            },
            {
                id: 19,
                attributes: [
                    {
                        id: 'csv:bar',
                        uri: 'csv:bar',
                        name: 'bar'
                    }
                ]
            }
        ]
    })
    .value('mockXmlSchema', {
        id: 42,
        name: 'foobarbazqux',
        attribute_paths: [
            {
                id: 9,
                attributes: [
                    {
                        id: 'xml:foo',
                        uri: 'xml:foo',
                        name: 'foo'
                    },
                    {
                        id: 'xml:foo.bar',
                        uri: 'xml:foo.bar',
                        name: 'foo.bar'
                    }
                ]
            },
            {
                id: 19,
                attributes: [
                    {
                        id: 'xml:foo',
                        uri: 'xml:foo',
                        name: 'foo'
                    },
                    {
                        id: 'xml:foo.qux',
                        uri: 'xml:foo.qux',
                        name: 'foo.qux'
                    }
                ]
            },
            {
                id: 29,
                attributes: [
                    {
                        id: 'xml:bar',
                        uri: 'xml:bar',
                        name: 'bar'
                    },
                    {
                        id: 'xml:bar.baz',
                        uri: 'xml:bar.baz',
                        name: 'bar.baz'
                    }
                ]
            }
        ]
    })
    .value('mockMabSchema', {
        "id": 1,
        "attribute_paths": [
            {
                "id": 3,
                "attributes": [
                    {
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                        "name": "feld"
                    },
                    {
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr",
                        "name": "nr"
                    }
                ]
            },
            {
                "id": 4,
                "attributes": [
                    {
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                        "name": "feld"
                    },
                    {
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind",
                        "name": "ind"
                    }
                ]
            },
            {
                "id": 1,
                "attributes": [
                    {
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                        "name": "feld"
                    }
                ]
            },
            {
                "id": 2,
                "attributes": [
                    {
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                        "name": "feld"
                    },
                    {
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                        "name": "type"
                    }
                ]
            },
            {
                "id": 7,
                "attributes": [
                    {
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                        "name": "feld"
                    },
                    {
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tf",
                        "name": "tf"
                    },
                    {
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                        "name": "type"
                    }
                ]
            },
            {
                "id": 8,
                "attributes": [
                    {
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#status",
                        "name": "status"
                    }
                ]
            },
            {
                "id": 5,
                "attributes": [
                    {
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                        "name": "feld"
                    },
                    {
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                        "name": "value"
                    }
                ]
            },
            {
                "id": 6,
                "attributes": [
                    {
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                        "name": "feld"
                    },
                    {
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tf",
                        "name": "tf"
                    }
                ]
            },
            {
                "id": 11,
                "attributes": [
                    {
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#typ",
                        "name": "typ"
                    }
                ]
            },
            {
                "id": 9,
                "attributes": [
                    {
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#mabVersion",
                        "name": "mabVersion"
                    }
                ]
            },
            {
                "id": 10,
                "attributes": [
                    {
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                        "name": "type"
                    }
                ]
            }
        ],
        "record_class": {
            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datensatzType",
            "name": "datensatzType"
        }
    })
    .value('mockMabRtSchema', {
        "name": "mabrt",
        "$show": true,
        "children": [
            {
                "$show": true,
                "hasChildren": false,
                "name": "status",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#status",
                "id": 3,
                "_$path_id": 3
            },
            {
                "$show": true,
                "hasChildren": false,
                "name": "mabVersion",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#mabVersion",
                "id": 4,
                "_$path_id": 4
            },
            {
                "$show": true,
                "hasChildren": false,
                "name": "type",
                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                "id": 1,
                "_$path_id": 1
            },
            {
                "$show": true,
                "hasChildren": false,
                "name": "typ",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#typ",
                "id": 2,
                "_$path_id": 2
            },
            {
                "$show": true,
                "hasChildren": true,
                "name": "feld",
                "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld",
                "id": 5,
                "_$path_id": 5,
                "children": [
                    {
                        "$show": true,
                        "name": "nr",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr",
                        "id": 6,
                        "_$path_id": 7
                    },
                    {
                        "$show": true,
                        "name": "ind",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind",
                        "id": 7,
                        "_$path_id": 8
                    },
                    {
                        "$show": true,
                        "name": "type",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                        "id": 1,
                        "_$path_id": 6
                    },
                    {
                        "id": 9,
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tf",
                        "name": "tf",
                        "children": [
                            {
                                "$show": true,
                                "name": "type",
                                "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                "id": 1,
                                "_$path_id": 11
                            }
                        ],
                        "hasChildren": true
                    },
                    {
                        "$show": true,
                        "name": "value",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                        "id": 8,
                        "_$path_id": 9
                    }
                ]
            }
        ],
        "hasChildren": true
    })
    .value('mockMabRtRecord', {
        id: "http://data.slub-dresden.de/datamodels/1/records/4462210f-65bf-4cf9-9a24-cb6e11da579c",
        data: [
            {
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datensatzType"
            },
            {
                "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#typ": "h"
            },
            {
                "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#status": "n"
            },
            {
                "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#mabVersion": "M2.0"
            },
            {
                "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feld": [
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "001"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "06978834"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "002"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": "a"
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "19981028"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "003"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "20010620"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "005"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": "n"
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "20011121"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "029"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": "m"
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "MB"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "030"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "az1dcr|||||37"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "037"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": "z"
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "dt."
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "050"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "|||||c||||||||"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "051"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "n||||||"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "070"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "KNUB"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "070"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": "b"
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "FRhk"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "076"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": "n"
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "098301"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "076"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": "k"
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "101171"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "076"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": "v"
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "5"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "077"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": "p"
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": [
                                "00872805",
                                "Roll, Gernot"
                            ]
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tf": [
                                {
                                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tfType"
                                }
                            ]
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "077"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": "p"
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": [
                                "00872284",
                                "Thomas, Eugen"
                            ]
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tf": [
                                {
                                    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tfType"
                                }
                            ]
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "100"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": "b"
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "Wirth, Franz Peter"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "102"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "00412254"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "104"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": "b"
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "Mann, Golo"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "106"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "00243077"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "108"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": "b"
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "Ahlsen, Leopold"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "110"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "00004514"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "112"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": "b"
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "Boysen, Rolf"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "114"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "00045374"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "116"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": "b"
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "Pekny, Romuald"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "118"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "00465696"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "120"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": "b"
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "Kreindl, Werner"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "122"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "00209123"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "331"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "Wallenstein"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "334"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "Bildtonträger"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "335"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "nach der Biographie von Golo Mann für das Fernsehen erzählt von Leopold Ahlsen"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "359"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "[Darsteller:] Rolf Boysen, Romuald Pekny, Werner Kreindl ... Kamera: Gernot Roll ... Musik: Eugen Thomas. Regie: Franz Peter Wirth"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "410"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "[Mainz]"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "412"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "ZDF [u.a.]"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "433"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "Videokassetten"
                        }
                    ],
                    [
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#nr": "501"
                        },
                        {
                            "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind": " "
                        },
                        {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "Fernsehfilm, BRD 1978"
                        }
                    ]
                ]
            }
        ]
    })
    .value('expectedMabRtRecord', {
        "name": "mabrt",
        "$show": false,
        "$wasRendered" : false,
        "children": [
            {
                "name": "type",
                "$show": false,
                "$wasRendered" : false,
                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datensatzType",
                "leaf": true
            },
            {
                "name": "typ",
                "$show": false,
                "$wasRendered" : false,
                "title": "h",
                "leaf": true
            },
            {
                "name": "status",
                "$show": false,
                "$wasRendered" : false,
                "title": "n",
                "leaf": true
            },
            {
                "name": "mabVersion",
                "$show": false,
                "$wasRendered" : false,
                "title": "M2.0",
                "leaf": true
            },
            {
                "name": "feld",
                "$show": false,
                "$wasRendered" : false,
                "children": [
                    {
                        "name": "feld",
                        "$show": false,
                        "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "001",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false,
                                "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "06978834",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false,
                        "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "002",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "a",
                                "leaf": true
                            },
                            {
                                "name": "value",                                
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "19981028",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false,
                        "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "003",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false,
                                "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "20010620",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false,
                        "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "005",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "n",
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "20011121",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false,
                        "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "029",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "m",
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "MB",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false,
                        "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "030",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false,
                                "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "az1dcr|||||37",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false,
                        "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "037",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "z",
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "dt.",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false,
                        "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false,
                                "$wasRendered" : false,
                                "title": "050",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "|||||c||||||||",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "051",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "n||||||",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "070",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "KNUB",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "070",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "title": "b",
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "FRhk",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "076",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "title": "n",
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "098301",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "076",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "title": "k",
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "101171",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "076",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "title": "v",
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "5",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "077",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "title": "p",
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "children": [
                                    {
                                        "name": "value",
                                        "$show": false, "$wasRendered" : false,
                                        "title": "00872805",
                                        "leaf": true
                                    },
                                    {
                                        "name": "value",
                                        "$show": false, "$wasRendered" : false,
                                        "title": "Roll, Gernot",
                                        "leaf": true
                                    }
                                ]
                            },
                            {
                                "name": "tf",
                                "$show": false, "$wasRendered" : false,
                                "children": [
                                    {
                                        "name": "type",
                                        "$show": false, "$wasRendered" : false,
                                        "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tfType",
                                        "leaf": true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "077",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "title": "p",
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "children": [
                                    {
                                        "name": "value",
                                        "$show": false, "$wasRendered" : false,
                                        "title": "00872284",
                                        "leaf": true
                                    },
                                    {
                                        "name": "value",
                                        "$show": false, "$wasRendered" : false,
                                        "title": "Thomas, Eugen",
                                        "leaf": true
                                    }
                                ]
                            },
                            {
                                "name": "tf",
                                "$show": false, "$wasRendered" : false,
                                "children": [
                                    {
                                        "name": "type",
                                        "$show": false, "$wasRendered" : false,
                                        "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tfType",
                                        "leaf": true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "100",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "title": "b",
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "Wirth, Franz Peter",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "102",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "00412254",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "104",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "title": "b",
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "Mann, Golo",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "106",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "00243077",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "108",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "title": "b",
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "Ahlsen, Leopold",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "110",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "00004514",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "112",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "title": "b",
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "Boysen, Rolf",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "114",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "00045374",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "116",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "title": "b",
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "Pekny, Romuald",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "118",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "00465696",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "120",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "title": "b",
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "Kreindl, Werner",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "122",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "00209123",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "331",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "Wallenstein",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "334",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "Bildtonträger",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "335",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "nach der Biographie von Golo Mann für das Fernsehen erzählt von Leopold Ahlsen",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "359",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "[Darsteller:] Rolf Boysen, Romuald Pekny, Werner Kreindl ... Kamera: Gernot Roll ... Musik: Eugen Thomas. Regie: Franz Peter Wirth",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "410",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "[Mainz]",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "412",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "ZDF [u.a.]",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "433",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "Videokassetten",
                                "leaf": true
                            }
                        ]
                    },
                    {
                        "name": "feld",
                        "$show": false, "$wasRendered" : false,
                        "children": [
                            {
                                "name": "type",
                                "$show": false, "$wasRendered" : false,
                                "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                "leaf": true
                            },
                            {
                                "name": "nr",
                                "$show": false, "$wasRendered" : false,
                                "title": "501",
                                "leaf": true
                            },
                            {
                                "name": "ind",
                                "$show": false, "$wasRendered" : false,
                                "leaf": true
                            },
                            {
                                "name": "value",
                                "$show": false, "$wasRendered" : false,
                                "title": "Fernsehfilm, BRD 1978",
                                "leaf": true
                            }
                        ]
                    }
                ]
            }
        ]
    });
