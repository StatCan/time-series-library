let assert = require('assert');

let VectorLib = require('./vector_lib.js');
let vlib = new VectorLib();

describe('VectorLib', function() {
    describe('#equals', function() {
        it("should return true if two vectors are equal", function() {
            let v1 = [
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2}
            ];
            let v2 = [
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2}
            ];
            assert.strictEqual(vlib.equals(v1, v2), true);
        });

        it("should return false if two vectors are not equal", function() {
            let v1 = [
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 1}
            ];
            let v2 = [
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2}
            ];
            assert.strictEqual(vlib.equals(v1, v2), false);

            v1 = [
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 1}
            ];
            v2 = [
                {'refper': "2018-01-01", 'value': 1}
            ]; 
            assert.strictEqual(vlib.equals(v1, v2), false);
        });
    });

    describe('#evaluate', function() {
        it("should handle vector arithmetic", function() {
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

            let vexp = "(v1 + v2) * (2*v3)"
            let expected = [
                {'refper': "2018-01-01", 'value': 16},
                {'refper': "2018-02-01", 'value': 24}
            ];
            let result = vlib.evaluate(vexp, vectors);
            assert.strictEqual(vlib.equals(result, expected), true);

            vexp = "(v1 - v2) * (2*v3)";
            expected = [
                {'refper': "2018-01-01", 'value': -8},
                {'refper': "2018-02-01", 'value': -8}
            ];
            result = vlib.evaluate(vexp, vectors);
            assert.strictEqual(vlib.equals(result, expected), true);

            vexp = "v6 - v5 - v4";
            expected = [
                {'refper': "2018-01-01", 'value': 2},
                {'refper': "2018-02-01", 'value': 1},
                {'refper': "2018-03-01", 'value': 0}
            ];
            result = vlib.evaluate(vexp, vectors);
            assert.strictEqual(vlib.equals(result, expected), true);
        });
    });

    describe('#intersection', function() {
        it("should return the intersections of a set of vectors", function() {
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

            let expected1 = [{'refper': "2018-01-01", 'value': 1}];
            let expected2 = [{'refper': "2018-01-01", 'value': 3}];
            let expected3 = [{'refper': "2018-01-01", 'value': 2}];

            let intersection = vlib.intersection([v1, v2, v3]);

            assert.strictEqual(vlib.equals(intersection[0], expected1), true);
            assert.strictEqual(vlib.equals(intersection[1], expected2), true);
            assert.strictEqual(vlib.equals(intersection[2], expected3), true);
        });
    });

    describe('#getVectorIds', function() {
        it("should return the list of vector IDs in a string", function() {
            let ids = vlib.getVectorIds("(v1 + v2) * (2*v3)");
            assert.strictEqual(ids.length, 3);
            assert.strictEqual(ids[0], 1);
            assert.strictEqual(ids[0], 3);
            assert.strictEqual(ids[0], 2);
        });
    });
});