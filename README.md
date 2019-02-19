# time-series-library ![](https://gitlab.k8s.cloud.statcan.ca/bailey.damour/vector-lib/badges/master/build.svg)

A JavaScript library for arithmetic on Statistics Canada time series 
vector data.

This library can be used with Node.js or any of the following web browsers:
- Chrome
- Firefox
- Internet Explorer 11
- Opera
- Safari

# Installation

Using Node.js:
```javascript
const Vector = require('./vector_lib.js').Vector;
const VectorLib = require('./vector_lib.js').VectorLib;
```

Using a web browser:
```html
<script src="./vector_lib.js"></script>

<script>
    var Vector = vector_lib.Vector;
    var VectorLib = vector_lib.VectorLib;
</script>
```

# Usage

**Vector:**  
[get(index)](#Vector.get)  
[refper(index), refperStr(index)](#Vector.refper)  
[value(index)](#Vector.value)  
[length](#Vector.length)  
[push(datapoint)](#Vector.push)  
[equals(other)](#Vector.equals)  
[copy()](#Vector.copy)  
[filter(predicate)](#Vector.filter)  
[range(startDate, endDate)](#Vector.range)  
[latestN(n)](#Vector.latestN)  
[interoperable(other)](#Vector.interoperable)  
[intersection(other)](#Vector.intersection)  
[sum()](#Vector.sum)  
[average()](#Vector.average)  
[reduce()](#Vector.reduce)  
[operate(operation)](#Vector.operate)  
[periodTransformation(transformation)](#Vector.periodTransformation)  
[periodToPeriodPercentageChange(transformation)](#Vector.periodToPeriodPercentageChange)  
[periodToPeriodDifference()](#Vector.periodToPeriodDifference)  
[samePeriodPreviousYearPercentageChange()](#Vector.samePeriodPreviousYearPercentageChange)  
[samePeriodPreviousYearDifference()](#Vector.samePeriodPreviousYearDifference)  
[annual()](#Vector.annual)  
[monthly()](#Vector.monthly)  
[round(decimals)](#Vector.round)  
[roundBankers(decimals)](#Vector.roundBankers)  

**VectorLib:**  
[evaluate(expression, vectors)](#VectorLib.evaluate)  

## Vector

To create a new vector:
```javascript
let vector = new Vector();
```

Vectors can also be initialized with data:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2},
    {'refper': "2018-03-01", 'value': 3}
]);
```

The value of **refper** may be a **yyyy-mm-dd** formatted date string or a 
**Date** object.

Datapoints may also have additional fields to hold any related metadata. These 
fields will be conserved when operating on vectors.
```js
let vector = let vector = new Vector([
    {'refper': "2018-01-01", 'value': 1, 'myKey': 'my value'},
    {'refper': "2018-02-01", 'value': 2, 'myKey': 'my value'},
]); 
```

<a name="Vector.get"></a>
### get(index)

Returns the datapoint of a vector at a specific index.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2},
    {'refper': "2018-03-01", 'value': 3}
]);

let result = vector.get(1);
```

Result:
```javascript
{'refper': "2018-02-01", 'value': 2}
```

<a name="Vector.refper"></a>
### refper(index), refperStr(index)

Gets the refeperence period of a datapoint at a specific index. 

The function **refper** returns a data object and the function **refperStr** 
returns a **yyyy-mm-dd** formatted date string. 

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2},
    {'refper': "2018-03-01", 'value': 3}
]);

let result = vector.refperStr(1);
```

Result:
```javascript
"2018-02-01"
```

<a name="Vector.value"></a>
### value(index)

Return the value of a datapoint at a specific index.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2},
    {'refper': "2018-03-01", 'value': 3}
]);

let result = vector.value(1);
```

Result:
```javascript
2
```

<a name="Vector.length"></a>
### length

Gets the length of a vector.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2}
]);

let result = vector.length;
```

Result:
```javascript
2
```

<a name="Vector.push"></a>
### push(datapoint)

Appends a datapoint to a vector.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", 'value': 1}
]);

vector.push({'refper': "2018-02-01", 'value': 2});
```

Result:
```javascript
[
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2}
]
```

<a name="Vector.equals"></a>
### equals(other)

Checks if two vectors are equal.

Two vectors **a** and **b** are equal if the number of datapoints in **a** is 
equal to the number of datapoints in **b**, and for each datapoint with 
reference period **Ra** and value **Va** in **a**, there exists a datapoint in 
**b** whose reference period is equal to **Ra** and value is equal to **Va**. 

Example:
```javascript
let v1 = new Vector([
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2}
]);
let v2 = new Vector([
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2}
]);

let result = v1.equals(v2);
```

Result:
```javascript
true
```

<a name="Vector.copy"></a>
### copy()

Returns a new **Vector** object that is a copy of the calling **Vector**.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2}
]);

let result = vector.copy();
```

Result:
```javascript
[
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2}
]
```

<a name="Vector.filter"></a>
### filter(predicate)

Returns a filtered vector based on a predicate function. The function 
**predicate** should be a function that operates on a datapoint and returns 
a **boolean**.   

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", 'value': 0},
    {'refper': "2018-01-02", 'value': 1},
    {'refper': "2018-01-03", 'value': 2},
]);

let result = vector.filter(p => p.value % 2 == 0);
```

Result:
```javascript
[
    {'refper': "2018-01-01", 'value': 0},
    {'refper': "2018-01-03", 'value': 2}
]
```

<a name="Vector.range"></a>
### range(startDate, endDate)

Returns the vector constrained within a specified range. The parameters 
**startDate** and **endDate** may be either date strings or date objects.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", 'value': 0},
    {'refper': "2018-02-01", 'value': 1},
    {'refper': "2018-03-01", 'value': 2},
    {'refper': "2018-04-01", 'value': 3}
]);

let result = vlib.range("2018-02-01", "2018-03-01");
```

Result:
```javascript
[
    {'refper': "2018-02-01", 'value': 1},
    {'refper': "2018-03-01", 'value': 2}
]
```

<a name="Vector.range"></a>
### latestN

Returns a new vector containing only the last n reference periods of the 
calling vector.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", 'value': 0},
    {'refper': "2018-02-01", 'value': 1},
    {'refper': "2018-03-01", 'value': 2},
    {'refper': "2018-04-01", 'value': 3}
]);

let result = vlib.latestN(2);
```

Result:
```javascript
[
    {'refper': "2018-03-01", 'value': 2},
    {'refper': "2018-04-01", 'value': 3}
]
```

<a name="Vector.interoperable"></a>
### interoperable(other)

Checks if two vectors are interoperable.

Two vectors **a** and **b** are interoperable if the number of datapoints in 
**a** is equal to the number of datapoints in **b**, and for each datapoint with 
reference period **Ra** in **a**, there exists a datapoint in **b** whose 
reference period is equal to **Ra**.

Example:
```javascript
let v1 = new Vector([
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2}
]);
let v2 = new Vector([
    {'refper': "2018-01-01", 'value': 3},
    {'refper': "2018-02-01", 'value': 4}
]);

let result = v1.interoperable(v2);
```

Result:
```javascript
true
```

<a name="Vector.intersection"></a>
### intersection(other)

Returns the result of the intersction of the calling vector with another. 

The result of vectors **a** intersected with **b** is defined as the vector 
**a'** and such that **a'** is composed only of datapoints with reference 
periods defined in both **a** and **b**.

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
    {'refper': "2018-03-01", 'value': 6}
];

let result = v1.intersection(v2);
```

Result:
```javascript
[
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-03-01", 'value': 3}
]
```

<a name="Vector.sum"></a>
### sum()

Returns the sum of all values in a vector.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", value: 1},
    {'refper': "2018-02-01", value: 2},
    {'refper': "2018-03-01", value: 3},
]);

let result = vector.sum();
```

Result:
```javascript
6
```

<a name=Vector.average></a>
### average()

Returns the average of the values in a vector.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", value: 1},
    {'refper': "2018-02-01", value: 2},
    {'refper': "2018-03-01", value: 3},
]);

let result = vector.average();
```

Result:
```javascript
2
```

<a name="Vector.reduce"></a>
### reduce(reducer)

Reduces the values in a vector based on the function **reducer**.

The function **reducer** has Number parameters **accumulator** and **current** 
and should return a Number.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", 'value': 2},
    {'refper': "2018-02-01", 'value': 3},
    {'refper': "2018-02-01", 'value': 4}
]);  
let result = vector.reduce(function(accumulator, current) {
    return accumulator * current;
});
```

Result:
```
24
```



<a name="Vector.periodDeltaTransformation"></a>
### periodDeltaTransformation(transformation)

Returns a new vector that is the result of a period to period transformation on 
the calling vector. The parameter **transformation** should be a function 
with two **Number** inputs representing the value of the current period and 
previous period and should return the transformed value.

The first datapoint of the transformed vector will have a value of `null` since 
there is no previoud period to compare to.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", value: 1},
    {'refper': "2018-02-01", value: 2},
    {'refper': "2018-03-01", value: 3},
]);

let result = vector.periodDeltaTransformation(function(curr, last)  {
    return curr + last;
});  
```

Result:
```javascript
[
    {'refper': "2018-01-01", value: null},
    {'refper': "2018-02-01", value: 3},
    {'refper': "2018-03-01", value: 5}
]
```

<a name="Vector.operate"></a>
### operate(operation)

Performs an operation with another vector. The parameter **operation** is 
a function with two **Number** inputs **a** and **b** that returns the result 
of an operation on both inputs. The input **a** should represent the value in 
the calling vector and the input **b** should represent the value in the 
other vector.

The intersection of the two vectors are taken before performing the operation.

Example:
```js
let vectorA = new Vector([
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2}
]);

let vectorB = new Vector([
    {'refper': "2018-01-01", 'value': 3},
    {'refper': "2018-02-01", 'value': 4}
]);

let result = vectorA.operate(vectorB, (a, b) => a + b);
```

Result:
```js
[
    {'refper': "2018-01-01", 'value': 4},
    {'refper': "2018-02-01", 'value': 6}  
]
```

<a name="Vector.periodTransformation"></a>
### periodTransformation(transformation)

Returns a new vector that is the result of period transformation on 
the calling vector. The parameter **transformation** should be a function 
with a **Number** input representing the value of the current period and should 
return the transformed value.

The first datapoint of the transformed vector will have a value of `null` since 
there is no previous period to compare to.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", value: 1},
    {'refper': "2018-02-01", value: 2},
    {'refper': "2018-03-01", value: 3}
]);

let result = vector.periodTransformation(function(value)  {
    return value * 2;
});  
```

Result:
```javascript
[
    {'refper': "2018-01-01", value: 2},
    {'refper': "2018-02-01", value: 4},
    {'refper': "2018-03-01", value: 6}
]
```

<a name="Vector.periodToPeriodPercentageChange"></a>
### periodToPeriodPercentageChange()

Returns a period-to-period percentage change vector of the calling vector.

Example:
```javascript
let vector = new Vector([
    {'refper': '2018-01-01', 'value': 2},
    {'refper': '2018-02-01', 'value': 6},
    {'refper': '2018-03-01', 'value': 3}
]);

let result = vector.periodToPeriodPercentageChange();
```

Result:
```javascript
[
    {'refper': "2018-01-01", 'value': null},
    {'refper': "2018-02-01", 'value': 200.0},
    {'refper': "2018-03-01", 'value': -50.0}
]
```

<a name="Vector.periodToPeriodDifference"></a>
### periodToPeriodDifference()

Returns a period-to-period difference vector of the calling vector.

Example:
```javascript
let vector = new Vector([
    {'refper': '2018-01-01', 'value': 2},
    {'refper': '2018-02-01', 'value': 6},
    {'refper': '2018-03-01', 'value': 3}
]);

let result = vector.periodToPeriodDifference();
```

Result:
```javascript
[
    {'refper': "2018-01-01", 'value': null},
    {'refper': "2018-02-01", 'value': 4},
    {'refper': "2018-03-01", 'value': -3}
]
```

<a name="Vector.samePeriodPreviousYearPercentageChange"></a>
### samePeriodPreviousYearPercentageChange()

Annualizes and returns a period-to-period percent change vector of the calling 
vector.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-06-01", 'value': 0},
    {'refper': "2018-12-01", 'value': 2},
    {'refper': "2019-06-01", 'value': 0},
    {'refper': "2019-12-01", 'value': 6},
    {'refper': "2020-06-01", 'value': 0},
    {'refper': "2020-12-01", 'value': 3}
]);

let result = vector.samePeriodPreviousYearPercentageChange();
```

Result:
```javascript
[
    {'refper': "2018-12-01", 'value': null},
    {'refper': "2019-12-01", 'value': 200.0},
    {'refper': "2020-12-01", 'value': -50.0}
]
```

<a name="Vector.samePeriodPreviousYearDifference"></a>
### samePeriodPreviousYearDifference()

Annualizes and returns a period-to-period difference vector of the calling 
vector.

Example:
```javascript
let vector = new Vector([
    {'refper': '2018-06-01', 'value': 0},
    {'refper': '2018-12-01', 'value': 2},
    {'refper': '2019-06-01', 'value': 0},
    {'refper': '2019-12-01', 'value': 6},
    {'refper': '2020-06-01', 'value': 0},
    {'refper': '2020-12-01', 'value': 4}
]);

let result = vector.samePeriodPreviousYearDifference();
```

Result:
```javascript
[
    {'refper': "2018-01-01", 'value': null},
    {'refper': "2018-02-01", 'value': 4},
    {'refper': "2018-03-01", 'value': -3}
]
```

<a name="Vector.annual"></a>
### annual(mode)

Converts the frequency of a vector to annual, returning the last reference 
period for each year.

The parameter **mode** is optional and can be one of the following strings:
- `"last"`: Takes the last reference period of each year (Default).
- `"sum"`: Takes the sum of each year.
- `"average"`: Takes the average of each year.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-06-01", 'value': 0},
    {'refper': "2018-12-01", 'value': 1},
    {'refper': "2019-06-01", 'value': 2},
    {'refper': "2019-12-01", 'value': 3},
    {'refper': "2020-06-01", 'value': 4},
    {'refper': "2020-12-01", 'value': 5}
]);

let result = vector.annual();
```

Result:
```javascript
[
    {'refper': "2018-12-01", 'value': 1},
    {'refper': "2019-12-01", 'value': 3},
    {'refper': "2020-12-01", 'value': 5}
]
```

<a name="Vector.monthly"></a>
### monthly()

Converts the frequency of a vector to monthly, returning the last reference 
period for each month.

The parameter **mode** is optional and can be one of the following strings:
- `"last"`: Takes the last reference period of each month (Default).
- `"sum"`: Takes the sum of each month.
- `"average"`: Takes the average of each month.

Example:
```javascript
    let vector = new Vector([
        {'refper': '2018-12-01', value: 1},
        {'refper': '2018-12-12', value: 2},
        {'refper': '2019-01-01', value: 3},
        {'refper': '2019-01-12', value: 4},
        {'refper': '2019-02-01', value: 5},
        {'refper': '2019-02-12', value: 6}
    ]);

    let result = vector.monthly();
```

Result:
```javascript
[
    {'refper': '2018-12-12', value: 2},
    {'refper': '2019-01-12', value: 4},
    {'refper': '2019-02-12', value: 6}
]
```

<a name="Vector.round"></a>
### round(decimals)

Returns a new vector with all values in the calling vector roudned 
to a specified number of decimal places. 

If **decimals** is not specified then the default value of `0` will be used.  

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", 'value': 1.555},
    {'refper': "2018-02-01", 'value': 1.554}
]);

let result = vector.round(2);
```

Result:
```javascript
[
    {'refper': "2018-01-01", 'value': 1.56},
    {'refper': "2018-02-01", 'value': 1.55}
]
```

<a name="Vector.roundBankers"></a>
### roundBankers(decimals)

Returns a new vector with all values in the calling vector rounded to a 
specified number of decimal places using the 
[Banker's rounding algorithm](http://wiki.c2.com/?BankersRounding). 

If **decimals** is not specified then the default value of `0` will be used.  

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", 'value': 1.5},
    {'refper': "2018-02-01", 'value': 2.5}
]);

let result = vector.roundBankers(0);
```

Result:
```javascript
[
    {'refper': "2018-01-01", 'value': 2},
    {'refper': "2018-02-01", 'value': 2}
]
```

## VectorLib

<a name="VectorLib.evaluate"></a>
### evaluate(expression, vectors)

Performs arithmetic on a set of vectors. This function returns a **Vector** 
object.

All input vectors will be intersected with each other before performing an 
operation using the **intersection** function.

Example:
```javascript
let vectors = {
    'v1': new Vector([
        {'refper': "2018-01-01", 'value': 1},
        {'refper': "2018-02-01", 'value': 2}
    ]),
    'v2': new Vector([
        {'refper': "2018-01-01", 'value': 3},
        {'refper': "2018-02-01", 'value': 4}
    ]),
    'v3': new Vector([
        {'refper': "2018-01-01", 'value': 2},
        {'refper': "2018-02-01", 'value': 2}
    ])
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

