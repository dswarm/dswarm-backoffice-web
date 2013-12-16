'use strict';

angular.module('mockedSchemaParsed', [])
    .value('mockSchemaParsedJSON', {
        "name": "OAI-PMH",
        "show": true,
        "children": [
            {
                "name": "GetRecord",
                "show": true,
                "children": [
                    {
                        "name": "record",
                        "show": true,
                        "children": [
                            {
                                "name": "header",
                                "show": true,
                                "children": [
                                    {
                                        "name": "identifier",
                                        "show": true
                                    },
                                    {
                                        "name": "datestamp",
                                        "show": true
                                    },
                                    {
                                        "name": "setSpec",
                                        "show": true
                                    }
                                ]
                            },
                            {
                                "name": "metadata",
                                "show": true,
                                "children": [
                                    {
                                        "name": "oai_dc:dc",
                                        "show": true,
                                        "children": [
                                            {
                                                "name": "dc:title",
                                                "show": true
                                            },
                                            {
                                                "name": "dc:creator",
                                                "show": true
                                            },
                                            {
                                                "name": "dc:subject",
                                                "show": true
                                            },
                                            {
                                                "name": "dc:description",
                                                "show": true
                                            },
                                            {
                                                "name": "dc:publisher",
                                                "show": true
                                            },
                                            {
                                                "name": "dc:contributor",
                                                "show": true
                                            },
                                            {
                                                "name": "dc:date",
                                                "show": true
                                            },
                                            {
                                                "name": "dc:type",
                                                "show": true
                                            },
                                            {
                                                "name": "dc:format",
                                                "show": true
                                            },
                                            {
                                                "name": "dc:identifier",
                                                "show": true
                                            },
                                            {
                                                "name": "dc:source",
                                                "show": true
                                            },
                                            {
                                                "name": "dc:language",
                                                "show": true
                                            },
                                            {
                                                "name": "dc:relation",
                                                "show": true
                                            },
                                            {
                                                "name": "dc:coverage",
                                                "show": true
                                            },
                                            {
                                                "name": "dc:rights",
                                                "show": true
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "about",
                                "show": true
                            }
                        ]
                    }
                ]
            },
            {
                "name": "request",
                "show": true,
                "children": [
                    {
                        "name": "@verb",
                        "show": true
                    },
                    {
                        "name": "@identifier",
                        "show": true
                    },
                    {
                        "name": "@metadataPrefix",
                        "show": true
                    },
                    {
                        "name": "@from",
                        "show": true
                    },
                    {
                        "name": "@until",
                        "show": true
                    },
                    {
                        "name": "@set",
                        "show": true
                    },
                    {
                        "name": "@resumptionToken",
                        "show": true
                    }
                ]
            },
            {
                "name": "responseDate",
                "show": true
            }
        ]
    })
    .value('mockSchemaPostParsedJson', {
        "name": "marcxml_test_record.xml",
        "resourceId": "4",
        "configId": "3",
        "schema": {
            "name": "MARC21slim.xsd",
            "show": true,
            "children": [
                {
                    "name": "record",
                    "show": true,
                    "children": [
                        {
                            "name": "leader",
                            "show": true,
                            "$$hashKey": "00L"
                        },
                        {
                            "name": "controlfield",
                            "show": true,
                            "children": [
                                {
                                    "name": "controlfield",
                                    "show": true,
                                    "$$hashKey": "018"
                                }
                            ],
                            "hasChildren": true,
                            "$$hashKey": "00M"
                        },
                        {
                            "name": "datafield",
                            "show": true,
                            "children": [
                                {
                                    "name": "datafield",
                                    "show": true,
                                    "children": [
                                        {
                                            "name": "subfield",
                                            "show": true,
                                            "$$hashKey": "01G"
                                        },
                                        {
                                            "name": "@tag",
                                            "show": true,
                                            "$$hashKey": "01H"
                                        },
                                        {
                                            "name": "@ind1",
                                            "show": true,
                                            "$$hashKey": "01I"
                                        },
                                        {
                                            "name": "@ind2",
                                            "show": true,
                                            "$$hashKey": "01J"
                                        },
                                        {
                                            "name": "@id",
                                            "show": true,
                                            "$$hashKey": "01K"
                                        }
                                    ],
                                    "hasChildren": true,
                                    "$$hashKey": "01D"
                                }
                            ],
                            "hasChildren": true,
                            "$$hashKey": "00N"
                        },
                        {
                            "name": "@type",
                            "show": true,
                            "$$hashKey": "00O"
                        },
                        {
                            "name": "@id",
                            "show": true,
                            "$$hashKey": "00P"
                        }
                    ],
                    "hasChildren": true,
                    "$$hashKey": "00F"
                },
                {
                    "name": "collection",
                    "show": true,
                    "children": [
                        {
                            "name": "record",
                            "show": true,
                            "children": [
                                {
                                    "name": "leader",
                                    "show": true,
                                    "$$hashKey": "01U"
                                },
                                {
                                    "name": "controlfield",
                                    "show": true,
                                    "children": [
                                        {
                                            "name": "controlfield",
                                            "show": true,
                                            "$$hashKey": "02B"
                                        }
                                    ],
                                    "hasChildren": true,
                                    "$$hashKey": "01V"
                                },
                                {
                                    "name": "datafield",
                                    "show": true,
                                    "children": [
                                        {
                                            "name": "datafield",
                                            "show": true,
                                            "children": [
                                                {
                                                    "name": "subfield",
                                                    "show": true,
                                                    "$$hashKey": "034"
                                                },
                                                {
                                                    "name": "@tag",
                                                    "show": true,
                                                    "$$hashKey": "035"
                                                },
                                                {
                                                    "name": "@ind1",
                                                    "show": true,
                                                    "$$hashKey": "036"
                                                },
                                                {
                                                    "name": "@ind2",
                                                    "show": true,
                                                    "$$hashKey": "037"
                                                },
                                                {
                                                    "name": "@id",
                                                    "show": true,
                                                    "$$hashKey": "038"
                                                }
                                            ],
                                            "hasChildren": true,
                                            "$$hashKey": "02D"
                                        }
                                    ],
                                    "hasChildren": true,
                                    "$$hashKey": "01W"
                                },
                                {
                                    "name": "@type",
                                    "show": true,
                                    "$$hashKey": "01X"
                                },
                                {
                                    "name": "@id",
                                    "show": true,
                                    "$$hashKey": "01Y"
                                }
                            ],
                            "hasChildren": true,
                            "$$hashKey": "00V"
                        },
                        {
                            "name": "@id",
                            "show": true,
                            "$$hashKey": "00W"
                        }
                    ],
                    "hasChildren": true,
                    "$$hashKey": "00G"
                }
            ],
            "hasChildren": true
        },
        "collapsed": false,
        "selected": true,
        "$$hashKey": "00C"
    });