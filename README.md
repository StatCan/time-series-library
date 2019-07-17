# time-series-library

A TypeScript/JavaScript library for arithmetic on Statistics Canada time series 
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
// common-js
const TimeSeriesLibrary = require('time-series-library');
const Vector = TimeSeriesLibrary.Vector;
const VectorLib = TimeSeriesLibrary.VectorLib;

// es6 module
import {Vector, VectorLib} from 'time-series-library';
```

Using a web browser:
```html
<script src="./time-series-library.js"></script>

<script>
    const Vector = TimeSeriesLibrary.Vector;
    const VectorLib = TimeSeriesLibrary.VectorLib;
</script>
```

# Usage

**Vector:**  
[get(index)](#Vector.get)  
[refper(index), refperStr(index)](#Vector.refper)  
[value(index)](#Vector.value)  
[values()](#Vector.values)  
[length](#Vector.length)  
[push(datapoint)](#Vector.push)  
[equals(other)](#Vector.equals)  
[copy()](#Vector.copy)  
[map(fn)](#Vector.map)  
[find(predicate)](#Vector.find)  
[filter(predicate)](#Vector.filter)  
[range(startDate, endDate)](#Vector.range)  
[latestN(n)](#Vector.latestN)  
[interoperable(other)](#Vector.interoperable)  
[intersection(others)](#Vector.intersection)  
[sum()](#Vector.sum)  
[average()](#Vector.average)  
[reduce()](#Vector.reduce)  
[operate(operation)](#Vector.operate)  
[periodDeltaTransformation(transformation)](#Vector.periodDeltaTransformation)  
[samePeriodPreviousYearTransformation(transformation)](#Vector.samePeriodPreviousYearTransformation)  
[periodTransformation(transformation)](#Vector.periodTransformation)  
[periodToPeriodPercentageChange(transformation)](#Vector.periodToPeriodPercentageChange)  
[periodToPeriodDifference()](#Vector.periodToPeriodDifference)  
[samePeriodPreviousYearPercentageChange()](#Vector.samePeriodPreviousYearPercentageChange)  
[samePeriodPreviousYearDifference()](#Vector.samePeriodPreviousYearDifference)  
[convertToFrequency(mode, converter)](#Vector.convertToFrequency)  
[weekly(mode)](#Vector.weekly)  
[monthly(mode)](#Vector.monthly)  
[biMonthly(mode)](#Vector.biMonthly)  
[quarterly(mode)](#Vector.quarterly)  
[semiAnnual(mode)](#Vector.semiAnnual)  
[annual(mode)](#Vector.annual)  
[biAnnual(mode)](#Vector.biAnnual)  
[triAnnnual(mode)](#Vector.triAnnual)  
[quinquennial(mode)](#Vector.quinquennial)  
[round(decimals)](#Vector.round)  
[roundBankers(decimals)](#Vector.roundBankers)  
[json()](#Vector.json)  

**VectorLib:**  
[evaluate(expression, vectors)](#VectorLib.evaluate)  
[generateDaily(values, startDate)](#VectorLib.generateDaily)  
[generateWeekly(values, startDate)](#VectorLib.generateWeekly)  
[generateMonthly(values, startDate)](#VectorLib.generateMonthly)  
[generateBiMonthly(values, startDate)](#VectorLib.generateBiMonthly)  
[generateQuarterly(values, startDate)](#VectorLib.generateQuarterly)  
[generateSemiAnnual(values, startDate)](#VectorLib.generateSemiAnnual)  
[generateAnnual(values, startDate)](#VectorLib.generateAnnual)  
[generateBiAnnual(values, startDate)](#VectorLib.generateBiAnnual)  
[generateTriAnnual(values, startDate)](#VectorLib.generateTriAnnual)  
[generateQuinquennial(values, startDate)](#VectorLib.generateQuinquennial)  

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

Datapoints may also hold addional information in the `metadata property`:
```js
let vector = let vector = new Vector([
    {'refper': "2018-01-01", 'value': 1, 'metadata': {'key': 'value'}}
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

<a name="Vector.values"></a>
### values()

Return the list of values in a vector.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", 'value': 1},
    {'refper': "2018-02-01", 'value': 2},
    {'refper': "2018-03-01", 'value': 3}
]);

let result = vector.values();
```

Result:
```javascript
[1, 2, 3]
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

<a name="Vector.map"></a>
### map(fn)

Applies a map function, **fn** on each point in a vector.   

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", 'value': 0},
    {'refper': "2018-01-02", 'value': 1},
    {'refper': "2018-01-03", 'value': 2},
]);

let result = vector.map(p => p.value);
```

Result:
```javascript
[0, 1, 2]
```

<a name="Vector.find"></a>
### find(predicate)

Returns the first datapoint in a vector matching a predicate function. Returns 
`undefined` if no match is found.   

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-01-01", 'value': 0},
    {'refper': "2018-01-02", 'value': 1},
    {'refper': "2018-01-03", 'value': 2},
]);

let result = vector.find(p => p == 1);
```

Result:
```javascript
{'refper': "2018-01-02", 'value': 1}
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
### intersection(others)

Returns the result of the intersection of the calling vector with other vectors. 

The parameter **others** can either be a single vector or an array of vectors.

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

<a name="Vector.periodDeltaTransformation"></a>
### periodDeltaTransformation(transformation)

Returns a new vector that is the result of a period to period transformation on 
the calling vector. The parameter **transformation** should be a function 
with two **Number** inputs representing the value of the current period and 
previous period and should return the transformed value.

The first datapoint of the transformed vector will have a value of `null` since 
there is no previous period to compare to.

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

<a name="Vector.samePeriodPreviousYearTransformation"></a>
### samePeriodPreviousYearTransformation(transformation)

Returns a new vector that is the result of a same period previous year 
transformation on the calling vector. The parameter **transformation** should 
be a function with two **Number** inputs representing the value of the current 
period and previous period and should return the transformed value.

The first few datapoints of the transformed vector will have a value of `null` 
since there is no previous year to compare to.

Example:
```javascript
let vector = new Vector([
    {'refper': '2018-03-31', 'value': 1},
    {'refper': '2018-06-30', 'value': 2},
    {'refper': '2018-09-30', 'value': 3},
    {'refper': '2018-12-31', 'value': 4},
    {'refper': '2019-03-31', 'value': 5},
    {'refper': '2019-06-30', 'value': 6},
    {'refper': '2019-09-30', 'value': 7},
    {'refper': '2019-12-31', 'value': 8}
]);

let result = vector.samePeriodPreviousYearTransformation(function(curr, last)  {
    return curr - last;
});  
```

Result:
```javascript
[
    {'refper': '2018-03-31', 'value': null},
    {'refper': '2018-06-30', 'value': null},
    {'refper': '2018-09-30', 'value': null},
    {'refper': '2018-12-31', 'value': null},
    {'refper': '2019-03-31', 'value': 4},
    {'refper': '2019-06-30', 'value': 4},
    {'refper': '2019-09-30', 'value': 4},
    {'refper': '2019-12-31', 'value': 4}
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

Returns the same period previous year percentage change vector of the calling 
vector.

**Note:** Only works for vectors with frequencies of monthly of lower.

Example:
```javascript
let vector = new Vector([
    {'refper': '2018-06-01', 'value': 1},
    {'refper': '2018-12-01', 'value': 2},
    {'refper': '2019-06-01', 'value': 4},
    {'refper': '2019-12-01', 'value': 8},
    {'refper': '2020-06-01', 'value': 4},
    {'refper': '2020-12-01', 'value': 4}
]);

let result = vector.samePeriodPreviousYearPercentageChange();
```

Result:
```javascript
[
    {'refper': '2018-06-01', 'value': null},
    {'refper': '2018-12-01', 'value': null},
    {'refper': '2019-06-01', 'value': 300.0},
    {'refper': '2019-12-01', 'value': 300.0},
    {'refper': '2020-06-01', 'value': 0},
    {'refper': '2020-12-01', 'value': -50.0}
]
```

<a name="Vector.samePeriodPreviousYearDifference"></a>
### samePeriodPreviousYearDifference()

Returns the same period previous year difference vector of the calling 
vector.

**Note:** Only works for vectors with frequencies of monthly of lower.

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

let result = vector.samePeriodPreviousYearPercentageChange();
```

Result:
```javascript
[
    {'refper': '2018-06-01', 'value': null},
    {'refper': '2018-12-01', 'value': null},
    {'refper': '2019-06-01', 'value': 0},
    {'refper': '2019-12-01', 'value': 4},
    {'refper': '2020-06-01', 'value': 0},
    {'refper': '2020-12-01', 'value': -2}
]
```

<a name="Vector.convertToFrequency"></a>
### convertToFrequency(mode, converter)

Converts the frequency of a vector to a user defined frequency.

The parameter **mode** is optional and can be one of the following strings:
- `"last"`: Takes the last reference period of each user defined frequency 
(Default).
- `"sum"`: Takes the sum of each user defined frequency.
- `"average"`: Takes the average of each user defined frequency.
- `"max"`: Takes the maximum value of each user defined frequency.
- `"min"`: Takes the minimum value of each user defined frequency.

The parameter **conveter** is a function with date parameters **curr** and 
**last** and a `Boolean` return value. This function should return true when 
**curr** and **last** are the defined frequency apart.

**Note:** For the mode of operation, the vector is split into chunks where each 
chunk starts when the **converter** returns `true`. This operation starts from 
the last reference period of the vector and proceeds in descending order by 
time. Any chunk that does not have the same size as the latest chunk will be 
removed.

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

let result = vector.convertToFrequency('last', function(curr, last) {
    // Define frequency as monthly.
    return curr.getMonth() === (last.getMonth() + 1) % 12;
});
```

Result:
```javascript
[
    {'refper': '2018-12-12', value: 2},
    {'refper': '2019-01-12', value: 4},
    {'refper': '2019-02-12', value: 6}
]
```

<a name="Vector.weekly"></a>
### weekly(mode)

Converts the frequency of a vector to weekly.

The parameter **mode** is optional and can be one of the following strings:
- `"last"`: Takes the last reference period of each week (Default).
- `"sum"`: Takes the sum of each week.
- `"average"`: Takes the average of each week.
- `"max"`: Takes the maximum value of each week.
- `"min"`: Takes the minimum value of each week.

Example:
```javascript
let vector = new Vector([
    {'refper': '2019-02-11', value: 1},
    {'refper': '2018-02-12', value: 2},
    {'refper': '2019-02-13', value: 3},
    {'refper': '2019-02-14', value: 4},
    {'refper': '2019-02-15', value: 5},
    {'refper': '2019-02-18', value: 6},
    {'refper': '2019-02-19', value: 7},
    {'refper': '2019-02-20', value: 8},
    {'refper': '2019-02-21', value: 9},
    {'refper': '2019-02-22', value: 10},
    {'refper': '2019-02-25', value: 11}
]);

let result = vector.weekly();
```

Result:
```javascript
[
    {'refper': '2019-02-15', value: 5},
    {'refper': '2019-02-22', value: 10}
]
```

<a name="Vector.monthly"></a>
### monthly(mode)

Converts the frequency of a vector to monthly.

The parameter **mode** is optional and can be one of the following strings:
- `"last"`: Takes the last reference period of each month (Default).
- `"sum"`: Takes the sum of each month.
- `"average"`: Takes the average of each month.
- `"max"`: Takes the maximum value of each month.
- `"min"`: Takes the minimum value of each month.

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

<a name="Vector.biMonthly"></a>
### biMonthly(mode)

Converts the frequency of a vector to bi-monthly.

The parameter **mode** is optional and can be one of the following strings:
- `"last"`: Takes the last reference period of each two month period (Default).
- `"sum"`: Takes the sum of each two month period.
- `"average"`: Takes the average of each two month period.
- `"max"`: Takes the maximum value of each two month period.
- `"min"`: Takes the minimum value of each two month period.

Example:
```javascript
    let vector = new Vector([
        {'refper': '2018-01-01', value: 1},
        {'refper': '2018-02-01', value: 2},
        {'refper': '2019-03-01', value: 3},
        {'refper': '2019-04-01', value: 4},
        {'refper': '2019-05-01', value: 5},
        {'refper': '2019-06-01', value: 6}
    ]);

    let result = vector.biMonthly();
```

Result:
```javascript
[
    {'refper': '2018-02-01', value: 2},
    {'refper': '2019-04-01', value: 4},
    {'refper': '2019-06-01', value: 6}
]
```

<a name="Vector.quarterly"></a>
### quarterly(mode)

Converts the frequency of a vector to quarterly.

The parameter **mode** is optional and can be one of the following strings:
- `"last"`: Takes the last reference period of each quarter (Default).
- `"sum"`: Takes the sum of each quarter.
- `"average"`: Takes the average of each quarter.
- `"max"`: Takes the maximum value of each quarter.
- `"min"`: Takes the minimum value of each quarter.

Example:
```javascript
let vector = new Vector([
    {'refper': '2018-01-01', value: 1},
    {'refper': '2018-02-01', value: 2},
    {'refper': '2019-03-01', value: 3},
    {'refper': '2019-04-01', value: 4},
    {'refper': '2019-05-01', value: 5},
    {'refper': '2019-06-01', value: 6},
    {'refper': '2019-07-01', value: 7},
    {'refper': '2019-08-01', value: 8},
    {'refper': '2019-09-01', value: 9},
    {'refper': '2019-10-01', value: 10},
    {'refper': '2019-11-01', value: 11},
    {'refper': '2019-12-01', value: 12}
]);

let result = vector.quarterly();
```

Result:
```javascript
[
    {'refper': '2019-03-01', value: 3},
    {'refper': '2019-06-01', value: 6},
    {'refper': '2019-09-01', value: 9},
    {'refper': '2019-12-01', value: 12}
]
```

<a name="Vector.semiAnnual"></a>
### semiAnnual(mode)

Converts the frequency of a vector to semi-annual.

The parameter **mode** is optional and can be one of the following strings:
- `"last"`: Takes the last reference period of each semi-annum (Default).
- `"sum"`: Takes the sum of each semi-annum.
- `"average"`: Takes the average of each semi-annum.
- `"max"`: Takes the maximum value of each semi-annum.
- `"min"`: Takes the minimum value of each seni-annum.

Example:
```javascript
let vector = new Vector([
    {'refper': '2018-01-01', value: 1},
    {'refper': '2018-02-01', value: 2},
    {'refper': '2019-03-01', value: 3},
    {'refper': '2019-04-01', value: 4},
    {'refper': '2019-05-01', value: 5},
    {'refper': '2019-06-01', value: 6},
    {'refper': '2019-07-01', value: 7},
    {'refper': '2019-08-01', value: 8},
    {'refper': '2019-09-01', value: 9},
    {'refper': '2019-10-01', value: 10},
    {'refper': '2019-11-01', value: 11},
    {'refper': '2019-12-01', value: 12}
]);

let result = vector.semiAnnual();
```

Result:
```javascript
[
    {'refper': '2019-06-01', value: 6},
    {'refper': '2019-12-01', value: 12}
]
```

<a name="Vector.annual"></a>
### annual(mode)

Converts the frequency of a vector to annual.

The parameter **mode** is optional and can be one of the following strings:
- `"last"`: Takes the last reference period of each year (Default).
- `"sum"`: Takes the sum of each year.
- `"average"`: Takes the average of each year.
- `"max"`: Takes the maximum value of each year.
- `"min"`: Takes the minimum value of each year.

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

<a name="Vector.biAnnual"></a>
### biAnnual(mode)

Converts the frequency of a vector to bi-annual.

The parameter **mode** is optional and can be one of the following strings:
- `"last"`: Takes the last reference period of each bi-annum (Default).
- `"sum"`: Takes the sum of each bi-annum.
- `"average"`: Takes the average of each bi-annum.
- `"max"`: Takes the maximum value of each bi-annum.
- `"min"`: Takes the minimum value of each bi-annum.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-12-01", 'value': 0},
    {'refper': "2019-12-01", 'value': 1},
    {'refper': "2020-12-01", 'value': 2},
    {'refper': "2021-12-01", 'value': 3},
    {'refper': "2022-12-01", 'value': 4},
    {'refper': "2023-12-01", 'value': 5}
]);

let result = vector.biAnnual();
```

Result:
```javascript
[
    {'refper': "2019-12-01", 'value': 1},
    {'refper': "2021-12-01", 'value': 3},
    {'refper': "2023-12-01", 'value': 5}
]
```

<a name="Vector.triAnnual"></a>
### triAnnual(mode)

Converts the frequency of a vector to tri-annual.

The parameter **mode** is optional and can be one of the following strings:
- `"last"`: Takes the last reference period of each tri-annum (Default).
- `"sum"`: Takes the sum of each tri-annum.
- `"average"`: Takes the average of each tri-annum.
- `"max"`: Takes the maximum value of each tri-annum.
- `"min"`: Takes the minimum value of each tri-annum.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-12-01", 'value': 0},
    {'refper': "2019-12-01", 'value': 1},
    {'refper': "2020-12-01", 'value': 2},
    {'refper': "2021-12-01", 'value': 3},
    {'refper': "2022-12-01", 'value': 4},
    {'refper': "2023-12-01", 'value': 5}
]);

let result = vector.triAnnual();
```

Result:
```javascript
[
    {'refper': "2020-12-01", 'value': 2},
    {'refper': "2023-12-01", 'value': 5}
]
```

<a name="Vector.quinquennial"></a>
### quinquennial(mode)

Converts the frequency of a vector to quinquennial (every 5 years).

The parameter **mode** is optional and can be one of the following strings:
- `"last"`: Takes the last reference period of each quinquennium (Default).
- `"sum"`: Takes the sum of each quinquennium.
- `"average"`: Takes the average of each quinquennium.
- `"max"`: Takes the maximum value of each quinquennium.
- `"min"`: Takes the minimum value of each quinquennium.

Example:
```javascript
let vector = new Vector([
    {'refper': "2018-12-01", 'value': 0},
    {'refper': "2019-12-01", 'value': 1},
    {'refper': "2020-12-01", 'value': 2},
    {'refper': "2021-12-01", 'value': 3},
    {'refper': "2022-12-01", 'value': 4},
    {'refper': "2023-12-01", 'value': 5},
    {'refper': "2024-12-01", 'value': 6},
    {'refper': "2025-12-01", 'value': 7},
    {'refper': "2026-12-01", 'value': 8},
    {'refper': "2027-12-01", 'value': 9}
]);

let result = vector.quinquennial();
```

Result:
```javascript
[
    {'refper': "2022-12-01", 'value': 4},
    {'refper': "2027-12-01", 'value': 9}
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

<a name="Vector.json"></a>
### json()

Converts a vector to a JSON formatted array.

Example:
```js
let vector = new Vector([
    {'refper': '2018-01-01', 'value': 1},
    {'refper': '2018-02-01', 'value': 2}
]);
let result = vector.json();
```

Result:
```json
[
    {"refper": "2018-01-01", "value": 1},
    {"refper": "2018-02-01", "value": 2}
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
    '1': new Vector([
        {'refper': "2018-01-01", 'value': 1},
        {'refper': "2018-02-01", 'value': 2}
    ]),
    '2': new Vector([
        {'refper': "2018-01-01", 'value': 3},
        {'refper': "2018-02-01", 'value': 4}
    ]),
    '3': new Vector([
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

<a name="VectorLib.generateDaily"></a>
### generateDaily(values, startDate)

Generates a daily vector from a list of values starting from a specific 
reference period.

Example:
```javascript
let result = generateDaily([1, 2, 3], '2019-01-01');
```

Result:
```javascript
[
    {'refper': "2019-01-01", 'value': 1},
    {'refper': "2019-01-02", 'value': 2},
    {'refper': "2019-01-03", 'value': 3}
]
```

<a name="VectorLib.generateWeekly"></a>
### generateWeekly(values, startDate)

Generates a weekly vector from a list of values starting from a specific 
reference period.

Example:
```javascript
let result = generateWeekly([1, 2, 3], '2019-01-01');
```

Result:
```javascript
[
    {'refper': "2019-01-01", 'value': 1},
    {'refper': "2019-01-08", 'value': 2},
    {'refper': "2019-01-15", 'value': 3}
]
```

<a name="VectorLib.generateMonthly"></a>
### generateMonthly(values, startDate)

Generates a monthly vector from a list of values starting from a specific 
reference period. The last day of each month will be used as the reference 
periods.

Example:
```javascript
let result = generateMonthly([1, 2, 3], '2019-01-31');
```

Result:
```javascript
[
    {'refper': "2019-01-31", 'value': 1},
    {'refper': "2019-02-28", 'value': 2},
    {'refper': "2019-03-31", 'value': 3}
]
```

<a name="VectorLib.generateBiMonthly"></a>
### generateMonthly(values, startDate)

Generates a bi-monthly vector from a list of values starting from a specific 
reference period. The last day of each month will be used as the reference 
periods.

Example:
```javascript
let result = generateBiMonthly([1, 2, 3], '2019-01-31');
```

Result:
```javascript
[
    {'refper': "2019-01-31", 'value': 1},
    {'refper': "2019-03-31", 'value': 2},
    {'refper': "2019-05-31", 'value': 3}
]
```

<a name="VectorLib.generateQuarterly"></a>
### generateQuarterly(values, startDate)

Generates a quarterly vector from a list of values starting from a specific 
reference period. The last day of each month will be used as the reference 
periods.

Example:
```javascript
let result = generateQuarterly([1, 2, 3], '2019-01-31');
```

Result:
```javascript
[
    {'refper': "2019-01-31", 'value': 1},
    {'refper': "2019-04-30", 'value': 2},
    {'refper': "2019-07-31", 'value': 3}
]
```

<a name="VectorLib.generateSemiAnnual"></a>
### generateSemiAnnual(values, startDate)

Generates a semi annual vector from a list of values starting from a specific 
reference period. The last day of each month will be used as the reference 
periods.

Example:
```javascript
let result = generateSemiAnnual([1, 2, 3], '2019-01-31');
```

Result:
```javascript
[
    {'refper': "2019-01-31", 'value': 1},
    {'refper': "2019-07-31", 'value': 2},
    {'refper': "2020-01-31", 'value': 3}
]
```

<a name="VectorLib.generateAnnual"></a>
### generateAnnual(values, startDate)

Generates an annual vector from a list of values starting from a specific 
reference period. The last day of each year will be used as the reference 
periods.

Example:
```javascript
let result = generateAnnual([1, 2, 3], '2019-01-31');
```

Result:
```javascript
[
    {'refper': "2019-01-31", 'value': 1},
    {'refper': "2020-01-31", 'value': 2},
    {'refper': "2021-01-31", 'value': 3}
]
```

<a name="VectorLib.generateBiAnnual"></a>
### generateBiAnnual(values, startDate)

Generates a bi-annual vector from a list of values starting from a specific 
reference period. The last day of each year will be used as the reference 
periods.

Example:
```javascript
let result = generateBiAnnual([1, 2, 3], '2019-01-31');
```

Result:
```javascript
[
    {'refper': "2019-01-31", 'value': 1},
    {'refper': "2021-01-31", 'value': 2},
    {'refper': "2023-01-31", 'value': 3}
]
```

<a name="VectorLib.generateTriAnnual"></a>
### generateTriAnnual(values, startDate)

Generates a tri-annual vector from a list of values starting from a specific 
reference period. The last day of each year will be used as the reference 
periods.

Example:
```javascript
let result = generateTriAnnual([1, 2, 3], '2019-01-31');
```

Result:
```javascript
[
    {'refper': "2020-01-31", 'value': 1},
    {'refper': "2023-01-31", 'value': 2},
    {'refper': "2026-01-31", 'value': 3}
]
```

<a name="VectorLib.generateQuinquennial"></a>
### generateQuinquennial(values, startDate)

Generates a quinquennial vector from a list of values starting from a specific 
reference period. The last day of each year will be used as the reference 
periods.

Example:
```javascript
let result = generateQuinquennial([1, 2, 3], '2019-01-31');
```

Result:
```javascript
[
    {'refper': "2019-01-31", 'value': 1},
    {'refper': "2024-01-31", 'value': 2},
    {'refper': "2029-01-31", 'value': 3}
]
```

