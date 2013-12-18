'use strict';

angular.module('mockedSchema', [])
    .value('mockSchemaSimpleJSON', {
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
    })
    .value('mockSchemaJSON', {
        "title": "OAI-PMH",
        "type": "object",
        "required": ["GetRecord"],
        "properties": {
            "GetRecord": {
                "type": "object",
                "properties": {
                    "record": {
                        "type": "object",
                        "properties": {
                            "header": {
                                "type": "object",
                                "properties": {
                                    "identifier": {"type": "string"},
                                    "datestamp": {"type": "string"},
                                    "setSpec": {
                                        "type": "array",
                                        "items": {"type": "string"}
                                    }
                                },
                                "required": ["identifier", "datestamp"]
                            },
                            "metadata": {
                                "type": "object",
                                "properties": {
                                    "oai_dc:dc": {
                                        "type": "object",
                                        "properties": {
                                            "dc:title": {"type": "string"},
                                            "dc:creator": {"type": "string"},
                                            "dc:subject": {"type": "string"},
                                            "dc:description": {"type": "string"},
                                            "dc:publisher": {"type": "string"},
                                            "dc:contributor": {"type": "string"},
                                            "dc:date": {"type": "string"},
                                            "dc:type": {"type": "string"},
                                            "dc:format": {"type": "string"},
                                            "dc:identifier": {"type": "string"},
                                            "dc:source": {"type": "string"},
                                            "dc:language": {"type": "string"},
                                            "dc:relation": {"type": "string"},
                                            "dc:coverage": {"type": "string"},
                                            "dc:rights": {"type": "string"}
                                        }
                                    }
                                }
                            },
                            "about": {"type": "string"}
                        },
                        "required": ["header"]
                    }
                },
                "required": ["record"]
            },
            "request": {
                "type": "object",
                "properties": {
                    "@verb": {
                        "enum": [
                            "Identify",
                            "ListMetadataFormats",
                            "ListSets",
                            "GetRecord",
                            "ListIdentifiers",
                            "ListRecords"
                        ]
                    },
                    "@identifier": {"type": "string"},
                    "@metadataPrefix": {"type": "string"},
                    "@from": {"type": "string"},
                    "@until": {"type": "string"},
                    "@set": {"type": "string"},
                    "@resumptionToken": {"type": "string"}
                }
            },
            "responseDate": {"type": "string"}
        }
    });
