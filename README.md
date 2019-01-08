# vector-lib ![](https://gitlab.k8s.cloud.statcan.ca/bailey.damour/vector-lib/badges/master/build.svg)

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
[copy()](#copy)  
[range()](#range)  
[interoperable()](#interoperable)  
[intersection()](#intersection)  
[annualize()](#annualize)  
[periodTransformation()](#periodTransformation)  
[periodToPeriodPercentageChange()](#periodToPeriodPercentageChange)  
[periodToPeriodDifference()](#periodToPeriodDifference)  
[samePeriodPreviousYearPercentageChange()](#samePeriodPreviousYearPercentageChange)  
[samePeriodPreviousYearDifference()](#samePeriodPreviousYearDifference)  
[round()](#round)  
[roundBankers()](#roundBankers)  
[filter()](#filter)

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

<a name="copy"></a>
## copy(vector)

Creates a copy of a vector.

Example:
```javascript
let vector = [
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2}
];

let result = vlib.copy(vector);
```

Result:
```javascript
[
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2}
]
```

<a name="range"></a>
## range(vector, startDate, endDate)

Returns the vector constrained within a specified range.

Example:
```javascript
    let vector = [
        {'refper': '2018-01-01', 'value': 0},
        {'refper': '2018-02-01', 'value': 1},
        {'refper': '2018-03-01', 'value': 2},
        {'refper': '2018-04-01', 'value': 3}
    ];

let result = vlib.range(vector, '2018-02-01', '2018-03-01');
```

Result:
```javascript
[
    {'refper': "2018-02-01", 'value': 1},
    {'refper': "2018-03-01", 'value': 2}
]
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

<a name="annualize"></a>
## annualize(vector)

Annualizes a vector, returning a vector with the last datapoints for each year.

Example:
```javascript
let vector = [
    {'refper': '2018-06-01', 'value': 0},
    {'refper': '2018-12-01', 'value': 1},
    {'refper': '2019-06-01', 'value': 2},
    {'refper': '2019-12-01', 'value': 3},
    {'refper': '2020-06-01', 'value': 4},
    {'refper': '2020-12-01', 'value': 5}
];

let result = vlib.annualize(vector);
```

Result:
```javascript
[
    {'refper': '2018-12-01', 'value': 1},
    {'refper': '2019-12-01', 'value': 3},
    {'refper': '2020-12-01', 'value': 5}
]
```

<a name="periodTransformation"></a>
## periodTransformation(vector, function)

Applies a transformation function to the value of each datapoint in a vector. 
**function** is a function that has a `Number` parameter and returns a `Number`.

Example:
```javascript
 let vector = [
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-01-02', 'value': 2},
];
let result = vlib.periodTransformation(vector, value => value * 2);
```

Result:
```javascript
[
    {'refper': '2018-12-01', 'value': 2},
    {'refper': '2019-12-01', 'value': 4}
]
```

<a name="periodToPeriodPercentageChange"></a>
## periodToPeriodPercentageChange(vector)

Returns a period-to-period percentage change vector of the input vector.

Example:
```javascript
let vector = [
    {'refper': '2018-01-01', 'value': 2},
    {'refper': '2018-02-01', 'value': 6},
    {'refper': '2018-03-01', 'value': 3}
];

let result = vlib.periodToPeriodPercentageChange(vector);
```

Result:
```javascript
[
    {'refper': "2018-01-01", 'value': null},
    {'refper': "2018-02-01", 'value': 200.0},
    {'refper': "2018-03-01", 'value': -50.0}
]
```

<a name="periodToPeriodDifference"></a>
## periodToPeriodDifference(vector)

Returns a period-to-period difference vector of the input vector.

Example:
```javascript
let vector = [
    {'refper': '2018-01-01', 'value': 2},
    {'refper': '2018-02-01', 'value': 6},
    {'refper': '2018-03-01', 'value': 3}
];

let result = vlib.periodToPeriodDifference(vector);
```

Result:
```javascript
[
    {'refper': "2018-01-01", 'value': null},
    {'refper': "2018-02-01", 'value': 4},
    {'refper': "2018-03-01", 'value': -3}
]
```

<a name="samePeriodPreviousYearPercentageChange"></a>
## samePeriodPreviousYearPercentageChange(vector)

Annualizes and returns a period-to-period percent change vector of the input 
vector.

Example:
```javascript
let vector = [
    {'refper': '2018-06-01', 'value': 0},
    {'refper': '2018-12-01', 'value': 2},
    {'refper': '2019-06-01', 'value': 0},
    {'refper': '2019-12-01', 'value': 6},
    {'refper': '2020-06-01', 'value': 0},
    {'refper': '2020-12-01', 'value': 3}
];

let result = vlib.samePeriodPreviousYearPercentageChange(vector);
```

Result:
```javascript
[
    {'refper': "2018-12-01", 'value': null},
    {'refper': "2019-12-01", 'value': 200.0},
    {'refper': "2020-12-01", 'value': -50.0}
]
```

<a name="samePeriodPreviousYearDifference"></a>
## samePeriodPreviousYearDifference(vector)

Annualizes and returns a period-to-period difference vector of the input 
vector.

Example:
```javascript
let vector = [
    {'refper': '2018-06-01', 'value': 0},
    {'refper': '2018-12-01', 'value': 2},
    {'refper': '2019-06-01', 'value': 0},
    {'refper': '2019-12-01', 'value': 6},
    {'refper': '2020-06-01', 'value': 0},
    {'refper': '2020-12-01', 'value': 4}
];

let result = vlib.samePeriodPreviousYearDifference(vector);
```

Result:
```javascript
[
    {'refper': "2018-01-01", 'value': null},
    {'refper': "2018-02-01", 'value': 4},
    {'refper': "2018-03-01", 'value': -3}
]
```

<a name="round"></a>
## round(vector, decimals)

Rounds all values in the input vector to a specified number of decimal places. 
If `decimals` is not specified than the default value of `0` will be used.  

Example:
```javascript
let vector = [
    {'refper': '2018-01-01', 'value': 1.555},
    {'refper': '2018-02-01', 'value': 1.554}
];

let result = vlib.round(vector, 2);
```

Result:
```javascript
[
    {'refper': "2018-01-01", 'value': 1.56},
    {'refper': "2018-02-01", 'value': 1.55}
]
```

<a name="roundBankers"></a>
## roundBankers(vector, decimals)

Rounds all values in the input vector to a specified number of decimal places 
using the [Banker's rounding algorithm](http://wiki.c2.com/?BankersRounding). 
If `decimals` is not specified then the default value of `0` will be used.  

Example:
```javascript
let vector = [
    {'refper': '2018-01-01', 'value': 1.5},
    {'refper': '2018-02-01', 'value': 2.5}
];

let result = vlib.round(vector, 0);
```

Result:
```javascript
[
    {'refper': "2018-01-01", 'value': 2},
    {'refper': "2018-02-01", 'value': 2}
]
```

<a name="filter"></a>
## filter(vector, predicate)

Returns a filtered vector based on a predicate function. The function 
`predicate` should be a function that operates on a vector point and returns a `boolean`.   

Example:
```javascript
let vector = [
    {'refper': '2018-01-01', 'value': 0},
    {'refper': '2018-01-02', 'value': 1},
    {'refper': '2018-01-03', 'value': 2},
];

result = vlib.filter(vector, p => p.value % 2 == 0);
```

Result:
```javascript
[
    {'refper': '2018-01-01', 'value': 0},
    {'refper': '2018-01-03', 'value': 2}
]
```

