/**
 * Create a new vector representing time series data.
 * @param {Array.<Object>} data - Array of datapoints.
 */
const Vector = function(data) {
    this.vectorType = true;
    this.data = data === undefined ? [] : formatData(data);

    /**
     * Length of a vector.
     */
    this.length = data === undefined ? 0 : data.length;

    /**
     * Gets the datapoint at a specific index.
     * @param {Number} index - Index, starting from 0.
     * @return {Object} - Datapoint.
     */
    this.get = function(index) {
        return this.data[index];
    };

    /**
     * Gets the reference period of the datapoint at a specific index.
     * @param {Number} index - Index, starting from 0.
     * @return {Date} - Reference period.
     */
    this.refper = function(index) {
        return this.data[index].refper;
    };

    /**
     * Gets the reference period string of the datapoint at a specific index.
     * @param {Number} index - Index, starting from 0.
     * @return {string} - Reference period string in yyyy-mm-dd format.
     */
    this.refperStr = function(index) {
        return datestring(this.refper(index));
    };

    /**
     * Gets the value of a datapoint at a specific index.
     * @param {Number} index - Index, starting from 0.
     * @return {Number} - Value.
     */
    this.value = function(index) {
        return this.data[index].value;
    };

    /**
     * Appends a new datapoint to the end of a vector.
     * @param {Object} datapoint - New datapoint.
     */
    this.push = function(datapoint) {
        this.data.push(formatPoint(datapoint));
        this.length++;
    };

    /**
     * Checks if this vector is equal to another.
     * @param {Vector} other - Other vector.
     * @param {Number} index - Check equality of only a single datapoint at
     * this index. Equality of entire vector will be checked if undefined.
     * @return {boolean} - True if vectors are equal, otherwise false.
     */
    this.equals = function(other, index) {
        const pointEquals = function(a, b) {
            return a.refper.getTime() == b.refper.getTime()
                && a.value == b.value;
        };

        if (index) return pointEquals(this.get(index), other.get(index));
        if (this.length != other.length) return false;

        const foundNotEqual = this.find((point, i) => {
            return !pointEquals(point, other.get(i));
        });
        if (foundNotEqual) return false;

        return true;
    };

    /**
     * Creates a deep copy of a vector.
     * @return {Vector} - Copy of vector.
     */
    this.copy = function() {
        const copy = new Vector();
        for (let p = 0; p < this.length; p++) {
            const copyPoint = {
                'refper': this.refper(p),
                'value': this.value(p)
            };
            safeMerge(copyPoint, this.get(p));
            copy.push(copyPoint);
        }
        return copy;
    };

    /**
     * Maps all datapoints in this vector.
     * @param {function} mapper - Mapper function.
     * @return {Array.<any>} - Map result.
     */
    this.map = function(mapper) {
        return this.data.map(mapper);
    };

    /**
     * Finds the first datapoint in this vector matching a predicate condition.
     * @param {function} predicate - Predicate function.
     * @return {object} - Datapoint. Returns null if none found.
     */
    this.find = function(predicate) {
        return this.data.find(predicate);
    };

    /**
     * Finds all datapoints in this vector matching a predicate condition.
     * @param {function} predicate - Predicate function.
     * @return {Array.<object>} - Array of datapoints matching predicate.
     */
    this.filter = function(predicate) {
        const result = new Vector();
        for (let p = 0; p < this.length; p++) {
            if (predicate(this.get(p))) result.push(this.get(p));
        }
        return result;
    };

    /**
     * Constrains this vector within a specified range.
     * @param {Date} startDate - Start of range (inclusive).
     * @param {Date} endDate - End of range (inclusive).
     * @return {Vector} - Range of vector.
     */
    this.range = function(startDate, endDate) {
        startDate = formatDateObject(startDate);
        endDate = formatDateObject(endDate);
        const rangeFilter = function(point) {
            return point.refper >= startDate && point.refper <= endDate;
        };
        return this.filter(rangeFilter);
    };

    /**
     * Gets the vector containing up to the last N reference periods of this
     * vector.
     * @param {Number} n - Last n reference periods.
     * @return {Vector} - Last n reference period vector.
     */
    this.latestN = function(n) {
        if (n > this.length) throw new Error('N > length of vector.');
        const result = new Vector();
        for (let p = this.length - n; p < this.length; p++) {
            result.push(this.get(p));
        }
        return result;
    };

    /**
     * Checks if this vector is interoperable with another.
     * @param {Vector} other - Other vector.
     * @return {boolean} - True if vectors are interoperable, otherwise false.
     */
    this.interoperable = function(other) {
        if (this.length != other.length) return false;
        const foundInoperable = this.find((point, i) => {
            return point.refper.getTime() != other.refper(i).getTime();
        });
        if (foundInoperable) return false;
        return true;
    };

    /**
     * Gets the intersection of this vector with another.
     * @param {Vector} other - Other vector.
     * @return {Vector} - Intersection result.
     */
    this.intersection = function(other) {
        const result = new Vector();

        let pThis = 0;
        let pOther = 0;
        while (pThis < this.length) {
            while (pOther < other.length) {
                const thisRefper = this.refper(pThis);
                const otherRefper = other.refper(pOther);
                if (thisRefper.getTime() == otherRefper.getTime()) {
                    result.push(this.get(pThis));
                    pOther++;
                } else if (thisRefper > otherRefper) {
                    pOther++;
                } else {
                    break;
                }
            }
            pThis++;
        }

        return result;
    };

    /**
     * Gets the sum of all values in this vector.
     * @return {Number} - Sum.
     */
    this.sum = function() {
        return this.reduce(function(accumulator, curr) {
            return accumulator + curr;
        });
    };

    /**
     * Gets the average of the values in this vector.
     * @return {Number} - Average.
     */
    this.average = function() {
        if (this.length == 0) return null;
        return this.sum() / this.length;
    };

    /**
     * Reduce the values of this vector using a reducer function.
     * @param {function(any, any)} reducer - Reducer function.
     * @return {any} Result of reduction.
     */
    this.reduce = function(reducer) {
        if (this.length == 0) return null;
        let accumulator = this.value(0);
        for (let p = 1; p < this.length; p++) {
            accumulator = reducer(accumulator, this.value(p));
        }
        return accumulator;
    };

    /**
     * Performs an operation between this vector and another.
     * @param {Vector} other - Other vector.
     * @param {function(Number, Number)} operation - Operation function.
     * @return {Vector} - Result of operation.
     */
    this.operate = function(other, operation) {
        const a = this.intersection(other);
        const b = other.intersection(this);

        const result = new Vector();

        for (let p = 0; p < a.length; p++) {
            const newPoint = {
                'refper': a.refper(p),
                'value': operation(a.value(p), b.value(p))
            };

            // Merge keys added by the user.
            safeMerge(newPoint, a.get(p));

            result.push(newPoint);
        }

        return result;
    };

    /**
     * Performs a period to period delta transformation on this vector.
     * @param {function(Number, Number)} operation - Delta operation.
     * @return {Vector} - Transformed vector.
     */
    this.periodDeltaTransformation = function(operation) {
        const result = new Vector();

        for (let p = 0; p < this.length; p++) {
            let value = null;
            if (this.get(p - 1) != undefined) {
                const lastVal = this.value(p - 1);
                const currVal = this.value(p);
                value = operation(currVal, lastVal);
            }
            const point = {'refper': this.refper(p), 'value': value};
            safeMerge(point, this.get(p));
            result.push(point);
        }

        return result;
    };

    /**
     * Performs a transformation on each value of this vector.
     * @param {function(Number)} operation - Operation.
     * @return {Vector} - Transformed vector.
     */
    this.periodTransformation = function(operation) {
        const result = new Vector();
        for (let p = 0; p < this.length; p++) {
            const point = this.get(p);
            const newPoint = {
                'refper': point.refper,
                'value': operation(point.value)
            };
            safeMerge(newPoint, point);
            result.push(newPoint);
        }
        return result;
    };

    /**
     * Get the period to period percentage change vector of this vector.
     * @return {Vector} - Transformed vector.
     */
    this.periodToPeriodPercentageChange = function() {
        return this.periodDeltaTransformation(function(curr, last) {
            return (curr - last) / Math.abs(last) * 100;
        });
    };

    /**
     * Get the period to period difference vector of this vector.
     * @return {Vector} - Transformed vector.
     */
    this.periodToPeriodDifference = function() {
        return this.periodDeltaTransformation(function(curr, last) {
            return curr - last;
        });
    };

    this.samePeriodPreviousYearPercentageChange = function() {
        return this.annualize().periodToPeriodPercentageChange();
    };

    this.samePeriodPreviousYearDifference = function() {
        return this.annualize().periodToPeriodDifference();
    };

    this.modes = {
        'last': function(vector) {
            return vector.get(vector.length - 1);
        },
        'sum': function(vector) {
            const point = {
                'refper': vector.refper(vector.length - 1),
                'value': vector.sum()
            };
            return safeMerge(point, vector.get(vector.length - 1));
        },
        'average': function(vector) {
            const point = {
                'refper': vector.refper(vector.length - 1),
                'value': vector.average()
            };
            return safeMerge(point, vector.get(vector.length - 1));
        }
    };

    /**
     * Converts vector to annual frequency.
     * @param {string} mode - "last" (default), "sum", "average".
     * @return {Vector} - Converted vector.
     */
    this.annual = function(mode) {
        if (mode == undefined || typeof mode === 'string') {
            mode = this.modes[mode] || this.modes['last'];
        }

        const split = frequencySplit(this, function(last, curr) {
            return last.getFullYear() != curr.getFullYear();
        });
        const join = frequencyJoin(split, mode);
        return join.filter(function(point) {
            return point.refper.getMonth() == join.refper(0).getMonth();
        });
    };
    this.annualize = this.annual;

    /**
     * Converts vector to quarterly frequency.
     * @param {string} mode - "last" (default), "sum", "average".
     * @param {Number} offset - Offset.
     * @return {Vector} - Converted vector.
     */
    this.quarter = function(mode, offset) {
        if (mode == undefined || typeof mode === 'string') {
            mode = this.modes[mode] || this.modes['last'];
        }
        offset = offset || 0;
        offset = offset % 3;

        const filtered = this.filter(function(point) {
            const m = point.refper.getMonth();
            if (offset == 0) {
                return m == 2 || m == 5 || m == 8 || m == 11;
            } else if (offset == 1) {
                return m == 1 || m == 4 || m == 7 || m == 10;
            } else {
                return m == 0 || m == 3 || m == 6 || m == 9;
            }
        });

        const split = frequencySplit(filtered, function(last, curr) {
            // TODO: Is this correct.
            const lastQuarter = Math.floor(
                ((last.getMonth() - offset) % 12) / 3);
            const currQuarter = Math.floor(
                ((curr.getMonth() - offset) % 12) / 3);
            return lastQuarter != currQuarter;
        });

        return frequencyJoin(split, mode);
    };
    this.quarterly = this.quarter;

    /**
     * Converts vector to monthly frequency.
     * @param {string} mode - "last" (default), "sum", "average".
     * @return {Vector} - Converted vector.
     */
    this.monthly = function(mode) {
        if (mode == undefined || typeof mode === 'string') {
            mode = this.modes[mode] || this.modes['last'];
        }

        const split = frequencySplit(this, function(last, curr) {
            return last.getMonth() != curr.getMonth()
                || last.getFullYear() != curr.getFullYear();
        });
        return frequencyJoin(split, mode);
    };

    /**
     * Converts vector to weekly frequency.
     * @param {string} mode - "last" (default), "sum", "average".
     * @return {Vector} - Converted vector.
     */
    this.weekly = function(mode) {
        if (mode == undefined || typeof mode === 'string') {
            mode = this.modes[mode] || this.modes['last'];
        }

        const split = frequencySplit(this, function(last, curr) {
            return curr.getDay() < last.getDay();
        });
        return frequencyJoin(split, mode);
    };

    function frequencyJoin(split, mode) {
        const result = new Vector();
        for (let i = 0; i < split.length; i++) {
            result.push(mode(split[i]));
        }
        return result;
    }

    function frequencySplit(vector, fn) {
        const result = [];
        let next = new Vector();
        for (let p = 0; p < vector.length; p++) {
            if (p > 0 && fn(vector.refper(p - 1), vector.refper(p))) {
                result.push(next);
                next = new Vector([vector.get(p)]);
            } else {
                next.push(vector.get(p));
            }
        }
        if (next.length != 0) result.push(next);
        return result;
    }

    /**
     * Gets rounded vector.
     * @param {Number} decimals - Number of decimal places.
     * @return {Vector} - Rounded vector.
     */
    this.round = function(decimals) {
        const result = new Vector();
        for (let p = 0; p < this.length; p++) {
            const point = this.get(p);
            const newPoint = {
                'refper': point.refper,
                'value': scalarRound(point.value, decimals)
            };
            safeMerge(newPoint, point);
            result.push(newPoint);
        }
        return result;
    };

    /**
     * Gets rounded vector using Banker's rounding algorithm.
     * @param {Number} decimals - Number of decimal places.
     * @return {Vector} - Rounded vector.
     */
    this.roundBankers = function(decimals) {
        const result = new Vector();
        for (let p = 0; p < this.length; p++) {
            const point = this.get(p);
            const newPoint = {
                'refper': point.refper,
                'value': scalarRoundBankers(point.value, decimals)
            };
            safeMerge(newPoint, point);
            result.push(newPoint);
        }
        return result;
    };

    function scalarRound(value, decimals) {
        decimals = decimals || 0;
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }

    function scalarRoundBankers(value, decimals) {
        decimals = decimals || 0;
        const x = value * Math.pow(10, decimals);
        const r = Math.round(x);
        const br = Math.abs(x) % 1 === 0.5 ? (r % 2 === 0 ? r : r - 1) : r;
        return br / Math.pow(10, decimals);
    }

    this.json = function() {
        return JSON.stringify(this.data);
    };

    function formatData(data) {
        for (let p = 0; p < data.length; p++) {
            formatPoint(data[p]);
        }
        return data;
    }

    function formatPoint(datapoint) {
        datapoint.refper = formatDateObject(datapoint.refper);
        return datapoint;
    }
};

const VectorLib = function() {
    const operators = {
        '+': function(a, b) {
            return a + b;
        },
        '-': function(a, b) {
            return a - b;
        },
        '*': function(a, b) {
            return a * b;
        },
        '/': function(a, b) {
            return a / b;
        }
    };

    const operatorPriorities = {
        '*': 2,
        '/': 2,
        '+': 1,
        '-': 1,
    };

    this.getVectorIds = function(expression) {
        expression = expression.replace(/ /g, '');
        const ids = [];
        let nextId = '';
        for (let c = 0; c < expression.length; c++) {
            if (expression[c] == 'v' && !isNaN(expression[c + 1])) {
                nextId = 'v';
            } else if (nextId != '' && !isNaN(expression[c])) {
                nextId += expression[c];
            } else {
                if (nextId != '') ids.push(nextId.substring(1));
                nextId = '';
            }
        }

        if (nextId != '') ids.push(nextId.substring(1));
        return ids;
    };

    this.generateDaily = function(values, startDate) {
        startDate = formatDateObject(startDate);
        return generateVector(values, startDate, nextDay);
    };

    this.generateWeekly = function(values, startDate) {
        startDate = formatDateObject(startDate);
        return generateVector(values, startDate, nextWeek);
    };

    this.generateMonthly = function(values, startDate) {
        startDate = formatDateObject(startDate);
        startDate.setDate(
            daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return generateVector(values, startDate, nextMonth);
    };

    this.generateQuarterly = function(values, startDate) {
        startDate = formatDateObject(startDate);
        startDate.setDate(
            daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return generateVector(values, startDate, nextQuarter);
    };

    this.generateSemiAnnual = function(values, startDate) {
        startDate = formatDateObject(startDate);
        startDate.setDate(
            daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return generateVector(values, startDate, nextSemiAnnum);
    };

    this.generateAnnual = function(values, startDate) {
        startDate = formatDateObject(startDate);
        startDate.setDate(
            daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return generateVector(values, startDate, nextAnnum);
    };

    this.generateBiAnnual = function(values, startDate) {
        startDate = formatDateObject(startDate);
        startDate.setDate(
            daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return generateVector(values, startDate, nextBiAnnum);
    };

    this.generateTetraAnnual = function(values, startDate) {
        startDate = formatDateObject(startDate);
        startDate.setDate(
            daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return generateVector(values, startDate, nextTetraAnnum);
    };

    const generateVector = function(values, startDate, nextDateFn) {
        const vector = new Vector();
        let currDate = startDate;
        for (const value of values) {
            vector.push({'refper': currDate, 'value': value});
            currDate = nextDateFn(currDate);
        }
        return vector;
    };

    const nextDay = function(date) {
        return new Date(
            date.getFullYear(), date.getMonth(), date.getDate() + 1);
    };

    const nextWeek = function(date) {
        return new Date(
            date.getFullYear(), date.getMonth(), date.getDate() + 7);
    };

    const nextMonth = function(date) {
        return addMonths(date, 1);
    };

    const nextQuarter = function(date) {
        return addMonths(date, 3);
    };

    const nextSemiAnnum = function(date) {
        return addMonths(date, 6);
    };

    const nextAnnum = function(date) {
        return new Date(
            date.getFullYear() + 1, date.getMonth(), date.getDate());
    };

    const nextBiAnnum = function(date) {
        return new Date(
            date.getFullYear() + 2, date.getMonth(), date.getDate());
    };

    const nextTetraAnnum = function(date) {
        return new Date(
            date.getFullYear() + 5, date.getMonth(), date.getDate());
    };

    const addMonths = function(date, months) {
        const currYear = date.getFullYear();
        const currMonth = date.getMonth();
        const newYear = currYear + Math.floor((currMonth + months) / 12);
        const newMonth = (currMonth + (months % 12)) % 12;
        return new Date(newYear, newMonth, daysInMonth(newYear, newMonth));
    };

    const daysInMonth = function(year, month) {
        return new Date(year, month + 1, 0).getDate();
    };

    this.evaluate = function(expression, vectors) {
        // {'v1': {'refper': "2018-01-01", 'value': 1}, ...}
        expression = expression.replace(/ /g, '');

        const infix = splitSymbols(expression);
        const post = postfix(infix);

        const stack = [];

        for (let s = 0; s < post.length; s++) {
            const symbol = post[s];

            if (typeof symbol === 'string' && symbol[0] == 'v') {
                stack.push(new ExpressionNode(vectors[symbol]));
            } else if (!isNaN(symbol)) {
                stack.push(new ExpressionNode(symbol));
            } else {
                const s1 = stack.pop();
                const s2 = stack.pop();

                const node = new ExpressionNode(operators[symbol]);
                node.left = s1;
                node.right = s2;

                stack.push(node);
            }
        }

        return stack.pop().result();
    };


    const ExpressionNode = function(value) {
        this.operation = null;
        this.value = null;
        this.left = null;
        this.right = null;

        if (value.vectorType || !isNaN(value)) {
            this.value = value;
        } else {
            this.operation = value;
        }

        this.result = function() {
            if (this.isVector() || this.isScalar()) {
                return this.value;
            } else {
                if (this.left == null || this.right == null) {
                    throw new Error('Could not evaluate operator node.');
                }

                return operate(
                    this.right.result(),
                    this.left.result(),
                    this.operation);
            }
        };

        this.hasChildren = function() {
            return !(this.left == null && this.right == null);
        };

        this.isOperator = function() {
            return this.operation != null;
        };

        this.isVector = function() {
            return this.operation == null && this.value.vectorType;
        };

        this.isScalar = function() {
            return this.operation == null && !isNaN(this.value);
        };
    };

    const operate = function(valueA, valueB, operation) {
        if (valueA.vectorType && valueB.vectorType) {
            return valueA.operate(valueB, operation);
        }
        if (valueA.vectorType && !isNaN(valueB)) {
            return vectorScalarOperate(valueA, valueB, operation);
        }
        if (!isNaN(valueA) && valueB.vectorType) {
            return vectorScalarOperate(valueB, valueA, operation);
        }
        if (!isNaN(valueA) && !isNaN(valueB)) {
            return operation(valueA, valueB);
        }

        throw new Error('Unsupported types for operation.');
    };

    const vectorScalarOperate = function(vector, scalar, operation) {
        const result = new Vector();
        for (let p = 0; p < vector.length; p++) {
            const newPoint = {
                'refper': vector.refper(p),
                'value': operation(vector.value(p), scalar)
            };
            // Merge keys added by the user.
            safeMerge(newPoint, vector.get(p));
            result.push(newPoint);
        }
        return result;
    };

    const postfix = function(symbols) {
        const stack = ['('];
        const post = [];
        symbols.push(')');

        for (let s = 0; s < symbols.length; s++) {
            const symbol = symbols[s];

            if (!isNaN(symbol)) {
                post.push(symbol);
            } else if (symbol[0] == 'v') {
                post.push(symbol);
            } else if (symbol == '(') {
                stack.push('(');
            } else if (symbol == ')') {
                while (stack[stack.length - 1] != '(') {
                    post.push(stack.pop());
                }
                stack.pop();
            } else {
                while (priority(symbol) <= priority(stack[stack.length - 1])) {
                    post.push(stack.pop());
                }

                stack.push(symbol);
            }
        }

        return post;
    };


    const priority = function(symbol) {
        if (symbol in operatorPriorities) {
            return operatorPriorities[symbol];
        }

        return 0;
    };


    const splitSymbols = function(vexp) {
        const split = [];

        for (let pos = 0; pos < vexp.length; pos++) {
            let next = null;

            if (vexp[pos] == 'v' || vexp[pos] == 'V') {
                next = readVector(vexp, pos);
            } else if (!isNaN(vexp[pos])
                || (vexp[pos] == '-' && isNaN(vexp[pos - 1])
                    && !isNaN(vexp[pos + 1]))) {
                next = readScalar(vexp, pos);
            } else if (vexp[pos] in operators) {
                next = readOperator(vexp, pos);
            } else if (vexp[pos] == '(' || vexp[pos] == ')') {
                next = readBracket(vexp, pos);
            } else {
                throw new Error(
                    'Unrecognized symbol at position ' + pos + '.');
            }

            split.push(next.symbol);
            pos = next.pos;
        }

        return split;
    };


    const readVector = function(vexp, pos) {
        let symbol = 'v';
        pos++;

        while (!isNaN(vexp[pos]) && pos < vexp.length) {
            symbol += vexp[pos];
            pos++;
        }

        return {'symbol': symbol, 'pos': pos - 1};
    };


    const readOperator = function(vexp, pos) {
        return {'symbol': vexp[pos], 'pos': pos};
    };


    const readScalar = function(vexp, pos) {
        let symbol = '';
        const start = pos;

        while ((!isNaN(vexp[pos]) || vexp[pos] == '.'
            || (vexp[pos] == '-' && pos == start))
            && pos < vexp.length) {
            symbol += vexp[pos];
            pos++;
        }

        return {'symbol': Number(symbol), 'pos': pos - 1};
    };


    const readBracket = function(vexp, pos) {
        return {'symbol': vexp[pos], 'pos': pos};
    };


    this.realDate = realDate;
};

// Merge but don't overwrite existing keys.
function safeMerge(target, source) {
    for (const key in source) {
        if (!(key in target)) {
            target[key] = source[key];
        }
    }
    return target;
}

function realDate(year, month, day) {
    return new Date(year, month - 1, day);
}

function formatDateObject(date) {
    if (typeof date === 'string') return new Date(date);
    return date;
}

function datestring(date) {
    return date.getFullYear() + '-'
        + (date.getMonth() + 1).toString().padStart(2, '0') + '-'
        + date.getDate().toString().padStart(2, '0');
}

module.exports = {
    'Vector': Vector,
    'VectorLib': VectorLib
};
