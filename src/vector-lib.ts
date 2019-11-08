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
    public getVectorIds(expression: string) {
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
    public generateDaily(values: nullableNumber[], startDate: datestring) {
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
    public generateWeekly(
        values: nullableNumber[], startDate: datestring
    ): Vector {
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
    public generateMonthly(
        values: nullableNumber[], startDate: datestring
    ): Vector {
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
    public generateBiMonthly(
        values: nullableNumber[], startDate: datestring
    ): Vector {
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
    public generateQuarterly(
        values: nullableNumber[], startDate: datestring
    ): Vector {
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
    public generateSemiAnnual(
        values: nullableNumber[], startDate: datestring
    ): Vector {
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
    public generateAnnual(
        values: nullableNumber[], startDate: datestring
    ): Vector {
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
    public generateBiAnnual(
        values: nullableNumber[], startDate: datestring
    ): Vector {
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
    public generateTriAnnual(
        values: nullableNumber[], startDate: datestring
    ): Vector {
        startDate = Utils.dateObject(startDate);
        startDate.setDate(
            Utils.daysInMonth(startDate.getFullYear(), startDate.getMonth()));
        return this.generateVector(values, startDate, nextTriAnnum);
    }

    public generateQuadrennial(
        values: nullableNumber[], startDate: datestring
    ): Vector {

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
    public generateQuinquennial(
        values: nullableNumber[], startDate: datestring
    ): Vector {

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
    public generateVector(
        values: nullableNumber[], 
        startDate: Date, 
        nextDateFn: (date: Date) => Date
    ): Vector {

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
    public evaluate(
        expression: string, vectors: {[id: string]: Vector}
    ): Vector {
        expression = expression.replace(/ /g, '');

        const stateMachine = new StateMachine();
        const infix = stateMachine.readExpression(expression);
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
};

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

    public constructor(value: nodeValue) {
        this._value = value;
        this._left = null;
        this._right = null;
    }

    public get value(): nodeValue {
        return this._value;
    }

    public get left(): ExpressionNode | null {
        return this._left;
    }
    public set left(value: ExpressionNode | null) {
        this._left = value;
    }

    public get right(): ExpressionNode | null {
        return this._right;
    }
    public set right(value: ExpressionNode | null) {
        this._right = value;
    }

    public result(): nodeValue {
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
        return vectorScalarOperate(a, b, op);
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

enum State {
    start = 'start',
    scalar = 'scalar',
    decimal = 'decimal',
    vector = 'vector',
    operator = 'operator',
    bracket = 'bracket',
    end = 'end'
}

function isNumber(char: string): boolean {
    return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(char);
}

function isBracket(char: string): boolean {
    return ['(', ')'].includes(char);
}

function isVectorIdentifier(char: string): boolean {
    return ['v', 'V'].includes(char);
}

function isOperator(char: string): boolean {
    return ['+', '-', '/', '*'].includes(char);
}

function isDecimal(char: string): boolean {
    return char === '.';
}

function isEmptyString(char: string): boolean {
    return char == '';
}

type TransitionMap = {[key in State]: ((char: string) => boolean) | null}

class StateMachine {
    public static transitions: {[key in State]: TransitionMap} = {
        [State.start]: {
            [State.start]: null,
            [State.scalar]: isNumber,
            [State.decimal]: null,
            [State.bracket]: isBracket, 
            [State.operator]: null,
            [State.vector]: isVectorIdentifier,
            [State.end]: null
        },
        [State.scalar]: {
            [State.start]: null,
            [State.scalar]: isNumber, 
            [State.decimal]: isDecimal,
            [State.bracket]: isBracket, 
            [State.operator]: isOperator,
            [State.vector]: isVectorIdentifier,
            [State.end]: isEmptyString
        },
        [State.decimal]: {
            [State.start]: null,
            [State.scalar]: null,
            [State.decimal]: isNumber,
            [State.bracket]: isBracket,
            [State.operator]: isOperator,
            [State.vector]: isVectorIdentifier,
            [State.end]: isEmptyString
        },
        [State.bracket]: {
            [State.start]: null,
            [State.scalar]: isNumber, 
            [State.decimal]: null,
            [State.bracket]: isBracket, 
            [State.operator]: isOperator,
            [State.vector]: isVectorIdentifier,
            [State.end]: isEmptyString
        },
        [State.operator]: {
            [State.start]: null,
            [State.scalar]: isNumber, 
            [State.decimal]: null,
            [State.bracket]: isBracket, 
            [State.operator]: null,
            [State.vector]: isVectorIdentifier,
            [State.end]: isEmptyString
        },
        [State.vector]: {
            [State.start]: null,
            [State.scalar]: null, 
            [State.decimal]: null,
            [State.bracket]: isBracket, 
            [State.operator]: isOperator,
            [State.vector]: isNumber,
            [State.end]: isEmptyString,
        },
        [State.end]: {
            [State.start]: null,
            [State.scalar]: null, 
            [State.decimal]: null,
            [State.bracket]: null, 
            [State.operator]: null,
            [State.vector]: null,
            [State.end]: null,
        }
    };

    private _state: State;

    public constructor() {
        this._state = State.start;
    }

    public get state(): State {
        return this._state;
    }

    public readExpression(expr: string): exprSymbol[] {
        const tokens: exprSymbol[] = [];

        const convertToken = (token: exprSymbol): exprSymbol => {
            if (token != '' && !isNaN(Number(token))) return Number(token);
            return token;
        };

        for (let c = 0; c < expr.length; c++) {
            let nextState = this._nextState(expr[c], c);

            if (nextState != this._state) {
                tokens.push('');
                this._state = nextState;
            }

            tokens[tokens.length - 1] += expr[c];
        }

        // Should transition to end state if expression is valid.
        this._state = this._nextState('', expr.length - 1);

        return tokens.map(convertToken);
    }

    private _nextState(char: string, pos: number): State {
        const transitions = StateMachine.transitions[this._state];
        const nextState = Object.keys(transitions).find((state) => {
            const fn = transitions[state as State];
            return fn !== null && fn(char);
        });
        if (!nextState) {
            throw Error(`Error parsing character at position ${pos}`);
        }
        return nextState as State;
    }
}

