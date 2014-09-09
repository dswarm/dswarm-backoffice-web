'use strict';

angular.module('mockedConfiguration', [])
    .value('mockConfigurationComponentInternalJSON', {
        name: 'constant',
        description: 'Sets literal value to a constant.',
        id: 4,
        function_description: {
            name: 'constant',
            dsl: 'metafacture',
            reference: 'constant',
            description: 'Sets literal value to a constant.',
            parameters: {

            }
        },
        parameters: [
            {
                type: 'text',
                data: 'foo',
                key: 'value'
            }
        ],
        type: 'Function'
    })
    .value('mockConfigurationComponentBrokenJSON', {
        "function": {
            "name": "constant",
            "description": "Sets literal value to a constant.",
            "id": 4,
            "function_description": {
                "name": "constant",
                "dsl": "metafacture",
                "reference": "constant",
                "description": "Sets literal value to a constant.",
                "parameters": {
                    "value": {
                        "type": "text"
                    }
                }
            },
            "parameters": [
                "value"
            ],
            "type": "Function"
        },
        "name": "component1402495666169",
        "id": null,
        "output_components": [],
        "input_components": [],
        "description": "{\"x\":\"status\",\"y\":0}",
        "parameter_mappings": {
            "value": "foo",
            "inputString": "status"
        }
    })
    .value('mockConfigurationComponentJSON', {
        "function": {
            "name": "constant",
            "description": "Sets literal value to a constant.",
            "id": 4,
            "function_description": {
                "name": "constant",
                "dsl": "metafacture",
                "reference": "constant",
                "description": "Sets literal value to a constant.",
                "parameters": {
                    "value": {
                        "type": "text"
                    }
                }
            },
            "parameters": [
                "value"
            ],
            "type": "Function"
        },
        "name": "component1402495666169",
        "id": -1402495665792,
        "output_components": [],
        "input_components": [],
        "description": "{\"x\":\"status\",\"y\":0}",
        "parameter_mappings": {
            "value": "foo",
            "inputString": "status"
        }
    })
    .value("mockConfigurationMulti1JSON", {
        "function": {
            "name": "concat",
            "description": "Collects all received values and concatenates them on record end.",
            "id": 23,
            "function_description": {
                "name": "concat",
                "dsl": "metafacture",
                "reference": "concat",
                "description": "Collects all received values and concatenates them on record end.",
                "parameters": {}
            },
            "parameters": [
                {
                    "type": "text",
                    "data": ",",
                    "key": "delimiter",
                    "$$hashKey": "0HG"
                },
                {
                    "type": "text",
                    "optional": true,
                    "key": "prefix",
                    "$$hashKey": "0HH"
                },
                {
                    "type": "text",
                    "optional": true,
                    "key": "postfix",
                    "$$hashKey": "0HI"
                }
            ],
            "type": "Function"
        },
        "name": "component1410197625118",
        "id": -1410197625240,
        "output_components": [],
        "input_components": [],
        "description": "{\"x\":\"dataset__-1410185900851\",\"y\":0}",
        "parameter_mappings": {
            "delimiter": ",",
            "inputString": "dataset__-1410185900851"
        }
    })
    .value("mockConfigurationMulti2JSON", {
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
                    "inputStringSorting": {
                        "type": "sortable",
                        "data": [
                            {
                                "text": "dataset",
                                "id": "dataset__-1410185900851",
                                "$$hashKey": "0IJ"
                            },
                            {
                                "text": "definition",
                                "id": "definition__-1410185903886",
                                "$$hashKey": "0IK"
                            }
                        ],
                        "key": "inputStringSorting",
                        "$$hashKey": "0IA"
                    }
                }
            },
            "parameters": [
                {
                    "type": "text",
                    "data": ",",
                    "key": "delimiter",
                    "$$hashKey": "0I7"
                },
                {
                    "type": "text",
                    "optional": true,
                    "key": "prefix",
                    "$$hashKey": "0I8"
                },
                {
                    "type": "text",
                    "optional": true,
                    "key": "postfix",
                    "$$hashKey": "0I9"
                },
                {
                    "type": "sortable",
                    "data": [
                        {
                            "text": "dataset",
                            "id": "dataset__-1410185900851",
                            "$$hashKey": "0IJ"
                        },
                        {
                            "text": "definition",
                            "id": "definition__-1410185903886",
                            "$$hashKey": "0IK"
                        }
                    ],
                    "key": "inputStringSorting",
                    "$$hashKey": "0IA"
                }
            ],
            "type": "Function"
        },
        "name": "component1410197625118",
        "id": -1410197625240,
        "output_components": [],
        "input_components": [],
        "description": "{\"x\":\"dataset__-1410185900851\",\"y\":0}",
        "parameter_mappings": {
            "delimiter": ",",
            "inputString": "dataset__-1410185900851,definition__-1410185903886"
        }
    });