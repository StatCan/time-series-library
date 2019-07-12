class Vector {
    /**
     * Create a new vector representing time series data.
     * @param {Array.<Object>} data - Array of datapoints.
     */
    constructor(data) {
        this.vectorType = true;
        this.data = formatData(data || []);
    }

    get length() {
        return this.data.length;
    }

    /**
     * Gets the datapoint at a specific index.
     * @param {Number} index - Index, starting from 0.
     * @return {Object} - Datapoint.
     */
    get(index) {
        return this.data[index];
    }

    /**
     * Gets the reference period of the datapoint at a specific index.
     * @param {Number} index - Index, starting from 0.
     * @return {Date} - Reference period.
     */
    refper(index) {
        return this.data[index].refper;
    }

    /**
     * Gets the reference period string of the datapoint at a specific index.
     * @param {Number} index - Index, starting from 0.
     * @return {string} - Reference period string in yyyy-mm-dd format.
     */
    refperStr(index) {
        return datestring(this.refper(index));
    }

    /**
     * Gets the value of a datapoint at a specific index.
     * @param {Number} index - Index, starting from 0.
     * @return {Number} - Value.
     */
    value(index) {
        return this.data[index].value;
    }

    /**
     * Gets the list of all values in a vector.
     * @return {Array.<Number>} - Values.
     */
    values() {
        return this.map((point) => point.value);
    }

    /**
     * Appends a new datapoint to the end of a vector.
     * @param {Object} datapoint - New datapoint.
     */
    push(datapoint) {
        this.data.push(formatPoint(datapoint));
    }

    /**
     * Checks if this vector is equal to another.
     * @param {Vector} other - Other vector.
     * @param {Number} index - Check equality of only a single datapoint at
     * this index. Equality of entire vector will be checked if undefined.
     * @return {boolean} - True if vectors are equal, otherwise false.
     */
    equals(other, index) {
        const pointEquals = function(a, b) {
            return a.refper.getTime() == b.refper.getTime()
                && a.value == b.value;
        };
        if (index) return pointEquals(this.get(index), other.get(index));
        if (this.length != other.length) return false;
        return !this.some((point, i) => {
            return !pointEquals(point, other.get(i));
        });
    }

    /**
     * Creates a deep copy of a vector.
     * @return {Vector} - Copy of vector.
     */
    copy() {
        return new Vector(
            this.data.map((point) => newPointValue(point, point.value)));
    }

    /**
     * Maps all datapoints in this vector.
     * @param {function} mapper - Mapper function.
     * @return {Array.<any>} - Map result.
     */
    map(...args) {
        return this.data.map(...args);
    }

    /**
     * Finds the first datapoint in this vector matching a predicate condition.
     * @param {function} predicate - Predicate function.
     * @return {object} - Datapoint. Returns null if none found.
     */
    find(...args) {
        return this.data.find(...args);
    }

    /**
     * Returns true if there is a datapoint that matches a predicate condition.
     * @param {function} predicate - Predicate function.
     * @return {object} - True if condition matched, otherwise false.
     */
    some(...args) {
        return this.data.some(...args);
    }

    /**
     * Finds all datapoints in this vector matching a predicate condition.
     * @param {function} predicate - Predicate function.
     * @return {Array.<object>} - Array of datapoints matching predicate.
     */
    filter(...args) {
        return new Vector(this.data.filter(...args));
    }

    /**
     * Constrains this vector within a specified range.
     * @param {Date} startDate - Start of range (inclusive).
     * @param {Date} endDate - End of range (inclusive).
     * @return {Vector} - Range of vector.
     */
    range(startDate, endDate) {
        startDate = formatDateObject(startDate);
        endDate = formatDateObject(endDate);
        return this.filter((p) => p.refper >= startDate && p.refper <= endDate);
    }

    /**
     * Gets the vector containing up to the last N reference periods of this
     * vector.
     * @param {Number} n - Last n reference periods.
     * @return {Vector} - Last n reference period vector.
     */
    latestN(n) {
        if (n > this.length) throw new Error('N > length of vector.');
        return new Vector(this.data.slice(-n));
    }

    /**
     * Checks if this vector is interoperable with another.
     * @param {Vector} other - Other vector.
     * @return {boolean} - True if vectors are interoperable, otherwise false.
     */
    interoperable(other) {
        if (this.length != other.length) return false;
        return !this.some((point, i) => {
            return point.refper.getTime() != other.refper(i).getTime();
        });
    }

    /**
     * Gets the intersection of this vector with another.
     * @param {Vector} others - Other vectors.
     * @return {Vector} - Intersection result.
     */
    intersection(others) {
        if (!Array.isArray(others)) others = [others];

        const refperCounts = {};

        const refpers = [
            ...this.data.map((p) => p.refper),
            ...others.reduce((a, c) => [...a, ...c.map((p) => p.refper)], [])
        ];

        refpers.map((refper) => {
            if (refper in refperCounts) refperCounts[refper]++;
            else refperCounts[refper] = 1;
        });

        return this.filter((p) => refperCounts[p.refper] == others.length + 1);
    }

    /**
     * Gets the sum of all values in this vector.
     * @return {Number} - Sum.
     */
    sum() {
        return this.reduce((acc, cur) => acc + cur, 0);
    }

    /**
     * Gets the average of the values in this vector.
     * @return {Number} - Average.
     */
    average() {
        return this.length > 0 ? this.sum() / this.length : null;
    }

    /**
     * Gets the max value in this vector.
     * @return {Number} - Maximum.
     */
    max() {
        return this.length > 0 ? Math.max(...this.values()) : null;
    }

    /**
     * Gets the min value in this vector.
     * @return {Number} - Minimum.
     */
    min() {
        return this.length > 0 ? Math.min(...this.values()) : null;
    }

    /**
     * Reduce the values of this vector using a reducer function.
     * @param {function(any, any)} reducer - Reducer function.
     * @return {any} Result of reduction.
     */
    reduce(...args) {
        return this.map((point) => point.value).reduce(...args);
    }

    /**
     * Performs an operation between this vector and another.
     * @param {Vector} other - Other vector.
     * @param {function(Number, Number)} operation - Operation function.
     * @return {Vector} - Result of operation.
     */
    operate(other, operation) {
        const a = this.intersection(other);
        const b = other.intersection(this);

        const data = a.data.map((pointA, i) => {
            return newPointValue(pointA, operation(pointA.value, b.value(i)));
        });
        return new Vector(data);
    }

    /**
     * Performs a period to period delta transformation on this vector.
     * @param {function(Number, Number)} operation - Delta operation.
     * @return {Vector} - Transformed vector.
     */
    periodDeltaTransformation(operation) {
        const data = this.data.map((point, i, data) => {
            const newValue = data[i-1] == undefined ?
                null : operation(point.value, data[i-1].value);
            return newPointValue(point, newValue);
        });
        return new Vector(data);
    }

    samePeriodPreviousYearTransformation(operation) {
        // Only works on frequecnies > monthly for now.
        // Create dictionary mapping dates to values.
        const set = {};
        for (const d of this.data) {
            const endOfMonth = new Date(
                d.refper.getFullYear(),
                d.refper.getMonth(),
                daysInMonth(d.refper.getFullYear(), d.refper.getMonth()));
            set[endOfMonth] = d.value;
        }

        const result = new Vector();
        for (const point of this.data) {
            const refper = point.refper;
            const previousYear = new Date(
                refper.getFullYear() - 1,
                refper.getMonth(),
                daysInMonth(refper.getFullYear() - 1, refper.getMonth()));

            let newValue = null;
            if (previousYear in set) {
                newValue = operation(point.value, set[previousYear]);
            }
            const newPoint = {'refper': refper, 'value': newValue};
            safeMerge(point, newPoint);
            result.push(newPoint);
        }
        return result;
    }

    /**
     * Performs a transformation on each value of this vector.
     * @param {function(Number)} operation - Operation.
     * @return {Vector} - Transformed vector.
     */
    periodTransformation(operation) {
        const data = this.data.map((point) => {
            return newPointValue(point, operation(point.value));
        });
        return new Vector(data);
    }

    /**
     * Get the period to period percentage change vector of this vector.
     * @return {Vector} - Transformed vector.
     */
    periodToPeriodPercentageChange() {
        return this.periodDeltaTransformation(percentageChange);
    }

    /**
     * Get the period to period difference vector of this vector.
     * @return {Vector} - Transformed vector.
     */
    periodToPeriodDifference() {
        return this.periodDeltaTransformation((cur, last) => cur - last);
    }

    samePeriodPreviousYearPercentageChange() {
        return this.samePeriodPreviousYearTransformation(percentageChange);
    }

    samePeriodPreviousYearDifference() {
        return this.samePeriodPreviousYearTransformation((cur, last) => {
            return cur - last;
        });
    }

    /**
     * Converts vector to a defined frequency.
     * @param {string} mode - "last" (default), "sum", "average", "max", "min".
     * @param {function} converter - Function with date parameters current and
     * last that true if current is the defined frequency away from last.
     * @return {Vector} - Converted vector.
     */
    convertToFrequency(mode, converter) {
        const split = frequencySplit(this, converter);
        return frequencyJoin(split, mode);
    }

    /**
     * Converts vector to quinquennial frequency.
     * @param {string} mode - "last" (default), "sum", "average", "max", "min".
     * @return {Vector} - Converted vector.
     */
    quinquennial(mode) {
        return convertToYearlyFrequency(this, mode, 5);
    }

    /**
     * Converts vector to tri-annual frequency.
     * @param {string} mode - "last" (default), "sum", "average", "max", "min".
     * @return {Vector} - Converted vector.
     */
    triAnnual(mode) {
        return convertToYearlyFrequency(this, mode, 3);
    }

    /**
     * Converts vector to bi-annual frequency.
     * @param {string} mode - "last" (default), "sum", "average", "max", "min".
     * @return {Vector} - Converted vector.
     */
    biAnnual(mode) {
        return convertToYearlyFrequency(this, mode, 2);
    }

    /**
     * Converts vector to annual frequency.
     * @param {string} mode - "last" (default), "sum", "average", "max", "min".
     * @return {Vector} - Converted vector.
     */
    annual(mode) {
        return convertToYearlyFrequency(this, mode, 1);
    }

    /**
     * Converts vector to semi-annual frequency.
     * @param {string} mode - "last" (default), "sum", "average", "max", "min".
     * @return {Vector} - Converted vector.
     */
    semiAnnual(mode) {
        return this.convertToFrequency(mode, function(curr, last) {
            return curr.getMonth() == (last.getMonth() + 6) % 12;
        });
    }

    /**
     * Converts vector to quarterly frequency.
     * @param {string} mode - "last" (default), "sum", "average", "max", "min".
     * @return {Vector} - Converted vector.
     */
    quarterly(mode) {
        return this.convertToFrequency(mode, function(curr, last) {
            return curr.getMonth() == (last.getMonth() + 3) % 12;
        });
    }

    /**
     * Converts vector to monthly frequency.
     * @param {string} mode - "last" (default), "sum", "average", "max", "min".
     * @return {Vector} - Converted vector.
     */
    monthly(mode) {
        return this.convertToFrequency(mode, function(curr, last) {
            return curr.getMonth() == (last.getMonth() + 1) % 12;
        });
    }

    /**
     * Converts vector to bi-monthly frequency.
     * @param {string} mode - "last" (default), "sum", "average", "max", "min".
     * @return {Vector} - Converted vector.
     */
    biMonthly(mode) {
        return this.convertToFrequency(mode, function(curr, last) {
            return curr.getMonth() == (last.getMonth() + 2) % 12;
        });
    }

    /**
     * Converts vector to weekly frequency.
     * @param {string} mode - "last" (default), "sum", "average", "max", "min".
     * @return {Vector} - Converted vector.
     */
    weekly(mode) {
        return this.convertToFrequency(mode, function(curr, last) {
            return curr.getDay() == last.getDay() &&
                curr.getDate() != last.getDate(); // FIXME: Should not be needed
        });
    }

    /**
     * Gets rounded vector.
     * @param {Number} decimals - Number of decimal places.
     * @return {Vector} - Rounded vector.
     */
    round(decimals) {
        const data = this.data.map((point) => {
            return newPointValue(point, scalarRound(point.value, decimals));
        });
        return new Vector(data);
    }

    /**
     * Gets rounded vector using Banker's rounding algorithm.
     * @param {Number} decimals - Number of decimal places.
     * @return {Vector} - Rounded vector.
     */
    roundBankers(decimals) {
        const data = this.data.map((point) => {
            return newPointValue(
                point, scalarRoundBankers(point.value, decimals));
        });
        return new Vector(data);
    }

    json() {
        return JSON.stringify(this.data.map((point) => {
            return safeMerge(
                {'refper': datestring(point.refper), 'value': point.value},
                point);
        }));
    }
}

const VectorLib = function() {
    const operators = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b
    };

    const operatorPriorities = {
        '*': 2,
        '/': 2,
        '+': 1,
        '-': 1,
    };

    this.getVectorIds = function(expression) {
        expression = expression.replace(/ /g, '').toLowerCase();

        const allowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];

        const chunks = expression.split('v').slice(1);
        const ids = chunks.map((chunk) => {
            return takeWhile(chunk, (c) => allowed.includes(c));
        }).filter((id) => id.length > 0).map((id) => id.join(''));

        const unique = [];
        ids.map((id) => {
            if (!unique.includes(id)) unique.push(id);
        });
        return unique;
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

    this.generateBiMonthly = function(values, startDate) {
        startDate = formatDateObject(startDate);
        startDate.setDate(
            daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return generateVector(values, startDate, nextBiMonth);
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

    this.generateTriAnnual = function(values, startDate) {
        startDate = formatDateObject(startDate);
        startDate.setDate(
            daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return generateVector(values, startDate, nextTriAnnum);
    };

    this.generateQuinquennial = function(values, startDate) {
        startDate = formatDateObject(startDate);
        startDate.setDate(
            daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return generateVector(values, startDate, nextQuinquennium);
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

    const nextBiMonth = function(date) {
        return addMonths(date, 2);
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

    const nextTriAnnum = function(date) {
        return new Date(
            date.getFullYear() + 3, date.getMonth(), date.getDate());
    };

    const nextQuinquennium = function(date) {
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

    this.evaluate = function(expression, vectors) {
        // {'v1': {'refper': "2018-01-01", 'value': 1}, ...}
        expression = expression.replace(/ /g, '');

        const infix = splitSymbols(expression);
        const post = postfix(infix);

        const stack = [];

        for (let s = 0; s < post.length; s++) {
            const symbol = post[s];

            if (typeof symbol === 'string' && symbol[0] == 'v') {
                stack.push(new ExpressionNode(vectors[symbol.substring(1)]));
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
        const data = vector.data.map((point) => {
            return newPointValue(point, operation(point.value, scalar));
        });
        return new Vector(data);
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
        symbol += takeWhile(vexp.split('').slice(pos + 1), (char) => {
            return !isNaN(char);
        }).join();
        return {'symbol': symbol, 'pos': pos + symbol.length - 1};
    };

    const readOperator = function(vexp, pos) {
        return {'symbol': vexp[pos], 'pos': pos};
    };

    const readScalar = function(vexp, pos) {
        const symbol = takeWhile(vexp.split('').slice(pos), (char, i) => {
            return (!isNaN(char) || char == '.'|| (char == '-' && i == 0));
        }).join();
        return {'symbol': Number(symbol), 'pos': pos + symbol.length - 1};
    };

    const readBracket = function(vexp, pos) {
        return {'symbol': vexp[pos], 'pos': pos};
    };

    this.realDate = realDate;
};

function convertToYearlyFrequency(vector, mode, years) {
    const month = maxMonth(vector);
    vector.data = dropWhile(vector.data, (point) => {
        return point.refper.getMonth() != month;
    });
    return vector.convertToFrequency(mode, function(curr, last) {
        return curr.getFullYear() == last.getFullYear() + years;
    });
}

function maxMonth(vector) {
    return Math.max.apply(
        null, vector.map((point) => point.refper.getMonth()));
}

function frequencyJoin(split, mode) {
    const modes = {
        'last': (vector) => vector.get(vector.length - 1),
        'sum': (vector) => {
            return newPointValue(
                vector.get(vector.length - 1), vector.sum());
        },
        'average': (vector) => {
            return newPointValue(
                vector.get(vector.length - 1), vector.average());
        },
        'max': (vector) => {
            return newPointValue(
                vector.get(vector.length - 1), vector.max());
        },
        'min': (vector) => {
            return newPointValue(
                vector.get(vector.length - 1), vector.min());
        }
    };

    return new Vector(split.map((chunk) => modes[mode || 'last'](chunk)));
}

function frequencySplit(vector, fn) {
    let result = [];
    const data = vector.data.reverse(); // Sort descending by time.

    let curr = data[0];
    let last = data[1];
    if (curr === undefined || last == undefined) {
        return [];
    }

    let next = [];

    for (let p = 0; p < data.length; p++) {
        last = data[p];
        // fn(curr, last)
        if (fn(curr.refper, last.refper)) {
            // Start new chunk.
            result.push(new Vector(next.reverse()));
            next = [];
            curr = data[p];
        }
        next.push(vector.get(p));
    }
    if (next.length > 0) {
        result.push(new Vector(next.reverse()));
    }

    // Ensure chunk sizes match the maximum to filter out periods.
    if (result.length > 0) {
        const size = Math.max.apply(null, result.map((v) => v.length));
        result = result.filter((chunk) => chunk.length == size);
    }

    return result.reverse();
}

function dropWhile(array, predicate) {
    let removeCount = 0;
    let i = array.length - 1;
    while (i > 0 && predicate(array[i], i)) {
        removeCount++;
        i--;
    }
    return array.slice(0, array.length - removeCount);
}

function takeWhile(array, predicate) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (!predicate(array[i], i)) {
            return result;
        } else {
            result.push(array[i]);
        }
    }
    return result;
}

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

// Merge but don't overwrite existing keys.
function safeMerge(target, source) {
    for (const key in source) {
        if (!(key in target)) {
            target[key] = source[key];
        }
    }
    return target;
}

function newPointValue(point, newValue) {
    return safeMerge({'refper': point.refper, 'value': newValue}, point);
}

function realDate(year, month, day) {
    return new Date(year, month - 1, day);
}

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

function formatDateObject(date) {
    if (typeof date === 'string') {
        return new Date(`${date.split('T')[0]}T00:00:00`);
    }
    return date;
}

function datestring(date) {
    return date.getFullYear() + '-'
        + (date.getMonth() + 1).toString().padStart(2, '0') + '-'
        + date.getDate().toString().padStart(2, '0');
}

function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function percentageChange(curr, last) {
    return last == 0 ? null : ((curr - last) / Math.abs(last)) * 100;
}

module.exports = {
    'Vector': Vector,
    'VectorLib': VectorLib
};
