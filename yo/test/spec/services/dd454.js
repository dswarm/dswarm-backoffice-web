'use strict';

describe('ralfsMabSchema', function (){
    var schemaParser;

    var rmxSchema = {
        "name": null,
        "id": 32,
        "attribute_paths": [
            {
                "id": 227,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "record",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                        "id": 185
                    },
                    {
                        "name": "controlfield",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#controlfield",
                        "id": 187
                    }
                ]
            },
            {
                "id": 20,
                "attributes": [
                    {
                        "name": "type",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                        "id": 20
                    }
                ]
            },
            {
                "id": 223,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "record",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                        "id": 185
                    },
                    {
                        "name": "type",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                        "id": 20
                    }
                ]
            },
            {
                "id": 228,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "record",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                        "id": 185
                    },
                    {
                        "name": "controlfield",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#controlfield",
                        "id": 187
                    },
                    {
                        "name": "type",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                        "id": 20
                    }
                ]
            },
            {
                "id": 224,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "record",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                        "id": 185
                    },
                    {
                        "name": "leader",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#leader",
                        "id": 186
                    }
                ]
            },
            {
                "id": 221,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "type",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                        "id": 20
                    }
                ]
            },
            {
                "id": 225,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "record",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                        "id": 185
                    },
                    {
                        "name": "leader",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#leader",
                        "id": 186
                    },
                    {
                        "name": "type",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                        "id": 20
                    }
                ]
            },
            {
                "id": 226,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "record",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                        "id": 185
                    },
                    {
                        "name": "leader",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#leader",
                        "id": 186
                    },
                    {
                        "name": "value",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                        "id": 137
                    }
                ]
            },
            {
                "id": 222,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "record",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                        "id": 185
                    }
                ]
            },
            {
                "id": 231,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "record",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                        "id": 185
                    },
                    {
                        "name": "datafield",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                        "id": 189
                    }
                ]
            },
            {
                "id": 219,
                "attributes": [
                    {
                        "name": "header",
                        "uri": "http://www.openarchives.org/OAI/2.0/header",
                        "id": 182
                    },
                    {
                        "name": "identifier",
                        "uri": "http://www.openarchives.org/OAI/2.0/identifier",
                        "id": 183
                    },
                    {
                        "name": "value",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                        "id": 137
                    }
                ]
            },
            {
                "id": 232,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "record",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                        "id": 185
                    },
                    {
                        "name": "datafield",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                        "id": 189
                    },
                    {
                        "name": "type",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                        "id": 20
                    }
                ]
            },
            {
                "id": 220,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    }
                ]
            },
            {
                "id": 229,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "record",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                        "id": 185
                    },
                    {
                        "name": "controlfield",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#controlfield",
                        "id": 187
                    },
                    {
                        "name": "tag",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tag",
                        "id": 188
                    }
                ]
            },
            {
                "id": 217,
                "attributes": [
                    {
                        "name": "header",
                        "uri": "http://www.openarchives.org/OAI/2.0/header",
                        "id": 182
                    },
                    {
                        "name": "identifier",
                        "uri": "http://www.openarchives.org/OAI/2.0/identifier",
                        "id": 183
                    }
                ]
            },
            {
                "id": 230,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "record",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                        "id": 185
                    },
                    {
                        "name": "controlfield",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#controlfield",
                        "id": 187
                    },
                    {
                        "name": "value",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                        "id": 137
                    }
                ]
            },
            {
                "id": 218,
                "attributes": [
                    {
                        "name": "header",
                        "uri": "http://www.openarchives.org/OAI/2.0/header",
                        "id": 182
                    },
                    {
                        "name": "identifier",
                        "uri": "http://www.openarchives.org/OAI/2.0/identifier",
                        "id": 183
                    },
                    {
                        "name": "type",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                        "id": 20
                    }
                ]
            },
            {
                "id": 235,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "record",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                        "id": 185
                    },
                    {
                        "name": "datafield",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                        "id": 189
                    },
                    {
                        "name": "subfield",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#subfield",
                        "id": 190
                    },
                    {
                        "name": "type",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                        "id": 20
                    }
                ]
            },
            {
                "id": 215,
                "attributes": [
                    {
                        "name": "header",
                        "uri": "http://www.openarchives.org/OAI/2.0/header",
                        "id": 182
                    }
                ]
            },
            {
                "id": 236,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "record",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                        "id": 185
                    },
                    {
                        "name": "datafield",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                        "id": 189
                    },
                    {
                        "name": "subfield",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#subfield",
                        "id": 190
                    },
                    {
                        "name": "code",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#code",
                        "id": 191
                    }
                ]
            },
            {
                "id": 216,
                "attributes": [
                    {
                        "name": "header",
                        "uri": "http://www.openarchives.org/OAI/2.0/header",
                        "id": 182
                    },
                    {
                        "name": "type",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                        "id": 20
                    }
                ]
            },
            {
                "id": 233,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "record",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                        "id": 185
                    },
                    {
                        "name": "datafield",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                        "id": 189
                    },
                    {
                        "name": "tag",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tag",
                        "id": 188
                    }
                ]
            },
            {
                "id": 234,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "record",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                        "id": 185
                    },
                    {
                        "name": "datafield",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                        "id": 189
                    },
                    {
                        "name": "subfield",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#subfield",
                        "id": 190
                    }
                ]
            },
            {
                "id": 237,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "record",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                        "id": 185
                    },
                    {
                        "name": "datafield",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                        "id": 189
                    },
                    {
                        "name": "subfield",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#subfield",
                        "id": 190
                    },
                    {
                        "name": "value",
                        "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                        "id": 137
                    }
                ]
            },
            {
                "id": 238,
                "attributes": [
                    {
                        "name": "metadata",
                        "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                        "id": 184
                    },
                    {
                        "name": "record",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                        "id": 185
                    },
                    {
                        "name": "datafield",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                        "id": 189
                    },
                    {
                        "name": "ind1",
                        "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind1",
                        "id": 192
                    }
                ]
            }
        ],
        "record_class": {
            "name": "recordType",
            "uri": "http://www.openarchives.org/OAI/2.0/recordType",
            "id": 25
        }
    },

        rmxResult = {
            "name": "",
            "$show": true,
            "editableTitle": false,
            "hasChildren": true,
            "children": [
                {
                    "id": 184,
                    "uri": "http://www.openarchives.org/OAI/2.0/metadata",
                    "name": "metadata",
                    "_$path_id": 220,
                    "$show": true,
                    "editableTitle": false,
                    "hasChildren": true,
                    "children": [
                        {
                            "id": 185,
                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#record",
                            "name": "record",
                            "_$path_id": 222,
                            "$show": true,
                            "editableTitle": false,
                            "hasChildren": true,
                            "children": [
                                {
                                    "id": 187,
                                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#controlfield",
                                    "name": "controlfield",
                                    "_$path_id": 227,
                                    "$show": true,
                                    "editableTitle": false,
                                    "hasChildren": true,
                                    "children": [
                                        {
                                            "id": 20,
                                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                            "name": "type",
                                            "_$path_id": 228,
                                            "$show": true,
                                            "editableTitle": false,
                                            "hasChildren": false
                                        },
                                        {
                                            "id": 188,
                                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tag",
                                            "name": "tag",
                                            "_$path_id": 229,
                                            "$show": true,
                                            "editableTitle": false,
                                            "hasChildren": false
                                        },
                                        {
                                            "id": 137,
                                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                                            "name": "value",
                                            "_$path_id": 230,
                                            "$show": true,
                                            "editableTitle": false,
                                            "hasChildren": false
                                        }
                                    ]
                                },
                                {
                                    "id": 20,
                                    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                    "name": "type",
                                    "_$path_id": 223,
                                    "$show": true,
                                    "editableTitle": false,
                                    "hasChildren": false
                                },
                                {
                                    "id": 186,
                                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#leader",
                                    "name": "leader",
                                    "_$path_id": 224,
                                    "$show": true,
                                    "editableTitle": false,
                                    "hasChildren": true,
                                    "children": [
                                        {
                                            "id": 20,
                                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                            "name": "type",
                                            "_$path_id": 225,
                                            "$show": true,
                                            "editableTitle": false,
                                            "hasChildren": false
                                        },
                                        {
                                            "id": 137,
                                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                                            "name": "value",
                                            "_$path_id": 226,
                                            "$show": true,
                                            "editableTitle": false,
                                            "hasChildren": false
                                        }
                                    ]
                                },
                                {
                                    "id": 189,
                                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#datafield",
                                    "name": "datafield",
                                    "_$path_id": 231,
                                    "$show": true,
                                    "editableTitle": false,
                                    "hasChildren": true,
                                    "children": [
                                        {
                                            "id": 20,
                                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                            "name": "type",
                                            "_$path_id": 232,
                                            "$show": true,
                                            "editableTitle": false,
                                            "hasChildren": false
                                        },
                                        {
                                            "id": 190,
                                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#subfield",
                                            "name": "subfield",
                                            "_$path_id": 234,
                                            "$show": true,
                                            "editableTitle": false,
                                            "hasChildren": true,
                                            "children": [
                                                {
                                                    "id": 20,
                                                    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                                    "name": "type",
                                                    "_$path_id": 235,
                                                    "$show": true,
                                                    "editableTitle": false,
                                                    "hasChildren": false
                                                },
                                                {
                                                    "id": 191,
                                                    "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#code",
                                                    "name": "code",
                                                    "_$path_id": 236,
                                                    "$show": true,
                                                    "editableTitle": false,
                                                    "hasChildren": false
                                                },
                                                {
                                                    "id": 137,
                                                    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                                                    "name": "value",
                                                    "_$path_id": 237,
                                                    "$show": true,
                                                    "editableTitle": false,
                                                    "hasChildren": false
                                                }
                                            ]
                                        },
                                        {
                                            "id": 188,
                                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#tag",
                                            "name": "tag",
                                            "_$path_id": 233,
                                            "$show": true,
                                            "editableTitle": false,
                                            "hasChildren": false
                                        },
                                        {
                                            "id": 192,
                                            "uri": "http://www.ddb.de/professionell/mabxml/mabxml-1.xsd#ind1",
                                            "name": "ind1",
                                            "_$path_id": 238,
                                            "$show": true,
                                            "editableTitle": false,
                                            "hasChildren": false
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": 20,
                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                            "name": "type",
                            "_$path_id": 221,
                            "$show": true,
                            "editableTitle": false,
                            "hasChildren": false
                        }
                    ]
                },
                {
                    "id": 20,
                    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                    "name": "type",
                    "_$path_id": 20,
                    "$show": true,
                    "editableTitle": false,
                    "hasChildren": false
                },
                {
                    "id": 182,
                    "uri": "http://www.openarchives.org/OAI/2.0/header",
                    "name": "header",
                    "_$path_id": 215,
                    "$show": true,
                    "editableTitle": false,
                    "hasChildren": true,
                    "children": [
                        {
                            "id": 183,
                            "uri": "http://www.openarchives.org/OAI/2.0/identifier",
                            "name": "identifier",
                            "_$path_id": 217,
                            "$show": true,
                            "editableTitle": false,
                            "hasChildren": true,
                            "children": [
                                {
                                    "id": 137,
                                    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
                                    "name": "value",
                                    "_$path_id": 219,
                                    "$show": true,
                                    "editableTitle": false,
                                    "hasChildren": false
                                },
                                {
                                    "id": 20,
                                    "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                                    "name": "type",
                                    "_$path_id": 218,
                                    "$show": true,
                                    "editableTitle": false,
                                    "hasChildren": false
                                }
                            ]
                        },
                        {
                            "id": 20,
                            "uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                            "name": "type",
                            "_$path_id": 216,
                            "$show": true,
                            "editableTitle": false,
                            "hasChildren": false
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
