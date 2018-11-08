# vector-lib

A JavaScript library for vector arithmetic.

# Usage

To perform arithmetic on a set of vectors:  
```
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
    ]
};

let result = VectorLib.evaluate("(v1 + 2*v2) * v3", vectors);
// Returns new vector.
```

To check if two vectors are equal:
```
let v1 = [
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2}
];
let v2 = [
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2}
];

let result = VectorLib.equals(v1, v2); // Returns true.
```

To get the intersection set of a set of vectors:
```
let v1 = [
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2},
    {'refper': "2018-03-01", 'value': 3}
];
let v2 = [
    {'refper': "2018-01-01", 'value': 3},
    {'refper': "2018-02-01", 'value': 4}
];
let v3 = [
    {'refper': "2018-01-01", 'value': 2}
];

let result = VectorLib.intersection([v1, v2, v3]);
// Returns list of vectors with reference period intersection applied.
```

