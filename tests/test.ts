import * as assert from 'assert';

import {Vector, VectorLib} from '../src/time-series-library';

const vlib = new VectorLib();

// Vectors to use for testing.
const vectors = {
    '1': new Vector([
        {'refper': '2018-01-01', 'value': 1},
        {'refper': '2018-02-01', 'value': 2}
    ]),
    '2': new Vector([
        {'refper': '2018-01-01', 'value': 3},
        {'refper': '2018-02-01', 'value': 4}
    ]),
    '3': new Vector([
        {'refper': '2018-01-01', 'value': 2},
        {'refper': '2018-02-01', 'value': 2}
    ]),
    '4': new Vector([
        {'refper': '2018-01-01', 'value': 1},
        {'refper': '2018-02-01', 'value': 2},
        {'refper': '2018-03-01', 'value': 3}
    ]),
    '5': new Vector([
        {'refper': '2018-01-01', 'value': 4},
        {'refper': '2018-02-01', 'value': 5},
        {'refper': '2018-03-01', 'value': 6}
    ]),
    '6': new Vector([
        {'refper': '2018-01-01', 'value': 7},
        {'refper': '2018-02-01', 'value': 8},
        {'refper': '2018-03-01', 'value': 9}
    ]),
    '10': new Vector([
        {'refper': '2018-01-01', 'value': 10},
        {'refper': '2018-02-01', 'value': 11},
        {'refper': '2018-03-01', 'value': 12}
    ])
};

describe('Vector', function() {
    describe('#get', function() {
        it('should return the datapoint at a given index', function() {
            const v = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2}
            ]);
            assert.strictEqual(
                v.get(1).refper.getTime(), new Date(2018, 1, 1).getTime());
            assert.strictEqual(v.get(1).value, 2);
        });
    });

    describe('#refper', function() {
        it('should return the reference period at a given index', function() {
            const v = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2}
            ]);
            assert.strictEqual(
                v.refper(1).getTime(), new Date(2018, 1, 1).getTime());
        });
    });

    describe('#refperStr', function() {
        it('should return the reference period string at a given index', () => {
            const v = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2}
            ]);
            assert.strictEqual(v.refperStr(1), '2018-02-01');
        });
    });

    describe('#value', function() {
        it('should return the value at a given index', function() {
            const v = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2}
            ]);
            assert.strictEqual(v.value(1), 2);
        });
    });

    describe('#values', function() {
        it('should return the list of values', function() {
            const v = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2}
            ]);
            assert.deepStrictEqual(v.values(), [1, 2]);
        });

        it('should handle the empty vector', function() {
            const v = new Vector();
            assert.deepStrictEqual(v.values(), []);
        });
    });

    describe('#push', function() {
        it('should append a datapoint to a vector', function() {
            const v = new Vector([
                {'refper': '2018-01-01', 'value': 1}
            ]);
            v.push({'refper': '2018-02-01', 'value': 2});

            const expected = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2}
            ]);

            assert.ok(v.equals(expected));
        });
    });

    describe('#equals', function() {
        it('should return true if two vectors are equal', function() {
            const v1 = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2}
            ]);
            const v2 = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2}
            ]);
            assert.strictEqual(v1.equals(v2), true);
        });

        it('should return false if two vectors are not equal', function() {
            let v1 = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 1}
            ]);
            let v2 = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2}
            ]);
            assert.strictEqual(v1.equals(v2), false);

            v1 = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 1}
            ]);
            v2 = new Vector([
                {'refper': '2018-01-01', 'value': 1}
            ]);
            assert.strictEqual(v1.equals(v2), false);
        });
    });

    describe('#copy', function() {
        const vector = new Vector([
            {'refper': '2018-01-01', 'value': 1, 'metadata': {'extra': 0}},
            {'refper': '2018-01-02', 'value': 2}
        ]);

        const result = vector.copy();

        it('should create a copy of a vector', function() {
            assert.ok(result.equals(vector));
        });

        it('should preserve user defined datapoint attributes', function() {
            assert.strictEqual(result.get(0).metadata.extra, 0);
        });
    });

    describe('#map', function() {
        it('should map a vector', function() {
            const vector = new Vector([
                {'refper': '2018-01-01', 'value': 0},
                {'refper': '2018-01-02', 'value': 1},
                {'refper': '2018-01-03', 'value': 2},
            ]);
            assert.deepStrictEqual(vector.map((p) => p.value), [0, 1, 2]);
        });

        it('should return an empty list when mapping an empty vector', () => {
            const vector = new Vector();
            assert.deepStrictEqual(vector.map((p) => p), []);
        });
    });

    describe('#find', function() {
        const vector = new Vector([
            {'refper': '2018-01-01', 'value': 0},
            {'refper': '2018-01-02', 'value': 1},
            {'refper': '2018-01-03', 'value': 2},
        ]);

        it('should find the first datapoint matching a predicate.', function() {
            const result = vector.find((p) => p.value == 1);
            if (result) {
                assert.strictEqual(result.refper, vector.get(1).refper);
            } else {
                assert.fail('find returned undefined');
            };
        });

        it('should return undefined if no match is found', function() {
            const result = vector.find((p) => p.value == -1);
            assert.strictEqual(result, undefined);
        });
    });

    describe('#filter', function() {
        it('should return a filtered vector based on a predicate', function() {
            const vector = new Vector([
                {'refper': '2018-01-01', 'value': 0},
                {'refper': '2018-01-02', 'value': 1},
                {'refper': '2018-01-03', 'value': 2},
            ]);
            const expected = new Vector([
                {'refper': '2018-01-01', 'value': 0},
                {'refper': '2018-01-03', 'value': 2},
            ]);
            const result = vector.filter((p) => (p.value || 0) % 2 == 0);
            assert.ok(result.equals(expected));
        });
    });

    describe('#range', function() {
        const vector = new Vector([
            {'refper': '2018-01-01', 'value': 0},
            {'refper': '2018-01-02', 'value': 1},
            {'refper': '2018-01-03', 'value': 2},
            {'refper': '2018-01-04', 'value': 3}
        ]);

        it('should return the given date range of a vector', function() {
            const expected = new Vector([
                {'refper': '2018-01-02', 'value': 1},
                {'refper': '2018-01-03', 'value': 2}
            ]);
            const result = vector.range('2018-01-02', '2018-01-03');
            assert.ok(result.equals(expected));
        });

        it('should return the empty vector if no periods are in range', () => {
            const result = vector.range('2020-01-01', '2020-12-31');
            assert.ok(result.equals(new Vector()));
        });

        it('should handle null values for startDate and endDate', function() {
            let result = vector.range(null, null);
            let expected = vector;
            assert.ok(result.equals(expected));

            result = vector.range('2018-01-02', null);
            expected = new Vector([
                {'refper': '2018-01-02', 'value': 1},
                {'refper': '2018-01-03', 'value': 2},
                {'refper': '2018-01-04', 'value': 3}
            ]);
            assert.ok(result.equals(expected));
            
            result = vector.range(null, '2018-01-02');
            expected = new Vector([
                {'refper': '2018-01-01', 'value': 0},
                {'refper': '2018-01-02', 'value': 1}
            ]);
            assert.ok(result.equals(expected));
        });

        it('should use only an end date if one parameter is given', function() {
            const result = vector.range('2018-01-02');
            const expected = new Vector([
                {'refper': '2018-01-01', 'value': 0},
                {'refper': '2018-01-02', 'value': 1}
            ]);
            assert.ok(result.equals(expected));
        });
    });

    describe('#latestN', function() {
        it('should return the latest N reference periods', function() {
            const vector = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2},
                {'refper': '2018-03-01', 'value': 3},
                {'refper': '2018-04-01', 'value': 4}
            ]);
            const expected = new Vector([
                {'refper': '2018-03-01', 'value': 3},
                {'refper': '2018-04-01', 'value': 4}
            ]);
            const result = vector.latestN(2);
            assert.ok(result.equals(expected));
        });
    });

    describe('#interoperable', function() {
        it('should return true if two vectors are interoperable', function() {
            const v1 = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2}
            ]);
            const v2 = new Vector([
                {'refper': '2018-01-01', 'value': 3},
                {'refper': '2018-02-01', 'value': 4}
            ]);
            assert.strictEqual(v1.interoperable(v2), true);
        });

        it('should return false if two vectors are not interoperable',
            function() {
                let v1 = new Vector([
                    {'refper': '2018-01-01', 'value': 1},
                    {'refper': '2018-02-01', 'value': 2}
                ]);
                let v2 = new Vector([
                    {'refper': '2018-01-01', 'value': 3},
                    {'refper': '2018-03-01', 'value': 4}
                ]);
                assert.strictEqual(v1.interoperable(v2), false);

                v1 = new Vector([
                    {'refper': '2018-01-01', 'value': 1},
                    {'refper': '2018-02-01', 'value': 2}
                ]);
                v2 = new Vector([
                    {'refper': '2018-01-01', 'value': 3}
                ]);
                assert.strictEqual(v1.interoperable(v2), false);
            });
    });

    describe('#intersection', function() {
        const v1 = new Vector([
            {'refper': '2018-01-01', 'value': 1},
            {'refper': '2018-02-01', 'value': 2},
            {'refper': '2018-03-01', 'value': 3},
            {'refper': '2018-04-01', 'value': 4},
            {'refper': '2018-05-01', 'value': 5},
            {'refper': '2018-06-01', 'value': 6}
        ]);
        const v2 = new Vector([
            {'refper': '2018-01-01', 'value': 11},
            {'refper': '2018-02-01', 'value': 12}
        ]);
        const v3 = new Vector([
            {'refper': '2018-05-01', 'value': 15},
            {'refper': '2018-06-01', 'value': 16}
        ]);
        const v4 = new Vector([
            {'refper': '2018-03-01', 'value': 13},
            {'refper': '2018-04-01', 'value': 14}
        ]);
        const v5 = new Vector([
            {'refper': '2018-01-01', 'value': 11}
        ]);
        const v6 = new Vector([
            {'refper': '2018-06-01', 'value': 16}
        ]);
        const v7 = new Vector();


        const v1Intv2 = new Vector([
            {'refper': '2018-01-01', 'value': 1},
            {'refper': '2018-02-01', 'value': 2}
        ]);
        const v1Intv3 = new Vector([
            {'refper': '2018-05-01', 'value': 5},
            {'refper': '2018-06-01', 'value': 6}
        ]);
        const v1Intv4 = new Vector([
            {'refper': '2018-03-01', 'value': 3},
            {'refper': '2018-04-01', 'value': 4}
        ]);
        const v1Intv5 = new Vector([
            {'refper': '2018-01-01', 'value': 1}
        ]);
        const v1Intv6 = new Vector([
            {'refper': '2018-06-01', 'value': 6}
        ]);
        const v1Intv7 = new Vector([]);
        const v1Intv2v5 = new Vector([
            {'refper': '2018-01-01', 'value': 1}
        ]);

        it('should intersect this vector with another', function() {
            assert.ok(v1.intersection(v2).equals(v1Intv2));
            assert.ok(v1.intersection(v3).equals(v1Intv3));
            assert.ok(v1.intersection(v4).equals(v1Intv4));
            assert.ok(v1.intersection(v5).equals(v1Intv5));
            assert.ok(v1.intersection(v6).equals(v1Intv6));
            assert.ok(v1.intersection(v7).equals(v1Intv7));
            assert.ok(v2.intersection(v1).equals(v2));
            assert.ok(v3.intersection(v1).equals(v3));
            assert.ok(v4.intersection(v1).equals(v4));
            assert.ok(v5.intersection(v1).equals(v5));
            assert.ok(v6.intersection(v1).equals(v6));
            assert.ok(v7.intersection(v1).equals(v7));
        });

        it('should allow intersecting with multiple vectors', function() {
            assert.ok(v1.intersection([v2, v5]).equals(v1Intv2v5));
        });

        it('should return an empty vector on an empty vector', () => {
            assert.ok(new Vector().intersection(v1).equals(new Vector()));
        });
    });

    describe('#sum', function() {
        it('should return the sum of a vector', function() {
            let vector = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2},
                {'refper': '2018-02-01', 'value': 3}
            ]);
            assert.strictEqual(vector.sum(), 6);

            vector = new Vector([
                {'refper': '2018-01-01', 'value': 1}
            ]);
            assert.strictEqual(vector.sum(), 1);

            vector = new Vector();
            assert.strictEqual(vector.sum(), 0);
        });
    });

    describe('#average', function() {
        it('should return the average of a vector', function() {
            let vector = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2},
                {'refper': '2018-02-01', 'value': 3}
            ]);
            assert.strictEqual(vector.average(), 2);

            vector = new Vector();
            assert.strictEqual(vector.average(), null);
        });
    });

    describe('#reduce', function() {
        it('should reduce a vector', function() {
            const vector = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2},
                {'refper': '2018-02-01', 'value': 3}
            ]);
            const result = vector.reduce(function(accumulator, curr) {
                return accumulator * curr;
            });
            assert.strictEqual(result, 6);
        });
    });

    describe('#operate', function() {
        it('should perform an operation on a vector', function() {
            const vectorA = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2}
            ]);
            const vectorB = new Vector([
                {'refper': '2018-01-01', 'value': 3},
                {'refper': '2018-02-01', 'value': 4}
            ]);
            const expected = new Vector([
                {'refper': '2018-01-01', 'value': 4},
                {'refper': '2018-02-01', 'value': 6}
            ]);

            const result = vectorA.operate(vectorB, (a, b) => a + b);
            assert.strictEqual(result.equals(expected), true);
        });
    });

    describe('#periodDeltaTransformation', function() {
        it('should return a transformed vector using delta func', function() {
            const vector = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2},
                {'refper': '2018-03-01', 'value': 3},
            ]);
            const result = vector.periodDeltaTransformation((curr, last) => {
                return curr + last;
            });
            assert.strictEqual(result.value(0), null);
            assert.strictEqual(result.value(1), 3);
            assert.strictEqual(result.value(2), 5);
        });
    });

    describe('samePeriodPreviousYearTransformation', function() {
        it('should perform a SPPY transformation', function() {
            const vector = new Vector([
                {'refper': '2018-03-31', 'value': 1},
                {'refper': '2018-06-30', 'value': 2},
                {'refper': '2018-09-30', 'value': 3},
                {'refper': '2018-12-31', 'value': 4},
                {'refper': '2019-03-31', 'value': 5},
                {'refper': '2019-06-30', 'value': 6},
                {'refper': '2019-09-30', 'value': 7},
                {'refper': '2019-12-31', 'value': 8}
            ]);
            const fn = (a: number, b: number) => a - b;
            const expected = new Vector([
                {'refper': '2018-03-31', 'value': null},
                {'refper': '2018-06-30', 'value': null},
                {'refper': '2018-09-30', 'value': null},
                {'refper': '2018-12-31', 'value': null},
                {'refper': '2019-03-31', 'value': 4},
                {'refper': '2019-06-30', 'value': 4},
                {'refper': '2019-09-30', 'value': 4},
                {'refper': '2019-12-31', 'value': 4}
            ]);
            const result = vector.samePeriodPreviousYearTransformation(fn);
            assert.strictEqual(result.equals(expected), true);
        });

        it('should handle the monthly frequency', function() {
            const vector = new Vector([
                {'refper': '2015-01-01', 'value': 0},
                {'refper': '2015-02-01', 'value': 0},
                {'refper': '2015-03-01', 'value': 0},
                {'refper': '2015-04-01', 'value': 0},
                {'refper': '2015-05-01', 'value': 0},
                {'refper': '2015-06-01', 'value': 0},
                {'refper': '2015-07-01', 'value': 0},
                {'refper': '2015-08-01', 'value': 0},
                {'refper': '2015-09-01', 'value': 0},
                {'refper': '2015-10-01', 'value': 0},
                {'refper': '2015-11-01', 'value': 0},
                {'refper': '2015-12-01', 'value': 0},
                {'refper': '2016-01-01', 'value': 0},
                {'refper': '2016-02-01', 'value': 0},
                {'refper': '2016-03-01', 'value': 0},
                {'refper': '2016-04-01', 'value': 0},
                {'refper': '2016-05-01', 'value': 0},
                {'refper': '2016-06-01', 'value': 0},
                {'refper': '2016-07-01', 'value': 0},
                {'refper': '2016-08-01', 'value': 0},
                {'refper': '2016-09-01', 'value': 0},
                {'refper': '2016-10-01', 'value': 0},
                {'refper': '2016-11-01', 'value': 0},
                {'refper': '2016-12-01', 'value': 0},
                {'refper': '2017-01-01', 'value': 0},
                {'refper': '2017-02-01', 'value': 0},
                {'refper': '2017-03-01', 'value': 0},
                {'refper': '2017-04-01', 'value': 0},
                {'refper': '2017-05-01', 'value': 0},
                {'refper': '2017-06-01', 'value': 0},
                {'refper': '2017-07-01', 'value': 0},
                {'refper': '2017-08-01', 'value': 0},
                {'refper': '2017-09-01', 'value': 0},
                {'refper': '2017-10-01', 'value': 0},
                {'refper': '2017-11-01', 'value': 0},
                {'refper': '2017-12-01', 'value': 0}
            ]);
            const fn = (a: number, b: number) => a - b;
            const expected = new Vector([
                {'refper': '2015-01-01', 'value': null},
                {'refper': '2015-02-01', 'value': null},
                {'refper': '2015-03-01', 'value': null},
                {'refper': '2015-04-01', 'value': null},
                {'refper': '2015-05-01', 'value': null},
                {'refper': '2015-06-01', 'value': null},
                {'refper': '2015-07-01', 'value': null},
                {'refper': '2015-08-01', 'value': null},
                {'refper': '2015-09-01', 'value': null},
                {'refper': '2015-10-01', 'value': null},
                {'refper': '2015-11-01', 'value': null},
                {'refper': '2015-12-01', 'value': null},
                {'refper': '2016-01-01', 'value': 0},
                {'refper': '2016-02-01', 'value': 0},
                {'refper': '2016-03-01', 'value': 0},
                {'refper': '2016-04-01', 'value': 0},
                {'refper': '2016-05-01', 'value': 0},
                {'refper': '2016-06-01', 'value': 0},
                {'refper': '2016-07-01', 'value': 0},
                {'refper': '2016-08-01', 'value': 0},
                {'refper': '2016-09-01', 'value': 0},
                {'refper': '2016-10-01', 'value': 0},
                {'refper': '2016-11-01', 'value': 0},
                {'refper': '2016-12-01', 'value': 0},
                {'refper': '2017-01-01', 'value': 0},
                {'refper': '2017-02-01', 'value': 0},
                {'refper': '2017-03-01', 'value': 0},
                {'refper': '2017-04-01', 'value': 0},
                {'refper': '2017-05-01', 'value': 0},
                {'refper': '2017-06-01', 'value': 0},
                {'refper': '2017-07-01', 'value': 0},
                {'refper': '2017-08-01', 'value': 0},
                {'refper': '2017-09-01', 'value': 0},
                {'refper': '2017-10-01', 'value': 0},
                {'refper': '2017-11-01', 'value': 0},
                {'refper': '2017-12-01', 'value': 0}
            ]);
            const result = vector.samePeriodPreviousYearTransformation(fn);
            assert.strictEqual(result.equals(expected), true);
        });
    });

    describe('#periodTransformation', function() {
        it('should return a transformed vector based on a function',
            function() {
                const vector = new Vector([
                    {'refper': '2018-01-01', 'value': 1},
                    {'refper': '2018-02-01', 'value': 2},
                    {'refper': '2018-03-01', 'value': 3},
                ]);
                const result = vector.periodTransformation((val) => val * 2);
                assert.strictEqual(result.value(0), 2);
                assert.strictEqual(result.value(1), 4);
                assert.strictEqual(result.value(2), 6);
            });
    });

    describe('#periodToPeriodPercentageChange', function() {
        it('should compute the percentage change vector', function() {
            const vector = new Vector([
                {'refper': '2018-01-01', 'value': 2},
                {'refper': '2018-01-02', 'value': 6},
                {'refper': '2018-01-03', 'value': 3},
            ]);

            const result = vector.periodToPeriodPercentageChange();
            assert.strictEqual(result.value(0), null);
            assert.strictEqual(result.value(1), 200.0);
            assert.strictEqual(result.value(2), -50.0);
        });

        it('should should handlea zero vector', function() {
            const vector = new Vector([
                {'refper': '2018-01-01', 'value': 0},
                {'refper': '2018-01-02', 'value': 0},
                {'refper': '2018-01-03', 'value': 0}
            ]);
            const result = vector.periodToPeriodDifference();
            const expected = new Vector([
                {'refper': '2018-01-01', 'value': null},
                {'refper': '2018-01-02', 'value': 0},
                {'refper': '2018-01-03', 'value': 0}
            ]);
            assert.ok(result.equals(expected));
        });
    });

    describe('#periodToPeriodDifference', function() {
        it('should compute the difference vector', function() {
            const vector = new Vector([
                {'refper': '2018-01-01', 'value': 2},
                {'refper': '2018-01-02', 'value': 6},
                {'refper': '2018-01-03', 'value': 4},
            ]);

            const result = vector.periodToPeriodDifference();
            const expected = new Vector([
                {'refper': '2018-01-01', 'value': null},
                {'refper': '2018-01-02', 'value': 4},
                {'refper': '2018-01-03', 'value': -2}
            ]);
            assert.ok(result.equals(expected));
        });

        it('should differentiate between zero and null', function() {
            const vector = new Vector([
                {'refper': '2018-01-01', 'value': 2},
                {'refper': '2018-01-02', 'value': 0},
                {'refper': '2018-01-03', 'value': 4}
            ]);
            const result = vector.periodToPeriodDifference();
            const expected = new Vector([
                {'refper': '2018-01-01', 'value': null},
                {'refper': '2018-01-02', 'value': -2},
                {'refper': '2018-01-03', 'value': 4}
            ]);
            assert.ok(result.equals(expected));
        });

        it('should should handlea zero vector', function() {
            const vector = new Vector([
                {'refper': '2018-01-01', 'value': 0},
                {'refper': '2018-01-02', 'value': 0},
                {'refper': '2018-01-03', 'value': 0}
            ]);
            const result = vector.periodToPeriodDifference();
            const expected = new Vector([
                {'refper': '2018-01-01', 'value': null},
                {'refper': '2018-01-02', 'value': 0},
                {'refper': '2018-01-03', 'value': 0}
            ]);
            assert.ok(result.equals(expected));
        });
    });

    describe('#samePeriodPreviousYearPercentageChange', function() {
        it('should compute the annualized percent change vector', function() {
            const vector = new Vector([
                {'refper': '2018-06-01', 'value': 1},
                {'refper': '2018-12-01', 'value': 2},
                {'refper': '2019-06-01', 'value': 4},
                {'refper': '2019-12-01', 'value': 8},
                {'refper': '2020-06-01', 'value': 4},
                {'refper': '2020-12-01', 'value': 4}
            ]);

            const expected = new Vector([
                {'refper': '2018-06-01', 'value': null},
                {'refper': '2018-12-01', 'value': null},
                {'refper': '2019-06-01', 'value': 300.0},
                {'refper': '2019-12-01', 'value': 300.0},
                {'refper': '2020-06-01', 'value': 0},
                {'refper': '2020-12-01', 'value': -50.0}
            ]);

            const result = vector.samePeriodPreviousYearPercentageChange();
            assert.strictEqual(result.equals(expected), true);
        });
    });

    describe('#samePeriodPreviousYearDifference', function() {
        it('should compute the annualized difference vector', function() {
            const vector = new Vector([
                {'refper': '2018-06-01', 'value': 0},
                {'refper': '2018-12-01', 'value': 2},
                {'refper': '2019-06-01', 'value': 0},
                {'refper': '2019-12-01', 'value': 6},
                {'refper': '2020-06-01', 'value': 0},
                {'refper': '2020-12-01', 'value': 4}
            ]);
            const expected = new Vector([
                {'refper': '2018-06-01', 'value': null},
                {'refper': '2018-12-01', 'value': null},
                {'refper': '2019-06-01', 'value': 0},
                {'refper': '2019-12-01', 'value': 4},
                {'refper': '2020-06-01', 'value': 0},
                {'refper': '2020-12-01', 'value': -2}
            ]);

            const result = vector.samePeriodPreviousYearDifference();
            assert.strictEqual(result.equals(expected), true);
        });
    });

    describe('#weekly', function() {
        it('should convert a vector to a weekly frequency', function() {
            const vector = new Vector([
                {'refper': '2019-02-11', 'value': 1},
                {'refper': '2018-02-12', 'value': 2},
                {'refper': '2019-02-13', 'value': 3},
                {'refper': '2019-02-14', 'value': 4},
                {'refper': '2019-02-15', 'value': 5},
                {'refper': '2019-02-18', 'value': 6},
                {'refper': '2019-02-19', 'value': 7},
                {'refper': '2019-02-20', 'value': 8},
                {'refper': '2019-02-21', 'value': 9},
                {'refper': '2019-02-22', 'value': 10}
            ]);

            const expected = new Vector([
                {'refper': '2019-02-15', 'value': 5},
                {'refper': '2019-02-22', 'value': 10}
            ]);
            const result = vector.weekly();
            assert.strictEqual(result.equals(expected), true);
        });
    });

    describe('#monthly', function() {
        it('should convert a vector to an annual frequency', function() {
            const vector = new Vector([
                {'refper': '2018-12-01', 'value': 1},
                {'refper': '2018-12-12', 'value': 2},
                {'refper': '2019-01-01', 'value': 3},
                {'refper': '2019-01-12', 'value': 4},
                {'refper': '2019-02-01', 'value': 5},
                {'refper': '2019-02-12', 'value': 6}
            ]);
            const expected = new Vector([
                {'refper': '2018-12-12', 'value': 2},
                {'refper': '2019-01-12', 'value': 4},
                {'refper': '2019-02-12', 'value': 6}
            ]);
            const result = vector.monthly();
            assert.strictEqual(result.equals(expected), true);
        });

        it('should handle monthly sums', function() {
            const vector = new Vector([
                {'refper': '2018-12-01', 'value': 1},
                {'refper': '2018-12-12', 'value': 2},
                {'refper': '2019-01-01', 'value': 3},
                {'refper': '2019-01-12', 'value': 4},
                {'refper': '2019-02-01', 'value': 5},
                {'refper': '2019-02-12', 'value': 6}
            ]);
            const expected = new Vector([
                {'refper': '2018-12-12', 'value': 3},
                {'refper': '2019-01-12', 'value': 7},
                {'refper': '2019-02-12', 'value': 11}
            ]);
            const result = vector.monthly('sum');
            assert.strictEqual(result.equals(expected), true);
        });

        it('should handle monthly averages', function() {
            const vector = new Vector([
                {'refper': '2018-12-01', 'value': 1},
                {'refper': '2018-12-12', 'value': 3},
                {'refper': '2019-01-01', 'value': 5},
                {'refper': '2019-01-12', 'value': 3},
                {'refper': '2019-02-01', 'value': 7},
                {'refper': '2019-02-12', 'value': 3}
            ]);
            const expected = new Vector([
                {'refper': '2018-12-12', 'value': 2},
                {'refper': '2019-01-12', 'value': 4},
                {'refper': '2019-02-12', 'value': 5}
            ]);
            const result = vector.monthly('average');
            assert.strictEqual(result.equals(expected), true);
        });

        it('should handle monthly maximums', function() {
            const vector = new Vector([
                {'refper': '2018-12-01', 'value': 1},
                {'refper': '2018-12-12', 'value': 3},
                {'refper': '2019-01-01', 'value': 5},
                {'refper': '2019-01-12', 'value': 3},
                {'refper': '2019-02-01', 'value': 7},
                {'refper': '2019-02-12', 'value': 3}
            ]);
            const expected = new Vector([
                {'refper': '2018-12-12', 'value': 3},
                {'refper': '2019-01-12', 'value': 5},
                {'refper': '2019-02-12', 'value': 7}
            ]);
            const result = vector.monthly('max');
            assert.strictEqual(result.equals(expected), true);
        });

        it('should handle monthly minimums', function() {
            const vector = new Vector([
                {'refper': '2018-12-01', 'value': 1},
                {'refper': '2018-12-12', 'value': 3},
                {'refper': '2019-01-01', 'value': 5},
                {'refper': '2019-01-12', 'value': 3},
                {'refper': '2019-02-01', 'value': 7},
                {'refper': '2019-02-12', 'value': 3}
            ]);
            const expected = new Vector([
                {'refper': '2018-12-12', 'value': 1},
                {'refper': '2019-01-12', 'value': 3},
                {'refper': '2019-02-12', 'value': 3}
            ]);
            const result = vector.monthly('min');
            assert.strictEqual(result.equals(expected), true);
        });
    });

    describe('#biMonthly', function() {
        it('should convert a vector to a bi-monthly frequency', function() {
            const vector = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2},
                {'refper': '2019-03-01', 'value': 3},
                {'refper': '2019-04-01', 'value': 4},
                {'refper': '2019-05-01', 'value': 5},
                {'refper': '2019-06-01', 'value': 6},
                {'refper': '2019-07-01', 'value': 7},
                {'refper': '2019-08-01', 'value': 8},
                {'refper': '2019-09-01', 'value': 9},
                {'refper': '2019-10-01', 'value': 10},
                {'refper': '2019-11-01', 'value': 11},
                {'refper': '2019-12-01', 'value': 12}
            ]);

            const expected = new Vector([
                {'refper': '2018-02-01', 'value': 2},
                {'refper': '2019-04-01', 'value': 4},
                {'refper': '2019-06-01', 'value': 6},
                {'refper': '2019-08-01', 'value': 8},
                {'refper': '2019-10-01', 'value': 10},
                {'refper': '2019-12-01', 'value': 12}
            ]);
            const result = vector.biMonthly();
            assert.strictEqual(result.equals(expected), true);
        });
    });

    describe('#quarter', function() {
        it('should convert a vector to a quarterly frequency', function() {
            const vector = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2},
                {'refper': '2019-03-01', 'value': 3},
                {'refper': '2019-04-01', 'value': 4},
                {'refper': '2019-05-01', 'value': 5},
                {'refper': '2019-06-01', 'value': 6},
                {'refper': '2019-07-01', 'value': 7},
                {'refper': '2019-08-01', 'value': 8},
                {'refper': '2019-09-01', 'value': 9},
                {'refper': '2019-10-01', 'value': 10},
                {'refper': '2019-11-01', 'value': 11},
                {'refper': '2019-12-01', 'value': 12}
            ]);

            const expected = new Vector([
                {'refper': '2019-03-01', 'value': 3},
                {'refper': '2019-06-01', 'value': 6},
                {'refper': '2019-09-01', 'value': 9},
                {'refper': '2019-12-01', 'value': 12}
            ]);
            const result = vector.quarterly();
            assert.strictEqual(result.equals(expected), true);
        });
    });

    describe('#semiAnnual', function() {
        it('should convert vector to a semi-annual frequency', function() {
            const vector = new Vector([
                {'refper': '2018-03-01', 'value': 1},
                {'refper': '2018-06-01', 'value': 2},
                {'refper': '2018-09-01', 'value': 3},
                {'refper': '2018-12-01', 'value': 4},
                {'refper': '2019-03-01', 'value': 5},
                {'refper': '2019-06-01', 'value': 6},
                {'refper': '2019-09-01', 'value': 7},
                {'refper': '2019-12-01', 'value': 8},
                {'refper': '2020-03-01', 'value': 9},
                {'refper': '2020-06-01', 'value': 10},
                {'refper': '2020-09-01', 'value': 11},
                {'refper': '2020-12-01', 'value': 12}
            ]);
            const expected = new Vector([
                {'refper': '2018-06-01', 'value': 2},
                {'refper': '2018-12-01', 'value': 4},
                {'refper': '2019-06-01', 'value': 6},
                {'refper': '2019-12-01', 'value': 8},
                {'refper': '2020-06-01', 'value': 10},
                {'refper': '2020-12-01', 'value': 12}
            ]);
            const result = vector.semiAnnual();
            assert.strictEqual(result.equals(expected), true);
        });
    });

    describe('#annual', function() {
        it('should convert a vector to an annual frequency', function() {
            let vector = new Vector([
                {'refper': '2018-03-01', 'value': 0},
                {'refper': '2018-06-01', 'value': 0},
                {'refper': '2018-09-01', 'value': 0},
                {'refper': '2018-12-01', 'value': 0},
                {'refper': '2019-03-01', 'value': 0}
            ]);
            let result = vector.annual();
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result.refperStr(0), '2018-12-01');

            vector = new Vector([
                {'refper': '2018-06-01', 'value': 0},
                {'refper': '2018-12-01', 'value': 0},
                {'refper': '2019-06-01', 'value': 0},
                {'refper': '2019-12-01', 'value': 0},
                {'refper': '2019-12-02', 'value': 0},
                {'refper': '2020-06-01', 'value': 0},
                {'refper': '2020-12-01', 'value': 0},
                {'refper': '2020-12-02', 'value': 0}
            ]);
            result = vector.annual();
            assert.strictEqual(result.length, 2);
            assert.strictEqual(result.refperStr(0), '2019-12-02');
            assert.strictEqual(result.refperStr(1), '2020-12-02');


            vector = new Vector([
                {'refper': '2018-06-01', 'value': 0},
                {'refper': '2018-12-01', 'value': 0}
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

            vector = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-04-01', 'value': 2},
                {'refper': '2018-07-01', 'value': 3},
                {'refper': '2018-10-01', 'value': 4},
                {'refper': '2019-01-01', 'value': 5},
                {'refper': '2019-04-01', 'value': 6},
                {'refper': '2019-07-01', 'value': 7},
                {'refper': '2019-10-01', 'value': 8},
                {'refper': '2020-01-01', 'value': 9}
            ]);
            const expected = new Vector([
                {'refper': '2018-10-01', 'value': 4},
                {'refper': '2019-10-01', 'value': 8},
            ]);
            result = vector.annual();
            assert.strictEqual(result.equals(expected), true);
        });
    });

    describe('#biAnnual', function() {
        it('should convert vector to a bi-annual frequency', function() {
            let vector = new Vector([
                {'refper': '2018-01-31', 'value': 1},
                {'refper': '2019-01-31', 'value': 2},
                {'refper': '2020-01-31', 'value': 3},
                {'refper': '2021-01-31', 'value': 4},
                {'refper': '2022-01-31', 'value': 5},
                {'refper': '2023-01-31', 'value': 6},
                {'refper': '2024-01-31', 'value': 7},
                {'refper': '2025-01-31', 'value': 8},
                {'refper': '2026-01-31', 'value': 9},
                {'refper': '2027-01-31', 'value': 10},
                {'refper': '2028-01-31', 'value': 11},
                {'refper': '2029-01-31', 'value': 12},
                {'refper': '2030-01-31', 'value': 13},
            ]);
            let expected = new Vector([
                {'refper': '2020-01-31', 'value': 3},
                {'refper': '2022-01-31', 'value': 5},
                {'refper': '2024-01-31', 'value': 7},
                {'refper': '2026-01-31', 'value': 9},
                {'refper': '2028-01-31', 'value': 11},
                {'refper': '2030-01-31', 'value': 13}
            ]);
            let result = vector.biAnnual();
            assert.strictEqual(result.equals(expected), true);

            vector = new Vector([
                {'refper': '2018-03-01', 'value': 1},
                {'refper': '2018-06-01', 'value': 2},
                {'refper': '2018-09-01', 'value': 3},
                {'refper': '2018-12-01', 'value': 4},
                {'refper': '2019-03-01', 'value': 5},
                {'refper': '2019-06-01', 'value': 6},
                {'refper': '2019-09-01', 'value': 7},
                {'refper': '2019-12-01', 'value': 8},
                {'refper': '2020-03-01', 'value': 9},
                {'refper': '2020-06-01', 'value': 10},
                {'refper': '2020-09-01', 'value': 11},
                {'refper': '2020-12-01', 'value': 12},
                {'refper': '2021-03-31', 'value': 13},
            ]);
            expected = new Vector([
                {'refper': '2020-12-01', 'value': 12},
            ]);
            result = vector.biAnnual();
            assert.strictEqual(result.equals(expected), true);
        });
    });

    describe('#triAnnual', function() {
        it('should convert vector to a tri-annual frequency', function() {
            const vector = new Vector([
                {'refper': '2018-01-31', 'value': 1},
                {'refper': '2019-01-31', 'value': 2},
                {'refper': '2020-01-31', 'value': 3},
                {'refper': '2021-01-31', 'value': 4},
                {'refper': '2022-01-31', 'value': 5},
                {'refper': '2023-01-31', 'value': 6},
                {'refper': '2024-01-31', 'value': 7},
                {'refper': '2025-01-31', 'value': 8},
                {'refper': '2026-01-31', 'value': 9},
                {'refper': '2027-01-31', 'value': 10},
                {'refper': '2028-01-31', 'value': 11},
                {'refper': '2029-01-31', 'value': 12},
                {'refper': '2030-01-31', 'value': 13},
            ]);
            const expected = new Vector([
                {'refper': '2021-01-31', 'value': 4},
                {'refper': '2024-01-31', 'value': 7},
                {'refper': '2027-01-31', 'value': 10},
                {'refper': '2030-01-31', 'value': 13}
            ]);
            const result = vector.triAnnual();
            assert.strictEqual(result.equals(expected), true);
        });
    });

    describe('#quadrennial', function() {
        it('should convert vector to a quadrennial frequency', function() {
            const vector = new Vector([
                {'refper': '2018-01-31', 'value': 1},
                {'refper': '2019-01-31', 'value': 2},
                {'refper': '2020-01-31', 'value': 3},
                {'refper': '2021-01-31', 'value': 4},
                {'refper': '2022-01-31', 'value': 5},
                {'refper': '2023-01-31', 'value': 6},
                {'refper': '2024-01-31', 'value': 7},
                {'refper': '2025-01-31', 'value': 8},
                {'refper': '2026-01-31', 'value': 9},
                {'refper': '2027-01-31', 'value': 10},
                {'refper': '2028-01-31', 'value': 11},
                {'refper': '2029-01-31', 'value': 12},
                {'refper': '2030-01-31', 'value': 13},
            ]);
            const expected = new Vector([
                {'refper': '2022-01-31', 'value': 5},
                {'refper': '2026-01-31', 'value': 9},
                {'refper': '2030-01-31', 'value': 13}
            ]);
            const result = vector.quadrennial();
            assert.strictEqual(result.equals(expected), true);
        });
    });

    describe('#quinquennial', function() {
        it('should convert vector to a quinquennial frequency', function() {
            const vector = new Vector([
                {'refper': '2018-01-31', 'value': 1},
                {'refper': '2019-01-31', 'value': 2},
                {'refper': '2020-01-31', 'value': 3},
                {'refper': '2021-01-31', 'value': 4},
                {'refper': '2022-01-31', 'value': 5},
                {'refper': '2023-01-31', 'value': 6},
                {'refper': '2024-01-31', 'value': 7},
                {'refper': '2025-01-31', 'value': 8},
                {'refper': '2026-01-31', 'value': 9},
                {'refper': '2027-01-31', 'value': 10},
                {'refper': '2028-01-31', 'value': 11},
                {'refper': '2029-01-31', 'value': 12},
                {'refper': '2030-01-31', 'value': 13},
            ]);
            const expected = new Vector([
                {'refper': '2025-01-31', 'value': 8},
                {'refper': '2030-01-31', 'value': 13}
            ]);
            const result = vector.quinquennial();
            assert.strictEqual(result.equals(expected), true);
        });
    });

    describe('#round', function() {
        it('should round values in a vector', function() {
            const vector = new Vector([
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

        it('should round 0 to 0', function() {
            const vector = new Vector([{'refper': '2018-01-01', 'value': 0}]);
            const expected = new Vector([{'refper': '2018-01-01', 'value': 0}]);
            const result1 = vector.round();
            const result2 = vector.round(1);
            assert.ok(result1.equals(expected));
            assert.ok(result2.equals(expected));
        });
    });

    describe('#roundBannkers', function() {
        it('should Banker\'s round values in a vector', function() {
            const vector = new Vector([
                {'refper': '2018-01-01', 'value': 1.5},
                {'refper': '2018-01-02', 'value': 2.5}
            ]);

            const result = vector.roundBankers();
            assert.strictEqual(result.value(0), 2);
            assert.strictEqual(result.value(1), 2);
        });

        it('should round 0 to 0', function() {
            const vector = new Vector([{'refper': '2018-01-01', 'value': 0}]);
            const expected = new Vector([{'refper': '2018-01-01', 'value': 0}]);
            const result1 = vector.roundBankers();
            const result2 = vector.roundBankers(1);
            assert.ok(result1.equals(expected));
            assert.ok(result2.equals(expected));
        });
    });

    describe('#json', function() {
        it('should convert a vector to a JSON array', function() {
            const vector = new Vector([
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-02-01', 'value': 2}
            ]);
            const result = vector.json();

            const newVector = new Vector(JSON.parse(result));
            assert.strictEqual(vector.equals(newVector), true);
        });
    });
});

describe('VectorLib', function() {
    describe('#validate', function() {
        it('should validate vector expresions', function() {
            assert.deepStrictEqual(
                vlib.validate(''),
                {type: 'token', position: 0}
            );
    
            assert.deepStrictEqual(
                vlib.validate('+'),
                {type: 'token', position: 1}
            );
    
            assert.deepStrictEqual(
                vlib.validate('v1'),
                undefined
            );
     
            assert.deepStrictEqual(
                vlib.validate('(v1 + v2) * (2*v3)'),
                undefined
            );
    
            assert.deepStrictEqual(
                vlib.validate('+ v1'),
                {type: 'token', position: 1}
            );
    
            assert.deepStrictEqual(
                vlib.validate('v1 +'),
                {type: 'token', position: 4}
            );
    
            assert.deepStrictEqual(
                vlib.validate('v1 +-'),
                {type: 'token', position: 5}
            );
    
            assert.deepStrictEqual(
                vlib.validate('0..5 * v1'),
                {type: 'token', position: 3}
            );
    
            assert.deepStrictEqual(
                vlib.validate('((v1)'),
                {type: 'bracket', position: 5}
            );
    
            assert.deepStrictEqual(
                vlib.validate('(v1))'),
                {type: 'bracket', position: 5}
            );
    
            assert.deepStrictEqual(
                vlib.validate('v1 ) + (v2)'),
                {type: 'bracket', position: 4}
            );
        });
    });

    describe('#evaluate', function() {
        const itVexp = (vexp: string, expected: Vector) => {
            it(`${vexp} should equal ${JSON.stringify(expected)}`, () => {
                const result = vlib.evaluate(vexp, vectors);
                assert.strictEqual(result.equals(expected), true);
            });
        };

        let vexp = '(v1 + v2) * (2*v3)';
        let expected = new Vector([
            {'refper': '2018-01-01', 'value': 16},
            {'refper': '2018-02-01', 'value': 24}
        ]);
        itVexp(vexp, expected);

        vexp = '-1 * v1';
        expected = new Vector([
            {'refper': '2018-01-01', 'value': -1},
            {'refper': '2018-02-01', 'value': -2}
        ]);
        itVexp(vexp, expected);

        vexp = 'v1 * -1';
        expected = new Vector([
            {'refper': '2018-01-01', 'value': -1},
            {'refper': '2018-02-01', 'value': -2}
        ]);
        itVexp(vexp, expected);

        vexp = 'v1 + 1.5';
        expected = new Vector([
            {'refper': '2018-01-01', 'value': 2.5},
            {'refper': '2018-02-01', 'value': 3.5}
        ]);
        itVexp(vexp, expected);

        vexp = 'v1 - 1.5';
        expected = new Vector([
            {'refper': '2018-01-01', 'value': -0.5},
            {'refper': '2018-02-01', 'value': 0.5}
        ]);
        itVexp(vexp, expected);

        vexp = '(v1 - v2) * (2*v3)';
        expected = new Vector([
            {'refper': '2018-01-01', 'value': -8},
            {'refper': '2018-02-01', 'value': -8}
        ]);
        itVexp(vexp, expected);

        vexp = 'v6 - v5 - v4';
        expected = new Vector([
            {'refper': '2018-01-01', 'value': 2},
            {'refper': '2018-02-01', 'value': 1},
            {'refper': '2018-03-01', 'value': 0}
        ]);
        itVexp(vexp, expected);

        vexp = 'v1 * (v2 * (v3 + v1))';
        expected = new Vector([
            {'refper': '2018-01-01', 'value': 9},
            {'refper': '2018-02-01', 'value': 32}
        ]);
        itVexp(vexp, expected);

        vexp = 'v1';
        expected = vectors['1'];
        itVexp(vexp, expected);

        vexp = 'V10';
        expected = vectors['10'];
        itVexp(vexp, expected);

        it ('should detect syntax errors', () => {
            try {
                vexp = 'v1 $ v2';
                vlib.evaluate(vexp, vectors);
                assert.fail('Error was not caught');
            } catch (err) {
                assert.strictEqual(
                    err.message, 'Error parsing character at position 4');
            }
    
            try {
                vexp = 'v1 + + v2';
                vlib.evaluate(vexp, vectors);
                assert.fail('Error was not caught');
            } catch (err) {
                assert.strictEqual(
                    err.message, 'Error parsing character at position 6');
            }
    
            try {
                vexp = 'v1 v2 +';
                vlib.evaluate(vexp, vectors);
                assert.fail('Error was not caught');
            } catch (err) {
                assert.strictEqual(
                    err.message, 'Error parsing character at position 4');
            }
    
            try {
                vexp = 'v1 + ((v2 * 2)';
                vlib.evaluate(vexp, vectors);
                assert.fail('Error was not caught');
            } catch (err) {
                assert.strictEqual(
                    err.message, 'Invalid bracket at position 14');
            }
        });
    });

    describe('#getVectorIds', function() {
        it('should return the list of vector IDs in a string', function() {
            const ids = vlib.getVectorIds('(v1 + v22) * (2*v3)');
            assert.deepStrictEqual(ids, ['1', '22', '3']);
        });

        it('should detect uppercase and lowercase Vs', function() {
            const ids = vlib.getVectorIds('(V1 + v2) * (2*V3)');
            assert.deepStrictEqual(ids, ['1', '2', '3']);
        });

        it('should handle a single vector ID', function() {
            assert.deepStrictEqual(vlib.getVectorIds('v10'), ['10']);
        });

        it('should not return duplicates', function() {
            const ids = vlib.getVectorIds('v1 + v2 + v2 + v3');
            assert.deepStrictEqual(ids, ['1', '2', '3']);
        });

        it('should not detect a single number as a vector id', function() {
            assert.deepStrictEqual(vlib.getVectorIds('0'), []);
            assert.deepStrictEqual(vlib.getVectorIds('10'), []);
            assert.deepStrictEqual(vlib.getVectorIds('1.0'), []);
            assert.deepStrictEqual(vlib.getVectorIds('1v2'), ['2']);
        });
    });

    describe('#generateDaily', function() {
        it('should generate a daily vector given a list of values', () => {
            let values = [0, 1, 2];
            let vector = vlib.generateDaily(values, '2018-12-30');
            let expected = new Vector([
                {'refper': '2018-12-30', 'value': 0},
                {'refper': '2018-12-31', 'value': 1},
                {'refper': '2019-01-01', 'value': 2}
            ]);
            assert.strictEqual(vector.equals(expected), true);

            values = [];
            vector = vlib.generateDaily(values, '2018-12-30');
            expected = new Vector();
            assert.strictEqual(vector.equals(expected), true);
        });
    });

    describe('#generateWeekly', function() {
        it('should generate a weekly vector given a list of values', () => {
            const values = [0, 1, 2];
            const vector = vlib.generateWeekly(values, '2018-12-30');
            const expected = new Vector([
                {'refper': '2018-12-30', 'value': 0},
                {'refper': '2019-01-06', 'value': 1},
                {'refper': '2019-01-13', 'value': 2}
            ]);
            assert.strictEqual(vector.equals(expected), true);
        });
    });

    describe('#generateMonthly', function() {
        it('should generate a monthly vector given a list of values', () => {
            const values = [0, 1, 2];
            const vector = vlib.generateMonthly(values, '2018-12-30');
            const expected = new Vector([
                {'refper': '2018-12-31', 'value': 0},
                {'refper': '2019-01-31', 'value': 1},
                {'refper': '2019-02-28', 'value': 2}
            ]);
            assert.strictEqual(vector.equals(expected), true);
        });
    });

    describe('#generateBiMonthly', function() {
        it('should generate a bi-monthly vector given a list of values', () => {
            const values = [0, 1, 2];
            const vector = vlib.generateBiMonthly(values, '2018-12-30');
            const expected = new Vector([
                {'refper': '2018-12-31', 'value': 0},
                {'refper': '2019-02-28', 'value': 1},
                {'refper': '2019-04-30', 'value': 2}
            ]);
            assert.strictEqual(vector.equals(expected), true);
        });
    });

    describe('#generateQuarterly', function() {
        it('should generate a quarterly vector given a list of values', () => {
            const values = [0, 1, 2];
            const vector = vlib.generateQuarterly(values, '2018-12-30');
            const expected = new Vector([
                {'refper': '2018-12-31', 'value': 0},
                {'refper': '2019-03-31', 'value': 1},
                {'refper': '2019-06-30', 'value': 2}
            ]);
            assert.strictEqual(vector.equals(expected), true);
        });
    });

    describe('#generateSemiAnnual', function() {
        it('should generate a semiannual vector given a list of values', () => {
            const values = [0, 1, 2];
            const vector = vlib.generateSemiAnnual(values, '2018-12-30');
            const expected = new Vector([
                {'refper': '2018-12-31', 'value': 0},
                {'refper': '2019-06-30', 'value': 1},
                {'refper': '2019-12-31', 'value': 2}
            ]);
            assert.strictEqual(vector.equals(expected), true);
        });
    });

    describe('#generateAnnual', function() {
        it('should generate a annual vector given a list of values', () => {
            const values = [0, 1, 2];
            const vector = vlib.generateAnnual(values, '2018-12-30');
            const expected = new Vector([
                {'refper': '2018-12-31', 'value': 0},
                {'refper': '2019-12-31', 'value': 1},
                {'refper': '2020-12-31', 'value': 2}
            ]);
            assert.strictEqual(vector.equals(expected), true);
        });
    });

    describe('#generateBiAnnual', function() {
        it('should generate a biannual vector given a list of values', () => {
            const values = [0, 1, 2];
            const vector = vlib.generateBiAnnual(values, '2018-12-30');
            const expected = new Vector([
                {'refper': '2018-12-31', 'value': 0},
                {'refper': '2020-12-31', 'value': 1},
                {'refper': '2022-12-31', 'value': 2}
            ]);
            assert.strictEqual(vector.equals(expected), true);
        });
    });

    describe('#generateTriAnnual', function() {
        it('should generate a tri-annual vector given a list of values', () => {
            const values = [0, 1, 2];
            const vector = vlib.generateTriAnnual(values, '2018-12-30');
            const expected = new Vector([
                {'refper': '2018-12-31', 'value': 0},
                {'refper': '2021-12-31', 'value': 1},
                {'refper': '2024-12-31', 'value': 2}
            ]);
            assert.strictEqual(vector.equals(expected), true);
        });
    });

    describe('#generateQuadrennial', function() {
        it('should generate a quadrennial vector from a list of values', () => {
            const values = [0, 1, 2];
            const vector = vlib.generateQuadrennial(values, '2018-12-30');
            const expected = new Vector([
                {'refper': '2018-12-31', 'value': 0},
                {'refper': '2022-12-31', 'value': 1},
                {'refper': '2026-12-31', 'value': 2}
            ]);
            assert.strictEqual(vector.equals(expected), true);
        });
    });

    describe('#generateQuinquennial', function() {
        it('should generate quinquennial vector given a value list', () => {
            const values = [0, 1, 2];
            const vector = vlib.generateQuinquennial(values, '2018-12-30');
            const expected = new Vector([
                {'refper': '2018-12-31', 'value': 0},
                {'refper': '2023-12-31', 'value': 1},
                {'refper': '2028-12-31', 'value': 2}
            ]);
            assert.strictEqual(vector.equals(expected), true);
        });
    });
});
