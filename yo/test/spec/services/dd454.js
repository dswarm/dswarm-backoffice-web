'use strict';

describe('ralfsMabSchema', function (){
    var schemaParser;

    var rmxSchema = {
        "name": null,
        "uuid": 32,
        "attribute_paths": [
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 9,
                attribute_path : {
                    "uuid": 227,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "record",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "uuid": 185
                        },
                        {
                            "name": "controlfield",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#controlfield",
                            "uuid": 187
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 933354,
                attribute_path : {
                    "uuid": 20,
                    "attributes": [
                        {
                            "name": "type",
                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                            "uuid": 20
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 9785,
                attribute_path : {
                    "uuid": 223,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "record",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "uuid": 185
                        },
                        {
                            "name": "type",
                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                            "uuid": 20
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 9677544,
                attribute_path : {
                    "uuid": 228,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "record",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "uuid": 185
                        },
                        {
                            "name": "controlfield",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#controlfield",
                            "uuid": 187
                        },
                        {
                            "name": "type",
                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                            "uuid": 20
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 5624249,
                attribute_path : {
                    "uuid": 224,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "record",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "uuid": 185
                        },
                        {
                            "name": "leader",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#leader",
                            "uuid": 186
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 34567569,
                attribute_path : {
                    "uuid": 221,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "type",
                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                            "uuid": 20
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 96876774,
                attribute_path : {
                    "uuid": 225,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "record",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "uuid": 185
                        },
                        {
                            "name": "leader",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#leader",
                            "uuid": 186
                        },
                        {
                            "name": "type",
                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                            "uuid": 20
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 3442349,
                attribute_path : {
                    "uuid": 226,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "record",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "uuid": 185
                        },
                        {
                            "name": "leader",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#leader",
                            "uuid": 186
                        },
                        {
                            "name": "value",
                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                            "uuid": 137
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 676453423429,
                attribute_path : {
                    "uuid": 222,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "record",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "uuid": 185
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 97865634423,
                attribute_path : {
                    "uuid": 231,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "record",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "uuid": 185
                        },
                        {
                            "name": "datafield",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                            "uuid": 189
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 123445439,
                attribute_path : {
                    "uuid": 219,
                    "attributes": [
                        {
                            "name": "header",
                            "uri": "http://www.openarchives.org/OAI/2.0/header",
                            "uuid": 182
                        },
                        {
                            "name": "identifier",
                            "uri": "http://www.openarchives.org/OAI/2.0/identifier",
                            "uuid": 183
                        },
                        {
                            "name": "value",
                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                            "uuid": 137
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 98544343532,
                attribute_path : {
                    "uuid": 232,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "record",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "uuid": 185
                        },
                        {
                            "name": "datafield",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                            "uuid": 189
                        },
                        {
                            "name": "type",
                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                            "uuid": 20
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 963232342343,
                attribute_path : {
                    "uuid": 220,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 1234575339,
                attribute_path : {
                    "uuid": 229,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "record",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "uuid": 185
                        },
                        {
                            "name": "controlfield",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#controlfield",
                            "uuid": 187
                        },
                        {
                            "name": "tag",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tag",
                            "uuid": 188
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 21345546549,
                attribute_path : {
                    "uuid": 217,
                    "attributes": [
                        {
                            "name": "header",
                            "uri": "http://www.openarchives.org/OAI/2.0/header",
                            "uuid": 182
                        },
                        {
                            "name": "identifier",
                            "uri": "http://www.openarchives.org/OAI/2.0/identifier",
                            "uuid": 183
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 91212323545678,
                attribute_path : {
                    "uuid": 230,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "record",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "uuid": 185
                        },
                        {
                            "name": "controlfield",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#controlfield",
                            "uuid": 187
                        },
                        {
                            "name": "value",
                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                            "uuid": 137
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 4654652352349,
                attribute_path : {
                    "uuid": 218,
                    "attributes": [
                        {
                            "name": "header",
                            "uri": "http://www.openarchives.org/OAI/2.0/header",
                            "uuid": 182
                        },
                        {
                            "name": "identifier",
                            "uri": "http://www.openarchives.org/OAI/2.0/identifier",
                            "uuid": 183
                        },
                        {
                            "name": "type",
                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                            "uuid": 20
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 12344521219,
                attribute_path : {
                    "uuid": 235,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "record",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "uuid": 185
                        },
                        {
                            "name": "datafield",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                            "uuid": 189
                        },
                        {
                            "name": "subfield",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#subfield",
                            "uuid": 190
                        },
                        {
                            "name": "type",
                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                            "uuid": 20
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 867549,
                attribute_path : {
                    "uuid": 215,
                    "attributes": [
                        {
                            "name": "header",
                            "uri": "http://www.openarchives.org/OAI/2.0/header",
                            "uuid": 182
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 67761211119,
                attribute_path : {
                    "uuid": 236,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "record",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "uuid": 185
                        },
                        {
                            "name": "datafield",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                            "uuid": 189
                        },
                        {
                            "name": "subfield",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#subfield",
                            "uuid": 190
                        },
                        {
                            "name": "code",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#code",
                            "uuid": 191
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 1234123121119,
                attribute_path : {
                    "uuid": 216,
                    "attributes": [
                        {
                            "name": "header",
                            "uri": "http://www.openarchives.org/OAI/2.0/header",
                            "uuid": 182
                        },
                        {
                            "name": "type",
                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                            "uuid": 20
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 1131234354349,
                attribute_path : {
                    "uuid": 233,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "record",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "uuid": 185
                        },
                        {
                            "name": "datafield",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                            "uuid": 189
                        },
                        {
                            "name": "tag",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tag",
                            "uuid": 188
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 112222129,
                attribute_path : {
                    "uuid": 234,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "record",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "uuid": 185
                        },
                        {
                            "name": "datafield",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                            "uuid": 189
                        },
                        {
                            "name": "subfield",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#subfield",
                            "uuid": 190
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 7897834349,
                attribute_path : {
                    "uuid": 237,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "record",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "uuid": 185
                        },
                        {
                            "name": "datafield",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                            "uuid": 189
                        },
                        {
                            "name": "subfield",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#subfield",
                            "uuid": 190
                        },
                        {
                            "name": "value",
                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                            "uuid": 137
                        }
                    ]
                }
            },
            {
                type : "SchemaAttributePathInstance",
                name : null,
                uuid : 3343342342349,
                attribute_path : {
                    "uuid": 238,
                    "attributes": [
                        {
                            "name": "metadata",
                            "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                            "uuid": 184
                        },
                        {
                            "name": "record",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "uuid": 185
                        },
                        {
                            "name": "datafield",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                            "uuid": 189
                        },
                        {
                            "name": "ind1",
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind1",
                            "uuid": 192
                        }
                    ]
                }
            }
        ],
        "record_class": {
            "name": "recordType",
            "uri": "http://www.openarchives.org/OAI/2.0/recordType",
            "uuid": 25
        }
    },

        rmxResult = {
            "name": "",
            "$show": false, "$wasRendered" : false,
            "editableTitle": false,
            "hasChildren": true,
            "children": [
                {
                    "uuid": 20,
                    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                    "name": "type",
                    "_$path_id": 20,
                    "_$isSubSchema" : false,
                    "$show": false, "$wasRendered" : false,
                    "editableTitle": false,
                    "hasChildren": false
                },
                {
                    "uuid": 184,
                    "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                    "name": "metadata",
                    "_$path_id": 220,
                    "_$isSubSchema" : false,
                    "$show": false, "$wasRendered" : false,
                    "editableTitle": false,
                    "hasChildren": true,
                    "children": [
                        {
                            "uuid": 20,
                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                            "name": "type",
                            "_$path_id": 221,
                            "_$isSubSchema" : false,
                            "$show": false, "$wasRendered" : false,
                            "editableTitle": false,
                            "hasChildren": false
                        },
                        {
                            "uuid": 185,
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "name": "record",
                            "_$path_id": 222,
                            "_$isSubSchema" : false,
                            "$show": false, "$wasRendered" : false,
                            "editableTitle": false,
                            "hasChildren": true,
                            "children": [
                                {
                                    "uuid": 20,
                                    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                    "name": "type",
                                    "_$path_id": 223,
                                    "_$isSubSchema" : false,
                                    "$show": false, "$wasRendered" : false,
                                    "editableTitle": false,
                                    "hasChildren": false
                                },
                                {
                                    "uuid": 187,
                                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#controlfield",
                                    "name": "controlfield",
                                    "_$path_id": 227,
                                    "_$isSubSchema" : false,
                                    "$show": false, "$wasRendered" : false,
                                    "editableTitle": false,
                                    "hasChildren": true,
                                    "children": [
                                        {
                                            "uuid": 20,
                                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                            "name": "type",
                                            "_$path_id": 228,
                                            "_$isSubSchema" : false,
                                            "$show": false, "$wasRendered" : false,
                                            "editableTitle": false,
                                            "hasChildren": false
                                        },
                                        {
                                            "uuid": 188,
                                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tag",
                                            "name": "tag",
                                            "_$path_id": 229,
                                            "_$isSubSchema" : false,
                                            "$show": false, "$wasRendered" : false,
                                            "editableTitle": false,
                                            "hasChildren": false
                                        },
                                        {
                                            "uuid": 137,
                                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                                            "name": "value",
                                            "_$path_id": 230,
                                            "_$isSubSchema" : false,
                                            "$show": false, "$wasRendered" : false,
                                            "editableTitle": false,
                                            "hasChildren": false
                                        }
                                    ]
                                },
                                {
                                    "uuid": 186,
                                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#leader",
                                    "name": "leader",
                                    "_$path_id": 224,
                                    "_$isSubSchema" : false,
                                    "$show": false, "$wasRendered" : false,
                                    "editableTitle": false,
                                    "hasChildren": true,
                                    "children": [
                                        {
                                            "uuid": 20,
                                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                            "name": "type",
                                            "_$path_id": 225,
                                            "_$isSubSchema" : false,
                                            "$show": false, "$wasRendered" : false,
                                            "editableTitle": false,
                                            "hasChildren": false
                                        },
                                        {
                                            "uuid": 137,
                                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                                            "name": "value",
                                            "_$path_id": 226,
                                            "_$isSubSchema" : false,
                                            "$show": false, "$wasRendered" : false,
                                            "editableTitle": false,
                                            "hasChildren": false
                                        }
                                    ]
                                },
                                {
                                    "uuid": 189,
                                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                                    "name": "datafield",
                                    "_$path_id": 231,
                                    "_$isSubSchema" : false,
                                    "$show": false, "$wasRendered" : false,
                                    "editableTitle": false,
                                    "hasChildren": true,
                                    "children": [
                                        {
                                            "uuid": 20,
                                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                            "name": "type",
                                            "_$path_id": 232,
                                            "_$isSubSchema" : false,
                                            "$show": false, "$wasRendered" : false,
                                            "editableTitle": false,
                                            "hasChildren": false
                                        },
                                        {
                                            "uuid": 188,
                                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tag",
                                            "name": "tag",
                                            "_$path_id": 233,
                                            "_$isSubSchema" : false,
                                            "$show": false, "$wasRendered" : false,
                                            "editableTitle": false,
                                            "hasChildren": false
                                        },
                                        {
                                            "uuid": 192,
                                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind1",
                                            "name": "ind1",
                                            "_$path_id": 238,
                                            "_$isSubSchema" : false,
                                            "$show": false, "$wasRendered" : false,
                                            "editableTitle": false,
                                            "hasChildren": false
                                        },
                                        {
                                            "uuid": 190,
                                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#subfield",
                                            "name": "subfield",
                                            "_$path_id": 234,
                                            "_$isSubSchema" : false,
                                            "$show": false, "$wasRendered" : false,
                                            "editableTitle": false,
                                            "hasChildren": true,
                                            "children": [
                                                {
                                                    "uuid": 20,
                                                    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                                    "name": "type",
                                                    "_$path_id": 235,
                                                    "_$isSubSchema" : false,
                                                    "$show": false, "$wasRendered" : false,
                                                    "editableTitle": false,
                                                    "hasChildren": false
                                                },
                                                {
                                                    "uuid": 191,
                                                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#code",
                                                    "name": "code",
                                                    "_$path_id": 236,
                                                    "_$isSubSchema" : false,
                                                    "$show": false, "$wasRendered" : false,
                                                    "editableTitle": false,
                                                    "hasChildren": false
                                                },
                                                {
                                                    "uuid": 137,
                                                    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                                                    "name": "value",
                                                    "_$path_id": 237,
                                                    "_$isSubSchema" : false,
                                                    "$show": false, "$wasRendered" : false,
                                                    "editableTitle": false,
                                                    "hasChildren": false
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "uuid": 182,
                    "uri": "http://www.openarchives.org/OAI/2.0/header",
                    "name": "header",
                    "_$path_id": 215,
                    "_$isSubSchema" : false,
                    "$show": false, "$wasRendered" : false,
                    "editableTitle": false,
                    "hasChildren": true,
                    "children": [
                        {
                            "uuid": 20,
                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                            "name": "type",
                            "_$path_id": 216,
                            "_$isSubSchema" : false,
                            "$show": false, "$wasRendered" : false,
                            "editableTitle": false,
                            "hasChildren": false
                        },
                        {
                            "uuid": 183,
                            "uri": "http://www.openarchives.org/OAI/2.0/identifier",
                            "name": "identifier",
                            "_$path_id": 217,
                            "_$isSubSchema" : false,
                            "$show": false, "$wasRendered" : false,
                            "editableTitle": false,
                            "hasChildren": true,
                            "children": [
                                {
                                    "uuid": 137,
                                    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                                    "name": "value",
                                    "_$path_id": 219,
                                    "_$isSubSchema" : false,
                                    "$show": false, "$wasRendered" : false,
                                    "editableTitle": false,
                                    "hasChildren": false
                                },
                                {
                                    "uuid": 20,
                                    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                    "name": "type",
                                    "_$path_id": 218,
                                    "_$isSubSchema" : false,
                                    "$show": false, "$wasRendered" : false,
                                    "editableTitle": false,
                                    "hasChildren": false
                                }
                            ]
                        }
                    ]
                }
            ]
        };

    beforeEach(module('dmpApp'));

    beforeEach(inject(function ($injector) {

        schemaParser = $injector.get('schemaParser');
    }));

    it('should correctly parse a nested mabrt xml schema', function() {

        var result = schemaParser.fromDomainSchema(rmxSchema);
        expect(result).toEqual(rmxResult);
    });

});
