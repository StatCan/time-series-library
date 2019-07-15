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
});
