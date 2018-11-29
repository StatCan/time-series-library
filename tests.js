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

    describe('#interoperable', function() {
        it("should return true if two vectors are interoperable", function() {
            let v1 = [
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2}
            ];
            let v2 = [
                {'refper': "2018-01-01", 'value': 3},
                {'refper': "2018-02-01", 'value': 4}
            ];
            assert.strictEqual(vlib.interoperable(v1, v2), true);
        });

        it("should return false if two vectors are not interoperable", 
                function() {
            let v1 = [
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2}
            ];
            let v2 = [
                {'refper': "2018-01-01", 'value': 3},
                {'refper': "2018-03-01", 'value': 4}
            ];
            assert.strictEqual(vlib.interoperable(v1, v2), false);

            v1 = [
                {'refper': "2018-01-01", 'value': 1},
                {'refper': "2018-02-01", 'value': 2}
            ];
            v2 = [
                {'refper': "2018-01-01", 'value': 3}
            ]; 
            assert.strictEqual(vlib.interoperable(v1, v2), false);
        });
    });

    describe('#evaluate', function() {
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

        let itVexp = function(vexp, expected) {
            it (vexp + " should equal " + JSON.stringify(expected), function() {
                let result = vlib.evaluate(vexp, vectors);
                assert.strictEqual(vlib.equals(result, expected), true);
            });
        };

        let expected = [
            {'refper': "2018-01-01", 'value': 16},
            {'refper': "2018-02-01", 'value': 24}
        ];
        let vexp = "(v1 + v2) * (2*v3)";
        itVexp(vexp, expected);

        vexp = "(v1 - v2) * (2*v3)";
        expected = [
            {'refper': "2018-01-01", 'value': -8},
            {'refper': "2018-02-01", 'value': -8}
        ];
        itVexp(vexp, expected);

        vexp = "v6 - v5 - v4";
        expected = [
            {'refper': "2018-01-01", 'value': 2},
            {'refper': "2018-02-01", 'value': 1},
            {'refper': "2018-03-01", 'value': 0}
        ];       
        itVexp(vexp, expected);

        vexp = ""
    });

    describe('#intersection', function() {
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

        it("should return the intersections of a set of vectors", function() {
            let intersection = vlib.intersection([v1, v2, v3]);

            assert.strictEqual(vlib.equals(intersection[0], expected1), true);
            assert.strictEqual(vlib.equals(intersection[1], expected2), true);
            assert.strictEqual(vlib.equals(intersection[2], expected3), true);
        });

        it("should handle dictionaries of ID->vector", function() {
            let dict = {'v1': v1, 'v2': v2, 'v3': v3};
            let intersection = vlib.intersection(dict);

            assert.strictEqual(vlib.equals(intersection.v1, expected1), true);
            assert.strictEqual(vlib.equals(intersection.v2, expected2), true);
            assert.strictEqual(vlib.equals(intersection.v3, expected3), true);
        });
    });

    describe('#copy', function() {
        it("should create a copy of a vector", function() {
            let vector = [
                {'refper': '2018-01-01', 'value': 1},
                {'refper': '2018-01-02', 'value': 2}
            ];
    
            let result = vlib.copy(vector);
            assert.strictEqual(result[0].refper, '2018-01-01');
            assert.strictEqual(result[1].refper, '2018-01-02');
            assert.strictEqual(result[0].value, 1);
            assert.strictEqual(result[1].value, 2);
        });
    });

    describe('#periodToPeriodPercentageChange', function() {
        it("should compute the percentage change vector", function() {
            let vector = [
                {'refper': '2018-01-01', 'value': 2},
                {'refper': '2018-01-02', 'value': 6},
                {'refper': '2018-01-03', 'value': 3},
            ];

            let result = vlib.periodToPeriodPercentageChange(vector);
            assert.strictEqual(result[0].value, null);
            assert.strictEqual(result[1].value, 200.0);
            assert.strictEqual(result[2].value, -50.0);
        });
    });

    describe('#periodToPeriodDifference', function() {
        it("should compute the difference vector", function() {
            let vector = [
                {'refper': '2018-01-01', 'value': 2},
                {'refper': '2018-01-02', 'value': 6},
                {'refper': '2018-01-03', 'value': 4},
            ];

            let result = vlib.periodToPeriodDifference(vector);
            assert.strictEqual(result[0].value, null);
            assert.strictEqual(result[1].value, 4);
            assert.strictEqual(result[2].value, -2);
        });
    });

    describe('#round', function() {
        it("should round values in a vector", function() {
            let vector = [
                {'refper': '2018-01-01', 'value': 1.555},
                {'refper': '2018-01-02', 'value': 1.554}
            ];
    
            let result = vlib.round(vlib.copy(vector), 2);
            assert.strictEqual(result[0].value, 1.56);
            assert.strictEqual(result[1].value, 1.55);
    
            result = vlib.round(vlib.copy(vector));
            assert.strictEqual(result[0].value, 2);
            assert.strictEqual(result[1].value, 2);
        });
    });

    describe('#roundBannkers', function() {
        it("should Banker's round values in a vector", function() {
            let vector = [
                {'refper': '2018-01-01', 'value': 1.5},
                {'refper': '2018-01-02', 'value': 2.5}
            ];
    
            let result = vlib.roundBankers(vlib.copy(vector));
            assert.strictEqual(result[0].value, 2);
            assert.strictEqual(result[1].value, 2);
        });
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

    describe('#filter', function() {
        it("should return a filtered vector based on a predicate", function() {
            let vector = [
                {'refper': '2018-01-01', 'value': 0},
                {'refper': '2018-01-02', 'value': 1},
                {'refper': '2018-01-03', 'value': 2},
            ];
            result = vlib.filter(vector, p => p.value % 2 == 0);
            assert.strictEqual(result[0].value, 0);
            assert.strictEqual(result[1].value, 2);
            assert.strictEqual(result.length, 2);
        });
    });

    describe('#formatDateObject', function() {
        it("should format all dates in a vector as objects", function() {
            let vector = [
                {'refper': '2018-01-01', 'value': 0},
                {'refper': '2018-12-31', 'value': 0}
            ];
            vlib.formatDateObject(vector);

            assert.strictEqual(vector[0].refper.getUTCFullYear(), 2018);
            assert.strictEqual(vector[0].refper.getUTCMonth(), 0);
            assert.strictEqual(vector[0].refper.getUTCDate(), 1);

            assert.strictEqual(vector[1].refper.getUTCFullYear(), 2018);
            assert.strictEqual(vector[1].refper.getUTCMonth(), 11);
            assert.strictEqual(vector[1].refper.getUTCDate(), 31);
        });
    });

    describe('#formatDateString', function() {
        it("should format all dates in a vector as strings", function() {
            let vector = [
                {'refper': vlib.realDate(2018, 1, 1), 'value': 0},
                {'refper': vlib.realDate(2018, 12, 31), 'value': 0}
            ];
            vlib.formatDateString(vector);

            assert.strictEqual(vector[0].refper, '2018-01-01');
            assert.strictEqual(vector[1].refper, '2018-12-31');
        });
    });
});