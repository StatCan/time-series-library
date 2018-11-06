let VectorLib = require('./vector_lib.js');

let vectors = {
    'v1': [
        {'refper': "2018-01-01", 'value': 1},
        {'refper': "2018-02-01", 'value': 2}
    ],
    'v2': [
        {'refper': "2018-01-01", 'value': 3},
        {'refper': "2018-02-01", 'value': 4}
    ],
    'v3': [
        {'refper': "2018-01-01", 'value': 2},
        {'refper': "2018-02-01", 'value': 2}
    ],
    'v4': [
        {'refper': "2018-01-01", 'value': 1},
        {'refper': "2018-02-01", 'value': 2},
        {'refper': "2018-03-01", 'value': 3}
    ],
    'v5': [
        {'refper': "2018-01-01", 'value': 4},
        {'refper': "2018-02-01", 'value': 5},
        {'refper': "2018-03-01", 'value': 6}
    ],
    'v6': [
        {'refper': "2018-01-01", 'value': 7},
        {'refper': "2018-02-01", 'value': 8},
        {'refper': "2018-03-01", 'value': 9}
    ]
};

let testcases = [
    {
        'expression': "(v1 + v2) * (2*v3)",
        'expected': [
            {'refper': "2018-01-01", 'value': 16},
            {'refper': "2018-02-01", 'value': 24}
        ]
    },
    {
        'expression': "(v1 - v2) * (2*v3)",
        'expected': [
            {'refper': "2018-01-01", 'value': -8},
            {'refper': "2018-02-01", 'value': -8}
        ]
    },
    {
        'expression': "v6 - v5 - v4",
        'expected': [
            {'refper': "2018-01-01", 'value': 2},
            {'refper': "2018-02-01", 'value': 1},
            {'refper': "2018-03-01", 'value': 0}
        ]
    }
];

let runTest = function(testcase) {
    let parser = new VectorLib();
    let result = parser.evaluate(testcase.expression, vectors);
    
    console.log(testcase.expression);
    console.log("Result:");
    console.log(result);
    console.log("Expected:");
    console.log(testcase.expected);
    
    if (parser.equals(result, testcase.expected)) {
        console.log("PASS");
        return true;
    }
    else {
        console.log("FAIL");
        return false;
    }
}

let passes = 0;
for (let t = 0; t < testcases.length; t++) {
    if (runTest(testcases[t])) {
        passes++;
        console.log("===================");
    } 
}
console.log(passes + " / " + testcases.length + " tests passed.");