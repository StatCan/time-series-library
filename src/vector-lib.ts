import Vector from './vector';
import Utils from './utils';

type nullableNumber = null | number;
type datestring = string | Date;

export default class VectorLib {
    /**
     * Get the set of vector IDs in a vector expression.
     * @param expression Vector expression. e.g.: `"v1 * (v2 - v3)"`
     * @return Vector IDs.
     */
    getVectorIds(expression: string) {
        expression = expression.replace(/ /g, '').toLowerCase();

        const allowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];

        const chunks = expression.split('v').slice(1);
        const ids = chunks.map((chunk) => {
            return Utils.takeWhile(chunk.split(''), (c) => allowed.includes(c));
        }).filter((id) => id.length > 0).map((id) => id.join(''));

        const unique: string[] = [];
        ids.map((id) => {
            if (!unique.includes(id)) unique.push(id);
        });
        return unique;
    }

    /**
     * Generate a @see Vector with a daily frequency using an
     * initilization list.
     * @param values Initialization list.
     * @param startDate Start date of vector.
     * @return Generated vector.
     */
    generateDaily(values: nullableNumber[], startDate: datestring) {
        startDate = Utils.dateObject(startDate);
        return this.generateVector(values, startDate, nextDay);
    }

    /**
     * Generate a @see Vector with a weekly frequency using an
     * initilization list.
     * @param values Initialization list.
     * @param startDate Start date of vector.
     * @return Generated vector.
     */
    generateWeekly(values: nullableNumber[], startDate: datestring): Vector {
        startDate = Utils.dateObject(startDate);
        return this.generateVector(values, startDate, nextWeek);
    }

    /**
     * Generate a @see Vector with a monthly frequency using an
     * initilization list.
     * @param values Initialization list.
     * @param startDate Start date of vector.
     * @return Generated vector.
     */
    generateMonthly(values: nullableNumber[], startDate: datestring): Vector {
        startDate = Utils.dateObject(startDate);
        startDate.setDate(
            Utils.daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return this.generateVector(values, startDate, nextMonth);
    };

    /**
     * Generate a @see Vector with a bi-monthly frequency using an
     * initilization list.
     * @param values Initialization list.
     * @param startDate Start date of vector.
     * @return Generated vector.
     */
    generateBiMonthly(values: nullableNumber[], startDate: datestring): Vector {
        startDate = Utils.dateObject(startDate);
        startDate.setDate(
            Utils.daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return this.generateVector(values, startDate, nextBiMonth);
    }

    /**
     * Generate a @see Vector with a quarterly frequency using an
     * initilization list.
     * @param values Initialization list.
     * @param startDate Start date of vector.
     * @return Generated vector.
     */
    generateQuarterly(values: nullableNumber[], startDate: datestring): Vector {
        startDate = Utils.dateObject(startDate);
        startDate.setDate(
            Utils.daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return this.generateVector(values, startDate, nextQuarter);
    }

    /**
     * Generate a @see Vector with a semi-annual frequency using an
     * initilization list.
     * @param values Initialization list.
     * @param startDate Start date of vector.
     * @return Generated vector.
     */
    generateSemiAnnual(values: nullableNumber[], startDate: datestring): Vector {
        startDate = Utils.dateObject(startDate);
        startDate.setDate(
            Utils.daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return this.generateVector(values, startDate, nextSemiAnnum);
    }

    /**
     * Generate a @see Vector with an annual frequency using an
     * initilization list.
     * @param values Initialization list.
     * @param startDate Start date of vector.
     * @return Generated vector.
     */
    generateAnnual(values: nullableNumber[], startDate: datestring): Vector {
        startDate = Utils.dateObject(startDate);
        startDate.setDate(
            Utils.daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return this.generateVector(values, startDate, nextAnnum);
    }

    /**
     * Generate a @see Vector with a bi-annual frequency using an
     * initilization list.
     * @param values Initialization list.
     * @param startDate Start date of vector.
     * @return Generated vector.
     */
    generateBiAnnual(values: nullableNumber[], startDate: datestring): Vector {
        startDate = Utils.dateObject(startDate);
        startDate.setDate(
            Utils.daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return this.generateVector(values, startDate, nextBiAnnum);
    }

    /**
     * Generate a @see Vector with a tri-annual frequency using an
     * initilization list.
     * @param values Initialization list.
     * @param startDate Start date of vector.
     * @return Generated vector.
     */
    generateTriAnnual(values: nullableNumber[], startDate: datestring): Vector {
        startDate = Utils.dateObject(startDate);
        startDate.setDate(
            Utils.daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return this.generateVector(values, startDate, nextTriAnnum);
    }

    generateQuadrennial(
        values: nullableNumber[], startDate: datestring): Vector {

        startDate = Utils.dateObject(startDate);
        startDate.setDate(
            Utils.daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return this.generateVector(values, startDate, nextQuadrennium);
    }

    /**
     * Generate a @see Vector with a quinquennial frequency using an
     * initilization list.
     * @param values Initialization list.
     * @param startDate Start date of vector.
     * @return Generated vector.
     */
    generateQuinquennial(
        values: nullableNumber[], startDate: datestring): Vector {

        startDate = Utils.dateObject(startDate);
        startDate.setDate(
            Utils.daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return this.generateVector(values, startDate, nextQuinquennium);
    }

    /**
     * Generate a @see Vector of a defined freqency using an
     * initilization list.
     * @param values Initialization list.
     * @param startDate Start date of vector.
     * @param nextDateFn Function to generate next refperence periods.
     * @return Generated vector.
     */
    generateVector(
        values: nullableNumber[], 
        startDate: Date, 
        nextDateFn: (date: Date) => Date): Vector {

        const vector = new Vector();
        let currDate = startDate;
        for (const value of values) {
            vector.push({'refper': currDate, 'value': value});
            currDate = nextDateFn(currDate);
        }
        return vector;
    }

    /**
     * Evaluate a vector expression.
     * @param expression Vector expression.
     * @param vectors Vectors.
     * @return Result of expression.
     */
    evaluate(expression: string, vectors: {[id: string]: Vector}): Vector {
        expression = expression.replace(/ /g, '');

        const infix = splitSymbols(expression);
        const post = postfix(infix);

        const stack = [];

        for (let s = 0; s < post.length; s++) {
            const symbol = post[s];

            if (typeof symbol === 'string' && symbol[0] == 'v') {
                stack.push(new ExpressionNode(vectors[symbol.substring(1)]));
            } else if (!isNaN(Number(symbol))) {
                stack.push(new ExpressionNode((symbol as number)));
            } else {
                const s1 = pop(stack);
                const s2 = pop(stack);

                const node = new ExpressionNode(operators[symbol]);
                node.left = s1;
                node.right = s2;

                stack.push(node);
            }
        }

        return pop(stack).result();
    }
}

const operators: {[op: string]: (a: number, b: number) => number} = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b
}

const operatorPriorities: {[op: string]: number} = {
    '*': 2,
    '/': 2,
    '+': 1,
    '-': 1,
};

type operation = (a: number, b: number ) => number;
type nodeValue = number | Vector | operation;
type exprSymbol = string | number;

class ExpressionNode {
    private _value: nodeValue;
    private _left: ExpressionNode | null;
    private _right: ExpressionNode | null;

    constructor(value: nodeValue) {
        this._value = value;
        this._left = null;
        this._right = null;
    }

    get value(): nodeValue {
        return this._value;
    }

    get left(): ExpressionNode | null {
        return this._left;
    }
    set left(value: ExpressionNode | null) {
        this._left = value;
    }

    get right(): ExpressionNode | null {
        return this._right;
    }
    set right(value: ExpressionNode | null) {
        this._right = value;
    }

    result(): nodeValue {
        if (this.value instanceof Vector || typeof this.value === 'number') {
            return this.value;
        } 
        if (this.left && this.right) {
            return operate(this.right.result(), this.left.result(), this.value);
        } 
        throw Error('Could not evaluate operator node.');  
    }
}


function operate(a: nodeValue, b: nodeValue, op: operation): nodeValue {
    if (a instanceof Vector && b instanceof Vector) {
        return a.operate(b, op);
    }
    if (a instanceof Vector && typeof b === 'number') {
        return vectorScalarOperate(a, b, op)
    }
    if (typeof a === 'number' && b instanceof Vector) {
        return vectorScalarOperate(b, a, op);
    }
    if (typeof a === 'number' && typeof b === 'number') {
        return op(a, b);
    }
    throw Error('Cannot perform operation on two nodes.');
}

function vectorScalarOperate(vector: Vector, scalar: number, op: operation) {
    const data = vector.data.map((point) => {
        if (point.value) {
            return Vector.newPointValue(point, op(point.value, scalar));
        }
        return Vector.newPointValue(point, null);
    });
    return new Vector(data);
}

function postfix(symbols: exprSymbol[]): exprSymbol[] {
    const stack: exprSymbol[] = ['('];
    const post: exprSymbol[] = [];
    symbols.push(')');

    for (let s = 0; s < symbols.length; s++) {
        const symbol = symbols[s];

        if (!isNaN(Number(symbol))) {
            post.push(symbol);
        } else if ((symbol as string)[0] == 'v') {
            post.push(symbol);
        } else if (symbol == '(') {
            stack.push('(');
        } else if (symbol == ')') {
            while (stack[stack.length - 1] != '(') {
                post.push(pop(stack));
            }
            stack.pop();
        } else {
            while (priority(<string>symbol) 
                    <= priority(<string>stack[stack.length - 1])) {
                post.push(pop(stack));
            }
            stack.push(symbol);
        }
    }

    return post;
}

function splitSymbols(vexp: string): exprSymbol[] {
    const split: exprSymbol[] = [];

    for (let pos = 0; pos < vexp.length; pos++) {
        let next = null;

        if (vexp[pos] == 'v' || vexp[pos] == 'V') {
            next = readVector(vexp, pos);
        } else if (!isNaN(Number(vexp[pos]))
            || (vexp[pos] == '-' && isNaN(Number(vexp[pos - 1]))
                && !isNaN(Number(vexp[pos + 1])))) {
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
}

interface SymbolBuffer {
    symbol: string | number;
    pos: number;
}

function readVector(vexp: string, pos: number): SymbolBuffer {
    let symbol = 'v';
    symbol += Utils.takeWhile(vexp.split('').slice(pos + 1), (char) => {
        return !isNaN(char);
    }).join('');
    return {'symbol': symbol, 'pos': pos + symbol.length - 1};
};

function readOperator(vexp: string, pos: number): SymbolBuffer {
    return {'symbol': vexp[pos], 'pos': pos};
};

function readScalar(vexp: string, pos: number): SymbolBuffer {
    const symbol = Utils.takeWhile(vexp.split('').slice(pos), (char, i) => {
        return (!isNaN(char) || char == '.'|| (char == '-' && i == 0));
    }).join('');
    return {'symbol': Number(symbol), 'pos': pos + symbol.length - 1};
};

function readBracket(vexp: string, pos: number) {
    return {'symbol': vexp[pos], 'pos': pos};
};

function priority(symbol: string): number {
    return symbol in operatorPriorities ? operatorPriorities[symbol] : 0;
}

function pop(array: any[]): any {
    const item = array.pop();
    if (item) {
        return item;
    } else {
        throw Error('Cannot pop empty array.');
    }
}

function nextDay(date: Date): Date {
    return new Date(
        date.getFullYear(), date.getMonth(), date.getDate() + 1);
};

function nextWeek(date: Date): Date {
    return new Date(
        date.getFullYear(), date.getMonth(), date.getDate() + 7);
};

function nextMonth(date: Date): Date {
    return addMonths(date, 1);
};

function nextBiMonth(date: Date): Date {
    return addMonths(date, 2);
};

function nextQuarter(date: Date): Date {
    return addMonths(date, 3);
};

function nextSemiAnnum(date: Date): Date {
    return addMonths(date, 6);
};

function nextAnnum(date: Date): Date {
    return new Date(
        date.getFullYear() + 1, date.getMonth(), date.getDate());
};

function nextBiAnnum(date: Date): Date {
    return new Date(
        date.getFullYear() + 2, date.getMonth(), date.getDate());
};

function nextTriAnnum(date: Date): Date {
    return new Date(
        date.getFullYear() + 3, date.getMonth(), date.getDate());
};

function nextQuadrennium(date: Date): Date {
    return new Date(
        date.getFullYear() + 4, date.getMonth(), date.getDate());
}

function nextQuinquennium(date: Date): Date {
    return new Date(
        date.getFullYear() + 5, date.getMonth(), date.getDate());
};

function addMonths(date: Date, months: number): Date {
    const currYear = date.getFullYear();
    const currMonth = date.getMonth();
    const newYear = currYear + Math.floor((currMonth + months) / 12);
    const newMonth = (currMonth + (months % 12)) % 12;
    return new Date(newYear, newMonth, Utils.daysInMonth(newYear, newMonth));
}

