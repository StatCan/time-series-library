let assert = require('assert');

const VectorLib = require('./src/time_series_library.js').VectorLib;
const Vector = require('./src/time_series_library.js').Vector;

let vlib = new VectorLib();

describe('Vector', function() {
    describe('#get', function() {
        it("should return the datapoint at a given index", function() {
            let v = new Vector([
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2}
            ]);
            assert.strictEqual(v.get(1).value, 2);
        });
    });

    describe('#refper', function() {
        it("should return the reference period at a given index", function() {
            let v = new Vector([
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2}
            ]);
            assert.strictEqual(v.refperStr(1), "2018-02-01");
        });
    });

    describe('#value', function() {
        it("should return the value at a given index", function() {
            let v = new Vector([
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2}
            ]);
            assert.strictEqual(v.value(1), 2);
        });
    });

    describe('#push', function() {
        it("should append a datapoint to a vector", function() {
            let v = new Vector([
                {'refper': "2018-01-01", 'value': 1}
            ]);
            v.push({'refper': "2018-02-01", 'value': 2});
            assert.strictEqual(v.value(1), 2);
            assert.strictEqual(v.length, 2);
        });
    });

    describe('#equals', function() {
        it("should return true if two vectors are equal", function() {
            let v1 = new Vector([
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2}
            ]);
            let v2 = new Vector([
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2}
            ]);
            assert.strictEqual(v1.equals(v2), true);
        });

        it("should return false if two vectors are not equal", function() {
            let v1 = new Vector([
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 1}
            ]);
            let v2 = new Vector([
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2}
            ]);
            assert.strictEqual(v1.equals(v2), false);

            v1 = new Vector([
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 1}
            ]);
            v2 = new Vector([
                {'refper': "2018-01-01", 'value': 1}
            ]); 
            assert.strictEqual(v1.equals(v2), false);
        });
    });

    describe('#copy', function() {
        it("should create a copy of a vector", function() {
            let vector = new Vector([
                {'refper': '2018-01-01', 'value': 1, 'extra': 0},
                {'refper': '2018-01-02', 'value': 2}
            ]);
    
            let result = vector.copy(vector);
            assert.strictEqual(result.refperStr(0), '2018-01-01');
            assert.strictEqual(result.refperStr(1), '2018-01-02');
            assert.strictEqual(result.value(0), 1);
            assert.strictEqual(result.value(1), 2);
            assert.strictEqual(result.get(0).extra, 0);
        });
    });

    describe('#filter', function() {
        it("should return a filtered vector based on a predicate", function() {
            let vector = new Vector([
                {'refper': '2018-01-01', 'value': 0},
                {'refper': '2018-01-02', 'value': 1},
                {'refper': '2018-01-03', 'value': 2},
            ]);
            result = vector.filter(p => p.value % 2 == 0);
            assert.strictEqual(result.value(0), 0);
            assert.strictEqual(result.value(1), 2);
            assert.strictEqual(result.length, 2);
        });
    });

    describe('#range', function() {
        it("should return the given date range of a vector", function() {
            let vector = new Vector([
                {'refper': '2018-01-01', 'value': 0},
                {'refper': '2018-01-02', 'value': 1},
                {'refper': '2018-01-03', 'value': 2},
                {'refper': '2018-01-04', 'value': 3}
            ]);
            result = vector.range('2018-01-02', '2018-01-03');
            assert.strictEqual(result.length, 2);
            assert.strictEqual(result.value(0), 1);
            assert.strictEqual(result.value(1), 2);
        });
    });

    describe('#latestN', function() {
        it("should return the latest N reference periods", function() {
            let vector = new Vector([
                {'refper': '2018-01-01', value: 1},
                {'refper': '2018-02-01', value: 2},
                {'refper': '2018-03-01', value: 3},
                {'refper': '2018-04-01', value: 4}
            ]);
            result = vector.latestN(2);

            assert.strictEqual(result.length, 2);
            assert.strictEqual(result.value(0), 3);
            assert.strictEqual(result.value(1), 4);
        });
    });

    describe('#interoperable', function() {
        it("should return true if two vectors are interoperable", function() {
            let v1 = new Vector([
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2}
            ]);
            let v2 = new Vector([
                {'refper': "2018-01-01", 'value': 3},
                {'refper': "2018-02-01", 'value': 4}
            ]);
            assert.strictEqual(v1.interoperable(v2), true);
        });

        it("should return false if two vectors are not interoperable", 
                function() {
            let v1 = new Vector([
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2}
            ]);
            let v2 = new Vector([
                {'refper': "2018-01-01", 'value': 3},
                {'refper': "2018-03-01", 'value': 4}
            ]);
            assert.strictEqual(v1.interoperable(v2), false);

            v1 = new Vector([
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2}
            ]);
            v2 = new Vector([
                {'refper': "2018-01-01", 'value': 3}
            ]); 
            assert.strictEqual(v1.interoperable(v2), false);
        });
    });

    describe('#intersection', function() {
        let v1 = new Vector([
            {'refper': "2018-01-01", 'value': 1},
            {'refper': "2018-02-01", 'value': 2},
            {'refper': "2018-03-01", 'value': 3},
            {'refper': "2018-04-01", 'value': 4},
            {'refper': "2018-05-01", 'value': 5},
            {'refper': "2018-06-01", 'value': 6}
        ]);
        let v2 = new Vector([
            {'refper': "2018-01-01", 'value': 11},
            {'refper': "2018-02-01", 'value': 12}
        ]);
        let v3 = new Vector([
            {'refper': "2018-05-01", 'value': 15},
            {'refper': "2018-06-01", 'value': 16}
        ]);
        let v4 = new Vector([
            {'refper': "2018-03-01", 'value': 13},
            {'refper': "2018-04-01", 'value': 14}
        ]);
        let v5 = new Vector([
            {'refper': "2018-01-01", 'value': 11}
        ]);
        let v6 = new Vector([
            {'refper': "2018-06-01", 'value': 16}
        ]);
        let v7 = new Vector();


        let v1Intv2 = new Vector([
            {'refper': "2018-01-01", 'value': 1},
            {'refper': "2018-02-01", 'value': 2}
        ]);
        let v1Intv3 = new Vector([
            {'refper': "2018-05-01", 'value': 5},
            {'refper': "2018-06-01", 'value': 6}
        ]);
        let v1Intv4 = new Vector([
            {'refper': "2018-03-01", 'value': 3},
            {'refper': "2018-04-01", 'value': 4}
        ]);
        let v1Intv5 = new Vector([
            {'refper': "2018-01-01", 'value': 1}
        ]);
        let v1Intv6 = new Vector([
            {'refper': "2018-06-01", 'value': 6}
        ]);
        let v1Intv7 = new Vector([]);

        it("should intersect this vector with another", function() {
            assert.strictEqual(v1.intersection(v2).equals(v1Intv2), true);
            assert.strictEqual(v1.intersection(v3).equals(v1Intv3), true);
            assert.strictEqual(v1.intersection(v4).equals(v1Intv4), true);
            assert.strictEqual(v1.intersection(v5).equals(v1Intv5), true);
            assert.strictEqual(v1.intersection(v6).equals(v1Intv6), true);
            assert.strictEqual(v1.intersection(v7).equals(v1Intv7), true);
            assert.strictEqual(v2.intersection(v1).equals(v2), true);
            assert.strictEqual(v3.intersection(v1).equals(v3), true);
            assert.strictEqual(v4.intersection(v1).equals(v4), true);
            assert.strictEqual(v5.intersection(v1).equals(v5), true);
            assert.strictEqual(v6.intersection(v1).equals(v6), true);
            assert.strictEqual(v7.intersection(v1).equals(v7), true);
        });
    });

    describe('#sum', function() {
        it("should return the sum of a vector", function() {
            let vector = new Vector([
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2},
                {'refper': "2018-02-01", 'value': 3}
            ]);  
            assert.strictEqual(vector.sum(), 6);

            vector = new Vector([
                {'refper': "2018-01-01", 'value': 1}
            ]);
            assert.strictEqual(vector.sum(), 1);

            vector = new Vector();
            assert.strictEqual(vector.sum(), null);
        });
    })

    describe('#average', function() {
        it("should return the sum of a vector", function() {
            let vector = new Vector([
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2},
                {'refper': "2018-02-01", 'value': 3}
            ]);  
            assert.strictEqual(vector.average(), 2);

            vector = new Vector();
            assert.strictEqual(vector.average(), null);
        });
    })

    describe('#reduce', function() {
        it("should reduce a vector", function() {
            let vector = new Vector([
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2},
                {'refper': "2018-02-01", 'value': 3}
            ]);  
            let result = vector.reduce(function(accumulator, curr) {
                return accumulator * curr;
            });
            assert.strictEqual(result, 6);
        });
    })

    describe('#operate', function() {
        it("should perform an operation on a vector", function() {
            let vectorA = new Vector([
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2}
            ]);      
            let vectorB = new Vector([
                {'refper': "2018-01-01", 'value': 3},
                {'refper': "2018-02-01", 'value': 4}
            ]);
            let expected = new Vector([
                {'refper': "2018-01-01", 'value': 4},
                {'refper': "2018-02-01", 'value': 6}
            ]);

            let result = vectorA.operate(vectorB, (a, b) => a + b);
            assert.strictEqual(result.equals(expected), true);
        });
    });
  
    describe('#periodDeltaTransformation', function() {
        it("should return a transformed vector based on a delta function", 
                function() {
            let vector = new Vector([
                {'refper': '2018-01-01', value: 1},
                {'refper': '2018-02-01', value: 2},
                {'refper': '2018-03-01', value: 3},
            ]);
            let result = vector.periodDeltaTransformation((curr, last) => {
                return curr + last;
            });  
            assert.strictEqual(result.value(0), null);
            assert.strictEqual(result.value(1), 3); 
            assert.strictEqual(result.value(2), 5);         
        });
    });

    describe('#periodTransformation', function() {
        it("should return a transformed vector based on a function", 
                function() {
            let vector = new Vector([
                {'refper': '2018-01-01', value: 1},
                {'refper': '2018-02-01', value: 2},
                {'refper': '2018-03-01', value: 3},
            ]);
            let result = vector.periodTransformation(val => val * 2); 
            assert.strictEqual(result.value(0), 2);
            assert.strictEqual(result.value(1), 4); 
            assert.strictEqual(result.value(2), 6);         
        });
    });

    describe('#periodToPeriodPercentageChange', function() {
        it("should compute the percentage change vector", function() {
            let vector = new Vector([
                {'refper': '2018-01-01', 'value': 2},
                {'refper': '2018-01-02', 'value': 6},
                {'refper': '2018-01-03', 'value': 3},
            ]);

            let result = vector.periodToPeriodPercentageChange();
            assert.strictEqual(result.value(0), null);
            assert.strictEqual(result.value(1), 200.0);
            assert.strictEqual(result.value(2), -50.0);
        });
    });

    describe('#periodToPeriodDifference', function() {
        it("should compute the difference vector", function() {
            let vector = new Vector([
                {'refper': '2018-01-01', 'value': 2},
                {'refper': '2018-01-02', 'value': 6},
                {'refper': '2018-01-03', 'value': 4},
            ]);

            let result = vector.periodToPeriodDifference();
            assert.strictEqual(result.value(0), null);
            assert.strictEqual(result.value(1), 4);
            assert.strictEqual(result.value(2), -2);
        });
    });

    describe('#samePeriodPreviousYearPercentageChange', function() {
        it("should compute the annualized percent change vector", function() {
            let vector = new Vector([
                {'refper': '2018-06-01', 'value': 0},
                {'refper': '2018-12-01', 'value': 2},
                {'refper': '2019-06-01', 'value': 0},
                {'refper': '2019-12-01', 'value': 6},
                {'refper': '2020-06-01', 'value': 0},
                {'refper': '2020-12-01', 'value': 3}
            ]);

            let result = vector.samePeriodPreviousYearPercentageChange();
            assert.strictEqual(result.value(0), null);
            assert.strictEqual(result.value(1), 200.0);
            assert.strictEqual(result.value(2), -50.0);
        });
    });

    describe('#samePeriodPreviousYearDifference', function() {
        it("should compute the annualized difference vector", function() {
            let vector = new Vector([
                {'refper': '2018-06-01', 'value': 0},
                {'refper': '2018-12-01', 'value': 2},
                {'refper': '2019-06-01', 'value': 0},
                {'refper': '2019-12-01', 'value': 6},
                {'refper': '2020-06-01', 'value': 0},
                {'refper': '2020-12-01', 'value': 4}
            ]);

            let result = vector.samePeriodPreviousYearDifference();
            assert.strictEqual(result.value(0), null);
            assert.strictEqual(result.value(1), 4);
            assert.strictEqual(result.value(2), -2);
        });
    });

    describe('#annual', function() {
        it("should convert a vector to an annual frequency", function() {
            let vector = new Vector([
                {'refper': '2018-03-01', value: 0},
                {'refper': '2018-06-01', value: 0},
                {'refper': '2018-09-01', value: 0},
                {'refper': '2018-12-01', value: 0},
                {'refper': '2019-03-01', value: 0}
            ]);
            let result = vector.annual();
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result.refperStr(0), '2018-12-01');

            vector = new Vector([
                {'refper': '2018-06-01', value: 0},
                {'refper': '2018-12-01', value: 0},
                {'refper': '2019-06-01', value: 0},
                {'refper': '2019-12-01', value: 0},
                {'refper': '2019-12-02', value: 0},
                {'refper': '2020-06-01', value: 0},
                {'refper': '2020-12-01', value: 0},
                {'refper': '2020-12-02', value: 0}
            ]);
            result = vector.annual();
            assert.strictEqual(result.length, 3);
            assert.strictEqual(result.refperStr(0), '2018-12-01');
            assert.strictEqual(result.refperStr(1), '2019-12-02');
            assert.strictEqual(result.refperStr(2), '2020-12-02');

            vector = new Vector([
                {'refper': '2018-06-01', value: 0},
                {'refper': '2018-12-01', value: 0}
            ]);
            result = vector.annual();
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result.refperStr(0), '2018-12-01');

            vector = new Vector([
                {'refper': '2018-06-01', 'value': 0},
                {'refper': '2018-12-01', 'value': 2},
                {'refper': '2019-06-01', 'value': 0},
                {'refper': '2019-12-01', 'value': 6},
                {'refper': '2020-06-01', 'value': 0},
                {'refper': '2020-12-01', 'value': 4}
            ]);
            result = vector.annual();
            assert.strictEqual(result.length, 3);
            assert.strictEqual(result.refperStr(0), '2018-12-01');
            assert.strictEqual(result.refperStr(1), '2019-12-01');
            assert.strictEqual(result.refperStr(2), '2020-12-01');
        });
    });

    describe('#quarter', function() {
        it("should convert a vector to a quarterly frequency", function() {
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

            let expected = new Vector([
                {'refper': '2019-03-01', value: 3},
                {'refper': '2019-06-01', value: 6},
                {'refper': '2019-09-01', value: 9},
                {'refper': '2019-12-01', value: 12}
            ]);
            let result = vector.quarter();
            assert.strictEqual(result.equals(expected), true);   

            expected = new Vector([
                {'refper': '2018-02-01', value: 2},
                {'refper': '2019-05-01', value: 5},
                {'refper': '2019-08-01', value: 8},
                {'refper': '2019-11-01', value: 11}
            ]);
            result = vector.quarter("last", 1);
            assert.strictEqual(result.equals(expected), true);  

            expected = new Vector([
                {'refper': '2018-01-01', value: 1},
                {'refper': '2019-04-01', value: 4},
                {'refper': '2019-07-01', value: 7},
                {'refper': '2019-10-01', value: 10}
            ]);
            result = vector.quarter("last", 2);
            assert.strictEqual(result.equals(expected), true);  
        });
    });

    describe('#monthly', function() {
        it("should convert a vector to an annual frequency", function() {
            let vector = new Vector([
                {'refper': '2018-12-01', value: 1},
                {'refper': '2018-12-12', value: 2},
                {'refper': '2019-01-01', value: 3},
                {'refper': '2019-01-12', value: 4},
                {'refper': '2019-02-01', value: 5},
                {'refper': '2019-02-12', value: 6}
            ]);
            let expected = new Vector([
                {'refper': '2018-12-12', value: 2},
                {'refper': '2019-01-12', value: 4},
                {'refper': '2019-02-12', value: 6}
            ]);
            let result = vector.monthly();
            assert.strictEqual(result.equals(expected), true);         
        });

        it("should handle monthly sums", function() {
            let vector = new Vector([
                {'refper': '2018-12-01', value: 1},
                {'refper': '2018-12-12', value: 2},
                {'refper': '2019-01-01', value: 3},
                {'refper': '2019-01-12', value: 4},
                {'refper': '2019-02-01', value: 5},
                {'refper': '2019-02-12', value: 6}
            ]);
            let expected = new Vector([
                {'refper': '2018-12-12', value: 3},
                {'refper': '2019-01-12', value: 7},
                {'refper': '2019-02-12', value: 11}
            ]);
            let result = vector.monthly("sum");
            assert.strictEqual(result.equals(expected), true);    
        });

        it("should handle monthly averages", function() {
            let vector = new Vector([
                {'refper': '2018-12-01', value: 1},
                {'refper': '2018-12-12', value: 3},
                {'refper': '2019-01-01', value: 5},
                {'refper': '2019-01-12', value: 3},
                {'refper': '2019-02-01', value: 7},
                {'refper': '2019-02-12', value: 3}
            ]);
            let expected = new Vector([
                {'refper': '2018-12-12', value: 2},
                {'refper': '2019-01-12', value: 4},
                {'refper': '2019-02-12', value: 5}
            ]);
            let result = vector.monthly("average");
            assert.strictEqual(result.equals(expected), true);  
        })
    });

    describe('#weekly', function() {
        it("should convert a vector to a weekly frequency", function() {
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
                {'refper': '2019-02-22', value: 10}
            ]);

            let expected = new Vector([
                {'refper': '2019-02-15', value: 5},
                {'refper': '2019-02-22', value: 10}
            ]);
            let result = vector.weekly();
            assert.strictEqual(result.equals(expected), true);   
        });
    });

    describe('#round', function() {
        it("should round values in a vector", function() {
            let vector = new Vector([
                {'refper': '2018-01-01', 'value': 1.555},
                {'refper': '2018-01-02', 'value': 1.554}
            ]);
    
            let result = vector.round(2);
            assert.strictEqual(result.value(0), 1.56);
            assert.strictEqual(result.value(1), 1.55);
    
            result = vector.round();
            assert.strictEqual(result.value(0), 2);
            assert.strictEqual(result.value(1), 2);
        });
    });

    describe('#roundBannkers', function() {
        it("should Banker's round values in a vector", function() {
            let vector = new Vector([
                {'refper': '2018-01-01', 'value': 1.5},
                {'refper': '2018-01-02', 'value': 2.5}
            ]);
    
            let result = vector.roundBankers();
            assert.strictEqual(result.value(0), 2);
            assert.strictEqual(result.value(1), 2);
        });
    });

    describe('#json', function() {
        it("should convert a vector to a JSON array", function() {
            let vector = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2}
            ]);
            let result = vector.json();
            
            let newVector = new Vector(JSON.parse(result));
            assert.strictEqual(vector.equals(newVector), true);
        });
    });
});

describe('VectorLib', function() {   
    describe('#evaluate', function() {
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
            ]),
            'v4': new Vector([
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2},
                {'refper': "2018-03-01", 'value': 3}
            ]),
            'v5': new Vector([
                {'refper': "2018-01-01", 'value': 4},
                {'refper': "2018-02-01", 'value': 5},
                {'refper': "2018-03-01", 'value': 6}
            ]),
            'v6': new Vector([
                {'refper': "2018-01-01", 'value': 7},
                {'refper': "2018-02-01", 'value': 8},
                {'refper': "2018-03-01", 'value': 9}
            ])
        };

        let itVexp = function(vexp, expected) {
            it (vexp + " should equal " + JSON.stringify(expected), function() {
                let result = vlib.evaluate(vexp, vectors);
                assert.strictEqual(result.equals(expected), true);
            });
        };

        let expected = new Vector([
            {'refper': "2018-01-01", 'value': 16},
            {'refper': "2018-02-01", 'value': 24}
        ]);
        let vexp = "(v1 + v2) * (2*v3)";
        itVexp(vexp, expected);

        vexp = "(v1 - v2) * (2*v3)";
        expected = new Vector([
            {'refper': "2018-01-01", 'value': -8},
            {'refper': "2018-02-01", 'value': -8}
        ]);
        itVexp(vexp, expected);

        vexp = "v6 - v5 - v4";
        expected = new Vector([
            {'refper': "2018-01-01", 'value': 2},
            {'refper': "2018-02-01", 'value': 1},
            {'refper': "2018-03-01", 'value': 0}
        ]);       
        itVexp(vexp, expected);

        vexp = ""
    });

    describe('#getVectorIds', function() {
        it("should return the list of vector IDs in a string", function() {
            let ids = vlib.getVectorIds("(v1 + v2) * (2*v3)");
            assert.strictEqual(ids.length, 3);
            assert.strictEqual(ids[0], "1");
            assert.strictEqual(ids[1], "2");
            assert.strictEqual(ids[2], "3");
        });
    });
});