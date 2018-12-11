if (typeof window === 'undefined') {
    // Running in Node.js.

}
else {
    // Running in browser.
    var module = { }; // Prevent browser exception when exporting as module.
}

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


    this.copy = function(vector) {
        let copyVector = [];
        for (let p = 0; p < vector.length; p++) {
            let copyPoint = {
                'refper': vector[p]['refper'],
                'value': vector[p]['value']
            };
            safeMerge(copyPoint, vector[p]);
            copyVector.push(copyPoint);
        }
        return copyVector;
    }


    this.range = function(vector, startDate, endDate) {
        startDate = formatDateObject(startDate);
        endDate = formatDateObject(endDate);

        let rangeFilter = function(point) {
            return formatDateObject(point.refper) >= startDate
                    && formatDateObject(point.refper) <= endDate
        };
        return filter(vector, rangeFilter);
    }


    this.interoperable = function(vectorA, vectorB) {
        if (vectorA.length != vectorB.length) {
            return false;
        }
        
        for (let p = 0; p < vectorA.length; p++) {
            if (vectorA[p].refper != vectorB[p].refper) {
                return false;
            }
        }
        
        return true;  
    };

    this.formatDateObject = function(vector) {
        for (let p = 0; p < vector.length; p++) {
            vector[p].refper = formatDateObject(vector[p].refper);
        }
    };

    this.formatDateString = function(vector) {
        for (let p = 0; p < vector.length; p++) {
            vector[p].refper = formatDateString(vector[p].refper);
        }
    };

    this.intersection = function(vectors) {
        if (Array.isArray(vectors)) {
            return arrayIntersection(vectors);
        } 
        else {
            // Handle dictionary of ID -> Vector.
            let ids = [];
            let vectorArray = [];
            for (vectorId in vectors) {
                ids.push(vectorId);
                vectorArray.push(vectors[vectorId]);
            }

            let intersect = arrayIntersection(vectorArray);
            let result = {};
            for (let v = 0; v < intersect.length; v++) {
                result[ids[v]] = intersect[v];
            }

            return result;
        }
    }

    function arrayIntersection(vectors) {
        let flatVectors = {};
        
        for (let v = 0; v < vectors.length; v++) {
            let vector = vectors[v];
            
            for (let p = 0; p < vector.length; p++) {
                let refper = vector[p].refper;
                if (!(refper in flatVectors)) {
                    flatVectors[refper] = [];
                }
                flatVectors[refper].push(vector[p]);
            }
        }
        
        // Get max vector for iterating
        let intersection = [];
        
        let maxV = 0;
        let maxL = vectors[0].length;
        for (let v = 0; v < vectors.length; v++) {
            if (vectors[v].length > maxL) {
                maxV = v;
                maxL = vectors[v].length;
            }
            
            intersection.push([]);
        }
        maxV = vectors[maxV];
        
        for (let p = 0; p < maxV.length; p++) {
            let point = maxV[p];
            if (!(point.refper in flatVectors)) continue;
            if (flatVectors[point.refper].length == vectors.length) {
                let flatPoint = flatVectors[point.refper];
                for (let f = 0; f < flatPoint.length; f++) {
                    intersection[f].push(flatPoint[f]);
                }
            }
        }		
        
        return intersection;
    }

    this.periodToPeriodPercentageChange = function(vector) {
        return periodDeltaTransformation(
                vector, (curr, last) => ((curr - last) / Math.abs(last)) * 100);
    };

    this.periodToPeriodDifference = function(vector) {
        return periodDeltaTransformation(
                vector, (curr, last) => curr - last);
    };

    this.samePeriodPreviousYearPercentageChange = function(vector) {
        return undefined;
    };

    periodDeltaTransformation = function(vector, operation) {
        // TODO: Better name for this and expose to API.
        let result = [];

        for (let p = 0; p < vector.length; p++) {
            let value = null;
            if (vector[p-1] != undefined) {
                let lastVal = vector[p - 1].value;
                let currVal =  vector[p].value;
                value = operation(currVal, lastVal);
            }
            let point = {'refper': vector[p].refper, 'value': value};
            safeMerge(point, vector[p]);
            result.push(point)
        }

        return result;
    };

    periodTransformation = function(vector, operation) {
        let result = [];
        
        for (let p = 0; p < vector.length; p++) {
            let point = {
                'refper': vector[p].refper,
                'value': operation(vector[p].value)
            };
            safeMerge(point, vector[p]);
            result.push(point);
        }

        return result;
    };

    this.filter = function(vector, predicate) {
        return filter(vector, predicate);
    }

    function filter(vector, predicate) {
        let result = [];
        for (point of vector) {
            if (predicate(point)) result.push(point);
        } 
        return result;
    }

    this.round = function(vector, decimals) {
        for (let p = 0; p < vector.length; p++) {
            let value = vector[p]['value'];
            vector[p]['value'] = scalarRound(value, decimals);
        }
        return vector;
    };

    this.roundBankers = function(vector, decimals) {
        for (let p = 0; p < vector.length; p++) {
            let value = vector[p]['value'];
            vector[p]['value'] = scalarRoundBankers(value, decimals);
        }
        return vector;
    }

    function scalarRound(value, decimals) {
        decimals = decimals || 0;
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }

    function scalarRoundBankers(value, decimals) {
        decimals = decimals || 0;
        let x = value * Math.pow(10, decimals);
        let r = Math.round(x);
        let br = Math.abs(x) % 1 === 0.5 ? (r % 2 === 0 ? r : r-1) : r;
        return br / Math.pow(10, decimals);
    }
 
    this.getVectorIds = function(expression) {
        expression = expression.replace(/ /g, '');
        let ids = [];	
        let nextId = "";
        for (let c = 0; c < expression.length; c++) {
            if (expression[c] == 'v' && !isNaN(expression[c + 1])) {
                nextId = "v";
            }
            else if (nextId != "" && !isNaN(expression[c])) {
                nextId += expression[c];
            } else {
                if (nextId != "") ids.push(nextId.substring(1));
                nextId = "";
            }
        }
        
        if (nextId != "") ids.push(nextId.substring(1));
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
                        this.right.result(), 
                        this.left.result(), 
                        this.operation);
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
            safeMerge(newPoint, vector[p]);
            
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
                throw new Error("Vectors are not interoperable.");
            }
            
            let newPoint =  {
                'refper': vectorA[p].refper, 
                'value': operation(vectorA[p].value, vectorB[p].value)
            };
            
            // Merge keys added by the user.
            safeMerge(newPoint, vectorA[p]);
            
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
            else if (!isNaN(vexp[pos]) 
                    || (vexp[pos] == '-' && isNaN(vexp[pos - 1]) && !isNaN(vexp[pos + 1]))) {
                next = readScalar(vexp, pos);
            }
            else if (vexp[pos] in operators) {
                next = readOperator(vexp, pos);
            }
            else if (vexp[pos] == '(' || vexp[pos] == ')') {
                next = readBracket(vexp, pos);
            }
            else {
                throw new Error(
                        "Unrecognized symbol at position " + pos + ".");
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
    
    
    // Merge but don't overwrite existing keys.
    safeMerge = function(target, source) {
        for (key in source) {
            if (!(key in target)) {
                target[key] = source[key];
            }
        }
    }

    formatDateObject = function(date) {
        if (typeof date === 'string') return stringToDate(date);
        return date;
    }

    formatDateString = function(date) {
        if (typeof date === 'string') return date;
        return datestring(date);
    }

    stringToDate = function(datestring) {
        let split = datestring.split('-');
        return realDate(
                split[0], unpad(split[1], "0"), Number(unpad(split[2], "0")));
    }
    
    datestring = function(date) {
        return date.getUTCFullYear() + "-"
                + (date.getUTCMonth() + 1).toString().padStart(2, "0") + "-"
                + date.getUTCDate().toString().padStart(2, "0");
    }   
    
    realDate = function(year, month, day) {
        return new Date(Date.UTC(year, month - 1, day));
    }

    this.realDate = function(year, month, day) {
        return realDate(year, month, day);
    }

    function unpad(str, chr) {
        let start = 0;
        for (let c = 0; c < str.length; c++) {
            if (str[c] != chr) break;
            start++;
        }
        return str.substring(start);
    }  
}

module.exports = VectorLib;