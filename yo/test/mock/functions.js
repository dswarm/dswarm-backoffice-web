'use strict';

angular.module('mockedFunctions', [])
  .value('mockFunctionsJSON',[
        {
            "name": "blacklist",
            "description": "Blacklist filter",
            "id": 1,
            "function_description": {
                "name": "blacklist",
                "dsl": "metafacture",
                "reference": "blacklist",
                "description": "Blacklist filter",
                "parameters": {
                    "entry": {
                        "repeat": true,
                        "type": "repeat",
                        "parameters": {
                            "name": {
                                "type": "text"
                            },
                            "value": {
                                "type": "text",
                                "optional": true
                            }
                        }
                    }
                }
            },
            "parameters": [
                "entry"
            ],
            "type": "Function"
        },
        {
            "name": "case",
            "description": "Upper/lower-case transformation.",
            "id": 2,
            "function_description": {
                "name": "case",
                "dsl": "metafacture",
                "reference": "case",
                "description": "Upper/lower-case transformation.",
                "parameters": {
                    "to": {
                        "type": "radio",
                        "choices": [
                            "upper",
                            "lower"
                        ]
                    },
                    "language": {
                        "type": "text",
                        "optional": true
                    }
                }
            },
            "parameters": [
                "to",
                "language"
            ],
            "type": "Function"
        },
        {
            "name": "compose",
            "description": "Add pre- or postfix to a string.",
            "id": 3,
            "function_description": {
                "name": "compose",
                "dsl": "metafacture",
                "reference": "compose",
                "description": "Add pre- or postfix to a string.",
                "parameters": {
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
                "prefix",
                "postfix"
            ],
            "type": "Function"
        },
        {
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
                        "type": "text",
                        "data": "dfdfsf"
                    }
                }
            },
            "parameters": [
                "value"
            ],
            "type": "Function"
        },
        {
            "name": "count",
            "description": "Returns the an increasing count for each received literal.",
            "id": 5,
            "function_description": {
                "name": "count",
                "dsl": "metafacture",
                "reference": "count",
                "description": "Returns the an increasing count for each received literal."
            },
            "type": "Function"
        },
        {
            "name": "equals",
            "description": "Returns the value only if equality holds.",
            "id": 6,
            "function_description": {
                "name": "equals",
                "dsl": "metafacture",
                "reference": "equals",
                "description": "Returns the value only if equality holds.",
                "parameters": {
                    "string": {
                        "type": "text"
                    }
                }
            },
            "parameters": [
                "string"
            ],
            "type": "Function"
        },
        {
            "name": "htmlanchor",
            "description": "Create an HTML anchor.",
            "id": 7,
            "function_description": {
                "name": "htmlanchor",
                "dsl": "metafacture",
                "reference": "htmlanchor",
                "description": "Create an HTML anchor.",
                "parameters": {
                    "prefix": {
                        "type": "text"
                    },
                    "postfix": {
                        "type": "text",
                        "optional": true
                    },
                    "title": {
                        "type": "text",
                        "optional": true
                    }
                }
            },
            "parameters": [
                "prefix",
                "postfix",
                "title"
            ],
            "type": "Function"
        },
        {
            "name": "isbn",
            "description": "ISBN conversion and verification.",
            "id": 8,
            "function_description": {
                "name": "isbn",
                "dsl": "metafacture",
                "reference": "isbn",
                "description": "ISBN conversion and verification.",
                "parameters": {
                    "to": {
                        "type": "radio",
                        "choices": [
                            "isbn13",
                            "isbn10",
                            "clean"
                        ]
                    },
                    "verifyCheckDigit": {
                        "type": "checkbox",
                        "optional": true
                    }
                }
            },
            "parameters": [
                "to",
                "verifyCheckDigit"
            ],
            "type": "Function"
        },
        {
            "name": "lookup",
            "description": "Performs a table lookup",
            "id": 9,
            "function_description": {
                "name": "lookup",
                "dsl": "metafacture",
                "reference": "lookup",
                "description": "Performs a table lookup",
                "parameters": {
                    "in": {
                        "type": "text",
                        "optional": true,
                        "description": "Unique name of the lookup table"
                    },
                    "default": {
                        "type": "text",
                        "optional": true,
                        "description": "Value used if no corresponding key is found."
                    },
                    "entry": {
                        "repeat": true,
                        "type": "repeat",
                        "parameters": {
                            "name": {
                                "type": "text"
                            },
                            "value": {
                                "type": "text",
                                "optional": true
                            }
                        }
                    }
                }
            },
            "parameters": [
                "in",
                "default",
                "entry"
            ],
            "type": "Function"
        },
        {
            "name": "normalize-utf8",
            "id": 10,
            "function_description": {
                "name": "normalize-utf8",
                "dsl": "metafacture",
                "reference": "normalize-utf8"
            },
            "type": "Function"
        },
        {
            "name": "not-equals",
            "description": "Returns value only if equality does not hold.",
            "id": 11,
            "function_description": {
                "name": "not-equals",
                "dsl": "metafacture",
                "reference": "not-equals",
                "description": "Returns value only if equality does not hold.",
                "parameters": {
                    "string": {
                        "type": "text"
                    }
                }
            },
            "parameters": [
                "string"
            ],
            "type": "Function"
        },
        {
            "name": "occurrence",
            "description": "Filter by number of occurrence.",
            "id": 12,
            "parameters": [
                "only",
                "sameEntity"
            ],
            "type": "Function"
        },
        {
            "name": "regexp",
            "description": "Extract data based on a regular expression. Syntax corresponds to Java Regular Expressions.",
            "id": 13,
            "function_description": {
                "name": "regexp",
                "dsl": "metafacture",
                "reference": "regexp",
                "description": "Extract data based on a regular expression. Syntax corresponds to Java Regular Expressions.",
                "parameters": {
                    "match": {
                        "type": "text"
                    },
                    "format": {
                        "type": "text",
                        "optional": true
                    }
                }
            },
            "parameters": [
                "match",
                "format"
            ],
            "type": "Function"
        },
        {
            "name": "replace",
            "description": "String replace based on a regular expression. Pattern syntax corresponds to Java Regular Expressions.",
            "id": 14,
            "function_description": {
                "name": "replace",
                "dsl": "metafacture",
                "reference": "replace",
                "description": "String replace based on a regular expression. Pattern syntax corresponds to Java Regular Expressions.",
                "parameters": {
                    "pattern": {
                        "type": "regexp"
                    },
                    "with": {
                        "type": "text",
                        "description": "The replacement"
                    }
                }
            },
            "parameters": [
                "pattern",
                "with"
            ],
            "type": "Function"
        },
        {
            "name": "setreplace",
            "description": "Relace strings based on a replacement table.",
            "id": 15,
            "function_description": {
                "name": "setreplace",
                "dsl": "metafacture",
                "reference": "setreplace",
                "description": "Relace strings based on a replacement table.",
                "parameters": {
                    "map": {
                        "type": "text",
                        "optional": true,
                        "description": "Unique name of the replacement table."
                    },
                    "entry": {
                        "repeat": true,
                        "type": "repeat",
                        "parameters": {
                            "name": {
                                "type": "text"
                            },
                            "value": {
                                "type": "text",
                                "optional": true
                            }
                        }
                    }
                }
            },
            "parameters": [
                "map",
                "entry"
            ],
            "type": "Function"
        },
        {
            "name": "split",
            "description": "Split string based on a regular expression. Pattern syntax corresponds to Java Regular Expressions.",
            "id": 16,
            "function_description": {
                "name": "split",
                "dsl": "metafacture",
                "reference": "split",
                "description": "Split string based on a regular expression. Pattern syntax corresponds to Java Regular Expressions.",
                "parameters": {
                    "delimiter": {
                        "type": "text",
                        "description": "Regular expression, defining the split"
                    }
                }
            },
            "parameters": [
                "delimiter"
            ],
            "type": "Function"
        },
        {
            "name": "substring",
            "description": "Returns a substring",
            "id": 17,
            "function_description": {
                "name": "substring",
                "dsl": "metafacture",
                "reference": "substring",
                "description": "Returns a substring",
                "parameters": {
                    "start": {
                        "type": "number",
                        "optional": true
                    },
                    "end": {
                        "type": "number",
                        "optional": true
                    }
                }
            },
            "parameters": [
                "start",
                "end"
            ],
            "type": "Function"
        },
        {
            "name": "switch-name-value",
            "description": "Switches name and value.",
            "id": 18,
            "function_description": {
                "name": "switch-name-value",
                "dsl": "metafacture",
                "reference": "switch-name-value",
                "description": "Switches name and value."
            },
            "type": "Function"
        },
        {
            "name": "trim",
            "description": "Trimms the value",
            "id": 19,
            "function_description": {
                "name": "trim",
                "dsl": "metafacture",
                "reference": "trim",
                "description": "Trimms the value"
            },
            "type": "Function"
        },
        {
            "name": "unique",
            "description": "Filters out dublicate literals",
            "id": 20,
            "function_description": {
                "name": "unique",
                "dsl": "metafacture",
                "reference": "unique",
                "description": "Filters out dublicate literals",
                "parameters": {
                    "in": {
                        "type": "select",
                        "choices": [
                            "record",
                            "entity"
                        ],
                        "optional": true,
                        "description": "Scope of 'sameness' (experimental)"
                    },
                    "part": {
                        "type": "select",
                        "choices": [
                            "value",
                            "name",
                            "name-value"
                        ],
                        "optional": true,
                        "description": "Part of the literal is tested for equality"
                    }
                }
            },
            "parameters": [
                "in",
                "part"
            ],
            "type": "Function"
        },
        {
            "name": "urlencode",
            "description": "Escapes value according to URL encoding rules.",
            "id": 21,
            "function_description": {
                "name": "urlencode",
                "dsl": "metafacture",
                "reference": "urlencode",
                "description": "Escapes value according to URL encoding rules."
            },
            "type": "Function"
        },
        {
            "name": "whitelist",
            "description": "Whitelist filter.",
            "id": 22,
            "function_description": {
                "name": "whitelist",
                "dsl": "metafacture",
                "reference": "whitelist",
                "description": "Whitelist filter.",
                "parameters": {
                    "map": {
                        "type": "text",
                        "optional": true,
                        "description": "Unique name of the replacement table."
                    },
                    "entry": {
                        "repeat": true,
                        "type": "repeat",
                        "parameters": {
                            "name": {
                                "type": "text"
                            },
                            "value": {
                                "type": "text",
                                "optional": true
                            }
                        }
                    }
                }
            },
            "parameters": [
                "map",
                "entry"
            ],
            "type": "Function"
        },
        {
            "name": "transformation",
            "description": "transformation",
            "id": 23,
            "parameters": [
                "transformationInputString"
            ],
            "type": "Transformation",
            "components": []
        },
        {
            "name": "transformation",
            "description": "transformation",
            "id": 24,
            "parameters": [
                "transformationInputString"
            ],
            "type": "Transformation",
            "components": [
                {
                    "name": "case",
                    "description": "Upper/lower-case transformation.",
                    "function": {
                        "type": "Function",
                        "name": "case",
                        "description": "Upper/lower-case transformation.",
                        "id": 2,
                        "function_description": {
                            "name": "case",
                            "dsl": "metafacture",
                            "reference": "case",
                            "description": "Upper/lower-case transformation.",
                            "parameters": {
                                "to": {
                                    "type": "radio",
                                    "choices": [
                                        "upper",
                                        "lower"
                                    ]
                                },
                                "language": {
                                    "type": "text",
                                    "optional": true
                                }
                            }
                        },
                        "parameters": [
                            "to",
                            "language"
                        ]
                    },
                    "id": 9,
                    "input_components": null,
                    "output_components": null
                }
            ]
        },
        {
            "name": "transformation",
            "description": "transformation",
            "id": 25,
            "parameters": [
                "transformationInputString"
            ],
            "type": "Transformation",
            "components": [
                {
                    "name": "equals",
                    "description": "Returns the value only if equality holds.",
                    "function": {
                        "type": "Function",
                        "name": "equals",
                        "description": "Returns the value only if equality holds.",
                        "id": 6,
                        "function_description": {
                            "name": "equals",
                            "dsl": "metafacture",
                            "reference": "equals",
                            "description": "Returns the value only if equality holds.",
                            "parameters": {
                                "string": {
                                    "type": "text"
                                }
                            }
                        },
                        "parameters": [
                            "string"
                        ]
                    },
                    "id": 11,
                    "input_components": null,
                    "output_components": null
                }
            ]
        },
        {
            "name": "transformation",
            "description": "transformation",
            "id": 26,
            "parameters": [
                "transformationInputString"
            ],
            "type": "Transformation",
            "components": []
        },
        {
            "name": "transformation",
            "description": "transformation",
            "id": 27,
            "parameters": [
                "transformationInputString"
            ],
            "type": "Transformation",
            "components": [
                {
                    "name": "equals",
                    "description": "Returns the value only if equality holds.",
                    "function": {
                        "type": "Function",
                        "name": "equals",
                        "description": "Returns the value only if equality holds.",
                        "id": 6,
                        "function_description": {
                            "name": "equals",
                            "dsl": "metafacture",
                            "reference": "equals",
                            "description": "Returns the value only if equality holds.",
                            "parameters": {
                                "string": {
                                    "type": "text"
                                }
                            }
                        },
                        "parameters": [
                            "string"
                        ]
                    },
                    "id": 36,
                    "input_components": null,
                    "output_components": null
                }
            ]
        },
        {
            "name": "transformation",
            "description": "transformation",
            "id": 28,
            "parameters": [
                "transformationInputString"
            ],
            "type": "Transformation",
            "components": [
                {
                    "name": "constant",
                    "description": "Sets literal value to a constant.",
                    "function": {
                        "type": "Function",
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
                                    "type": "text",
                                    "data": "dfdfsf"
                                }
                            }
                        },
                        "parameters": [
                            "value"
                        ]
                    },
                    "id": 39,
                    "input_components": null,
                    "output_components": null
                }
            ]
        }
    ]
);
