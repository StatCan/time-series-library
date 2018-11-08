let assert = require('assert');
let VectorLib = require('./vector_lib.js');

describe('VectorLib', function() {
    describe('#evaluate', function() {
        it("should handle vector arithmetic", function() {
            let vlib = new VectorLib();

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
});