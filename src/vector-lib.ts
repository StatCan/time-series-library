import Vector from './vector';

class VectorLib {

}

type operation = (a: number, b: number ) => number;
type nodeValue = number | Vector | operation;

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

function postfix(symbols: string[]): (string | undefined)[] {
    const stack = ['('];
    const post: (string | undefined)[] = [];
    symbols.push(')');

    for (let s = 0; s < symbols.length; s++) {
        const symbol = symbols[s];

        if (!isNaN(Number(symbol))) {
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
}

function splitSymbols(vexp: string): string[] {
    const split: string[] = [];

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
}

interface SymbolBuffer {
    symbol: string | number;
    pos: number;
}

function readVector(vexp: string, pos: number): SymbolBuffer {
    let symbol = 'v';
    symbol += takeWhile(vexp.split('').slice(pos + 1), (char) => {
        return !isNaN(char);
    }).join();
    return {'symbol': symbol, 'pos': pos + symbol.length - 1};
};

function readOperator(vexp: string, pos: number): SymbolBuffer {
    return {'symbol': vexp[pos], 'pos': pos};
};

function readScalar(vexp: string, pos: number): SymbolBuffer {
    const symbol = takeWhile(vexp.split('').slice(pos), (char, i) => {
        return (!isNaN(char) || char == '.'|| (char == '-' && i == 0));
    }).join();
    return {'symbol': Number(symbol), 'pos': pos + symbol.length - 1};
};

function readBracket(vexp: string, pos: number) {
    return {'symbol': vexp[pos], 'pos': pos};
};

const operatorPriorities: {[op: string]: number} = {
    '*': 2,
    '/': 2,
    '+': 1,
    '-': 1,
};

function priority(symbol: string): number {
    return symbol in operatorPriorities ? operatorPriorities[symbol] : 0;
}