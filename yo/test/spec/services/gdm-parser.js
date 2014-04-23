'use strict';

describe('gdmParser tests', function (){
    var gdmParser,

        mabSchema = {
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
        },

        mabRecord = {
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
        },

        expectedTree = {
            "name": "mabrt",
            "$show": true,
            "children": [
                {
                    "name": "type",
                    "$show": true,
                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datensatzType",
                    "leaf": true
                },
                {
                    "name": "typ",
                    "$show": true,
                    "title": "h",
                    "leaf": true
                },
                {
                    "name": "status",
                    "$show": true,
                    "title": "n",
                    "leaf": true
                },
                {
                    "name": "mabVersion",
                    "$show": true,
                    "title": "M2.0",
                    "leaf": true
                },
                {
                    "name": "feld...",
                    "$show": true,
                    "children": [
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "001",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "06978834",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "002",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "title": "a",
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "19981028",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "003",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "20010620",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "005",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "title": "n",
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "20011121",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "029",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "title": "m",
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "MB",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "030",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "az1dcr|||||37",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "037",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "title": "z",
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "dt.",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "050",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "|||||c||||||||",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "051",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "n||||||",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "070",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "KNUB",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "070",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "title": "b",
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "FRhk",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "076",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "title": "n",
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "098301",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "076",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "title": "k",
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "101171",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "076",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "title": "v",
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "5",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "077",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "title": "p",
                                    "leaf": true
                                },
                                {
                                    "name": "value...",
                                    "$show": true,
                                    "children": [
                                        {
                                            "name": "value",
                                            "$show": true,
                                            "title": "00872805",
                                            "leaf": true
                                        },
                                        {
                                            "name": "value",
                                            "$show": true,
                                            "title": "Roll, Gernot",
                                            "leaf": true
                                        }
                                    ]
                                },
                                {
                                    "name": "tf",
                                    "$show": true,
                                    "children": [
                                        {
                                            "name": "type",
                                            "$show": true,
                                            "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tfType",
                                            "leaf": true
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "077",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "title": "p",
                                    "leaf": true
                                },
                                {
                                    "name": "value...",
                                    "$show": true,
                                    "children": [
                                        {
                                            "name": "value",
                                            "$show": true,
                                            "title": "00872284",
                                            "leaf": true
                                        },
                                        {
                                            "name": "value",
                                            "$show": true,
                                            "title": "Thomas, Eugen",
                                            "leaf": true
                                        }
                                    ]
                                },
                                {
                                    "name": "tf",
                                    "$show": true,
                                    "children": [
                                        {
                                            "name": "type",
                                            "$show": true,
                                            "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tfType",
                                            "leaf": true
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "100",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "title": "b",
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "Wirth, Franz Peter",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "102",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "00412254",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "104",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "title": "b",
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "Mann, Golo",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "106",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "00243077",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "108",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "title": "b",
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "Ahlsen, Leopold",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "110",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "00004514",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "112",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "title": "b",
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "Boysen, Rolf",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "114",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "00045374",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "116",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "title": "b",
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "Pekny, Romuald",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "118",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "00465696",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "120",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "title": "b",
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "Kreindl, Werner",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "122",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "00209123",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "331",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "Wallenstein",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "334",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "Bildtonträger",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "335",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "nach der Biographie von Golo Mann für das Fernsehen erzählt von Leopold Ahlsen",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "359",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "[Darsteller:] Rolf Boysen, Romuald Pekny, Werner Kreindl ... Kamera: Gernot Roll ... Musik: Eugen Thomas. Regie: Franz Peter Wirth",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "410",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "[Mainz]",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "412",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "ZDF [u.a.]",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "433",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "Videokassetten",
                                    "leaf": true
                                }
                            ]
                        },
                        {
                            "name": "feld",
                            "$show": true,
                            "children": [
                                {
                                    "name": "type",
                                    "$show": true,
                                    "title": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#feldType",
                                    "leaf": true
                                },
                                {
                                    "name": "nr",
                                    "$show": true,
                                    "title": "501",
                                    "leaf": true
                                },
                                {
                                    "name": "ind",
                                    "$show": true,
                                    "leaf": true
                                },
                                {
                                    "name": "value",
                                    "$show": true,
                                    "title": "Fernsehfilm, BRD 1978",
                                    "leaf": true
                                }
                            ]
                        }
                    ]
                }
            ]
        };


    beforeEach(function (){

        module('dmpApp');

        inject(function(_gdmParser_) {
            gdmParser = _gdmParser_;
        });
    });

    it('should correctly parse a mab record', function () {
        expect(gdmParser.parse(mabRecord.data, mabSchema, true)).toEqual(expectedTree);
    });
});
