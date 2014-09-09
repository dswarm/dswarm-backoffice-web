'use strict';

describe('Directive: SchemaList', function () {
    var $rootScope, $compile, $httpBackend;
    var element1, element2, scope1, scope2, files1, files2, files3;
    var elementHtml1 = '<schemalist from="resources" items="items"></schemalist>';
    var elementHtml2 = '<schemalist from="otherThing" items="items"></schemalist>';

    beforeEach(module('dmpApp', 'mockedDataModel'));

    beforeEach(module(function($provide) {
        $provide.value('ApiEndpoint', 'dmp/');
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_, $templateCache, $injector) {

        $templateCache.put('views/directives/schema-list.html', '<div></div>');

        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;

        files1 =         {
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
        };

        files2 = {
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
        };
        files3 = {
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
        };

        $httpBackend.whenGET('dmp/datamodels').respond($injector.get('mockDataModelsJSON'));

        scope1 = $rootScope.$new();
        scope1.items = [];

        scope2 = $rootScope.$new();
        scope2.items = [];

        var _element;

        _element = angular.element(elementHtml1);
        element1 = $compile(_element)(scope1);

        _element = angular.element(elementHtml2);
        element2 = $compile(_element)(scope2);
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });

    it('create the SchemaListCtrl from resources', function() {

        scope1.$digest();
        $httpBackend.flush();
        var elScope = angular.element(element1.children()[0]).scope();

        expect(elScope.files.length).toBe(3);

        expect(angular.equals(elScope.files[0].schema.attribute_paths.length, files1.schema.attribute_paths.length)).toBe(true);

        expect(elScope.schemaListOptions).toEqual({
            data: 'files',
            columnDefs: [
                {field:'_$name', displayName:'Name'},
                {field:'_$description', displayName:'Description '}
            ],
            enableColumnResize: false,
            selectedItems: [],
            multiSelect: false
        });
    });


    it('create the SchemaListCtrl from schemas', function() {

        scope2.$digest();
        $httpBackend.flush();
        var elScope = angular.element(element2.children()[0]).scope();

        expect(elScope.files.length).toBe(3);

        expect(elScope.schemaListOptions).toEqual({
            data: 'files',
            columnDefs: [
                {field:'_$name', displayName:'Name'},
                {field:'_$description', displayName:'Description '}
            ],
            enableColumnResize: false,
            selectedItems: [],
            multiSelect: false
        });
    });
});
