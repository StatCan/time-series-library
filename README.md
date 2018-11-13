# vector-lib

A JavaScript library for arithmetic on Statistics Canada time series 
vector data.

# Installation

Using Node.js:
```javascript
let VectorLib = require('./vector_lib.js');
let vlib = new VectorLib();
```

Using a web browser:
```html
<script src="./vector_lib.js"></script>

<script>
    let vlib = new VectorLib();
</script>
```

# Usage

[evaluate()](#evaluate)  
[equals()](#equals)  
[interoperable()](#interoperable)  
[intersection()](#intersection)

<a name="evaluate"></a>
## evaluate(expression, vectors)

Performs arithmetic on a set of vectors. 

All input vectors must be interoperable with each other, meaning each vector 
must have the same length and all vectors must be composed of datapoints with 
the same reference periods. 

The function **intersection()** can be used to convert a set of 
non-interoperable vectors into a set of interoperable vectors.

Example:
```javascript
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

let result = vlib.evaluate("(v1 + 2*v2) * v3", vectors);
```

Result:
```javascript
[
    {'refper': "2018-01-01", 'value': 16},
    {'refper': "2018-02-01", 'value': 24}
]
```

<a name="equals"></a>
## equals(vectorA, vectorB)

Checks if two vectors are equal.

Two vectors `a` and `b` are equal if the number of datapoints in `a` is equal 
to the number of datapoints in `b`, and for each datapoint with reference 
period `Ra` and value `Va` in `a`, there exists a datapoint in `b` whose 
reference period is equal to `Ra` and value is equal to `Va` 

Example:
```javascript
let v1 = [
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2}
];
let v2 = [
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2}
];

let result = vlib.equals(v1, v2);
```

Result:
```javascript
true
```

<a name="interoperable"></a>
## interoperable(vectorA, vectorB)

Checks if two vectors are interoperable.

Two vectors `a` and `b` are interoperable if the number of datapoints in `a` 
is equal to the number of datapoints in `b`, and for each datapoint with 
reference period `Ra` in `a`, there exists a datapoint in `b` whose 
reference period is equal to `Ra`.

Example:
```javascript
let v1 = [
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2}
];
let v2 = [
    {'refper': "2018-01-01", 'value': 3},
    {'refper': "2018-02-01", 'value': 4}
];

let result = vlib.interoperable(v1, v2);
```

Result:
```javascript
true
```

<a name="intersection"></a>
## intersection(vectors)

Returns the intersection of all vectors in a set. That is, for each vector `v` 
in the input set, `v` is transformed to `v` intersected with every other vector 
in the input set.

The intersection of two vectors `a` and `b` is defined as the vectors `a'` and 
`b'` such that `a'` and `b'` are composed only of datapoints with reference 
periods defined in both `a` and `b`.

Note that this function will also accept a dictionary mapping vector IDs to 
vectors as input. The return type will be a dictionary instead of an array in 
this case.

Example:
```javascript
let v1 = [
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2},
    {'refper': "2018-03-01", 'value': 3},
    {'refper': "2018-04-01", 'value': 4}
];
let v2 = [
    {'refper': "2018-01-01", 'value': 5},
    {'refper': "2018-02-01", 'value': 6},
    {'refper': "2018-03-01", 'value': 7}
];
let v3 = [
    {'refper': "2018-01-01", 'value': 8},
    {'refper': "2018-02-01", 'value': 9}
];

// Can also be called as vlib.intersection({'v1': v1, 'v2': v2, 'v3': v3}).
let result = vlib.intersection([v1, v2, v3]);
```

Result:
```javascript
[
    [
        {'refper': "2018-01-01", 'value': 1},
        {'refper': "2018-02-01", 'value': 2}
    ],
    [
        {'refper': "2018-01-01", 'value': 5},
        {'refper': "2018-02-01", 'value': 6},
    ],
    [
        {'refper': "2018-01-01", 'value': 8},
        {'refper': "2018-02-01", 'value': 9}
    ]
]
```

