VectorLib = function() {
    operators = {
        '+': function(a, b) { return a + b; },
        '-': function(a, b) { return a - b; },
        '*': function(a, b) { return a * b; },
        '/': function(a, b) { return a / b; }
    };
    
    operatorPriorities = {
        '*': 2,
        '/': 2,
        '+': 1,
        '-': 1,
    };
    
    
    this.equals = function(vectorA, vectorB) {
        if (vectorA.length != vectorB.length) {
            return false;
        }
        
        for (let p = 0; p < vectorA.length; p++) {
            if (vectorA[p].refper != vectorB[p].refper) {
                return false;
            }
            if (vectorA[p].value != vectorB[p].value) {
                return false;
            }
        }
        
        return true;
    }
    
    
    this.getVectorIds = function(expression) {
        expression = expression.replace(/ /g, '');
        let ids = [];	
        let nextId = "";
        for (let c = 0; c < expression.length; c++) {
            if (!isNaN(expression[c])) {
                nextId += expression[c];
            } else {
                if (nextId != "") ids.push(nextId);
                nextId = "";
            }
        }
        
        if (nextId != "") ids.push(nextId);
        return ids;
    }
    
    
    this.evaluate = function(expression, vectors) {
        // {'v1': {'refper': "2018-01-01", 'value': 1}, ...}
        expression = expression.replace(/ /g, '')
    
        let infix = splitSymbols(expression);
        let post = postfix(infix);
            
        let stack = [];
        
        for (let s = 0; s < post.length; s++) {
            let symbol = post[s];
            
            if (typeof symbol === 'string' && symbol.startsWith('v')) {
                stack.push(new ExpressionNode(vectors[symbol]));			
            }
            else if (!isNaN(symbol)) {
                stack.push(new ExpressionNode(symbol));
            }
            else {
                let s1 = stack.pop();
                let s2 = stack.pop();
                
                let node = new ExpressionNode(operators[symbol]);
                node.left = s1;
                node.right = s2;
                
                stack.push(node);
            }
        }
        
        return stack.pop().result();
    };
    
    
    ExpressionNode = function(value) {
        this.operation = null;
        this.value = null;  
        this.left = null;
        this.right = null;
        
        if (Array.isArray(value) || !isNaN(value)) {
            this.value = value;
        }
        else {
            this.operation = value;
        }
        
        
        /**
         * Returns a value based on the operation of this node.
        **/
        this.result = function() {
            if (this.isVector() || this.isScalar()) {
                return this.value;
            }  
            else {
                if (this.left == null || this.right == null) {
                    throw new Error('Could not evaluate operator node.'); 
                }
            
                return operate(
                        this.right.result(), this.left.result(), this.operation);
            } 
        }
        
        this.hasChildren = function() {
            return !(this.left == null && this.right == null);
        }
        
        this.isOperator = function() {
            return this.operation != null;
        }

        this.isVector = function() {
            return this.operation == null && Array.isArray(this.value);
        }
        
        this.isScalar = function() {
            return this.operation == null && !isNaN(this.value);
        }
    };
    
    
    /**
     * Returns a vector based on an operation 
     *
     * operation: Function to apply to vector values. 
    **/
    operate = function(valueA, valueB, operation) {
        if (Array.isArray(valueA) && Array.isArray(valueB)) {
            return vectorOperate(valueA, valueB, operation);
        }
        if (Array.isArray(valueA) && !isNaN(valueB)) {
            return vectorScalarOperate(valueA, valueB, operation);
        }	
        if (!isNaN(valueA) && Array.isArray(valueB)) {
            return vectorScalarOperate(valueB, valueA, operation);
        }
        if (!isNaN(valueA) && !isNaN(valueB)) {
            return operation(valueA, valueB);
        }
        
        throw new Error("Unsupported types for operation.");
    };


    vectorScalarOperate = function(vector, scalar, operation) {
        let result = [];
        
        for (let p = 0; p < vector.length; p++) {
            let newPoint = {
                'refper': vector[p].refper,
                'value': operation(vector[p].value, scalar)
            };
            
            // Merge keys added by the user.
            for (key in vector[p]) {
                if (key != 'refper' && key != 'value') {
                    newPoint[key] = vector[p][key];
                }
            }
            
            result.push(newPoint);
        }
        
        return result;
    };


    vectorOperate = function(vectorA, vectorB, operation) {
        // Check if vector lengths match.
        if (vectorA.length != vectorB.length) {
            throw new Error("Vector lengths do not match.");
        }
    
        let result = [];
        
        for (let p = 0; p < vectorA.length; p++) {
            let refperA = vectorA[p].refper;
            let refperB = vectorB[p].refper;
            if (refperA instanceof Date) refperA = refperA.getTime();
            if (refperB instanceof Date) refperB = refperB.getTime();
            
            // Reference period of both vectors points must match.
            if (refperA != refperB) {
                throw new Error("Vectors are not interopable.");
            }
            
            let newPoint =  {
                'refper': vectorA[p].refper, 
                'value': operation(vectorA[p].value, vectorB[p].value)
            };
            
            // Merge keys added by the user.
            for (key in vectorA[p]) {
                if (key != 'refper' && key != 'value') {
                    newPoint[key] = vectorA[p][key];
                }
            }
            
            result.push(newPoint);
        }
        
        return result;
    };


    postfix = function(symbols) {
        let stack = ['('];
        let post = [];
        symbols.push(')');
        
        for (let s = 0; s < symbols.length; s++) {
            let symbol = symbols[s];
            
            if (!isNaN(symbol)) {
                post.push(symbol);
            }
            else if (symbol.startsWith('v')) {
                post.push(symbol);
            }
            else if (symbol == '(') {		
                stack.push('(');
            }	
            else if (symbol == ')') {
                while (stack[stack.length - 1] != '(') {
                    post.push(stack.pop());
                }
                stack.pop();
            } 	
            else {
                while(priority(symbol) <= priority(stack[stack.length - 1])) {
                    post.push(stack.pop());
                }
            
                stack.push(symbol);
            }
        }
        
        return post;
    };


    priority = function(symbol) {
        if (symbol in operatorPriorities) {
            return operatorPriorities[symbol];
        }
        
        return 0;
    };


    splitSymbols = function(vexp) {
        let split = [];
        
        for (let pos = 0; pos < vexp.length; pos++) {
            let next = null;
            
            if (vexp[pos] == 'v' || vexp[pos] == 'V') {
                next = readVector(vexp, pos);
            }
            else if (!isNaN(vexp[pos]) || 
                    (vexp[pos] == '-' && isNaN(vexp[pos - 1]) && !isNaN(vexp[pos + 1]))) {
                next = readScalar(vexp, pos);
            }
            else if (vexp[pos] in operators) {
                next = readOperator(vexp, pos);
            }
            else if (vexp[pos] == '(' || vexp[pos] == ')') {
                next = readBracket(vexp, pos);
            }
            else {
                throw new Error("Unrecognized symbol at position " + pos + ".");
            }
            
            split.push(next.symbol);
            pos = next.pos;
        }

        return split;
    };


    readVector = function(vexp, pos) {
        let symbol = "v";
        pos++;
        
        while(!isNaN(vexp[pos]) && pos < vexp.length) {
            symbol += vexp[pos];
            pos++;		
        }

        return {'symbol': symbol, 'pos': pos - 1};
    };


    readOperator = function(vexp, pos) {
        return {'symbol': vexp[pos], 'pos': pos};
    };


    readScalar = function(vexp, pos) {
        let symbol = "";
        let start = pos;
        
        while ((!isNaN(vexp[pos]) || vexp[pos] == '.' 
                || (vexp[pos] == '-' && pos == start)) 
                && pos < vexp.length) {
            symbol += vexp[pos];	
            pos++;
        }
        
        return {'symbol': Number(symbol), 'pos': pos - 1};
    };


    readBracket = function(vexp, pos) {
        return {'symbol': vexp[pos], 'pos': pos};
    };

    
    validateBrackets = function(vexp) {
        // TODO: Expand on this to also return position of incorrect bracket.
        let stack = [];
        
        for (let c = 0; c < vexp.length; c++) {
            if (vexp[c] == '(') {
                stack.push(1);
            }
            if (vexp[c] == ')') {
                if (stack.length == 0) return false;
                stack.pop();
            }
        }

        return stack.length == 0;
    };
}

module.exports = VectorLib;

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

let testcases = [
    {
        'expression': "(v1 + v2) * (2*v3)",
        'expected': [
            {'refper': "2018-01-01", 'value': 16},
            {'refper': "2018-02-01", 'value': 24}
        ]
    },
    {
        'expression': "(v1 - v2) * (2*v3)",
        'expected': [
            {'refper': "2018-01-01", 'value': -8},
            {'refper': "2018-02-01", 'value': -8}
        ]
    },
    {
        'expression': "v6 - v5 - v4",
        'expected': [
            {'refper': "2018-01-01", 'value': 2},
            {'refper': "2018-02-01", 'value': 1},
            {'refper': "2018-03-01", 'value': 0}
        ]
    }
];

let runTest = function(testcase) {
    let parser = new VectorLib();
    let result = parser.evaluate(testcase.expression, vectors);
    
    console.log(testcase.expression);
    console.log("Result:");
    console.log(result);
    console.log("Expected:");
    console.log(testcase.expected);
    
    if (parser.equals(result, testcase.expected)) {
        console.log("PASS");
        return true;
    }
    else {
        console.log("FAIL");
        return false;
    }
}

let passes = 0;
for (let t = 0; t < testcases.length; t++) {
    if (runTest(testcases[t])) {
        passes++;
        console.log("===================");
    } 
}
console.log(passes + " / " + testcases.length + " tests passed.");