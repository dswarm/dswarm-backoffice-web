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
    }
);