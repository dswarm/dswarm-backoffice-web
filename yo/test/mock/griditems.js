'use strict';

angular.module('mockedGriditems', [])
    .value('mockedGriditemsJSON', [
        {
            "positionX": 0,
            "positionY": 0,
            "component": {
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
                "output_components": [
                    {
                        "id": -1402501641255
                    }
                ],
                "input_components": [],
                "description": "{\"x\":\"status\",\"y\":0}",
                "parameter_mappings": {
                    "value": "foo",
                    "inputString": "status"
                }
            },
            "name": "component1402495666169",
            "id": -1402495665792,
            "$$hashKey": "0WA"
        },
        {
            "positionX": 0,
            "positionY": 1,
            "component": {
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
                            "delimiter": {
                                "type": "text"
                            },
                            "prefix": {
                                "type": "text",
                                "optional": true
                            },
                            "postfix": {
                                "type": "text",
                                "optional": true
                            }
                        }
                    },
                    "parameters": [
                        "delimiter",
                        "prefix",
                        "postfix"
                    ],
                    "type": "Function"
                },
                "name": "component1402501641359",
                "id": -1402501641255,
                "output_components": [],
                "input_components": [
                    {
                        "id": -1402495665792
                    }
                ],
                "description": "{\"x\":\"status\",\"y\":1}",
                "parameter_mappings": {
                    "inputString": "component1402495666169"
                }
            },
            "name": "component1402501641359",
            "id": -1402501641255,
            "$$hashKey": "0WB"
        }
    ]
);