import * as assert from 'assert';

import Vector from './src/vector';

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
            const result = vector.find((p) => false);
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
            const result = vector.filter((p) => p.value % 2 == 0);
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
});
