interface Point {
    refper: Date;
    value: number | null;
    metadata?: any;
}

interface PointStr {
    refper: string;
    value: number | null;
    metadata?: any;
}

type transformation = (a: number) => number;
type operation = (a: number, b: number) => number;
type nullableOperation = (a: number, b: number) => number | null;

class Vector {
    private _data: Point[]; 

    constructor(data?: Point[] | PointStr[]) {
        if (data && data.length > 0) {
            if (Vector.isPointStr(data[0])) {
                this._data = (data as PointStr[]).map(Vector.formatPoint);
            } else {
                this._data = data as Point[];
            }
        } else {
            this._data = [];
        }   
    }

    get data(): Point[] {
        return this._data;
    }

    get length(): number {
        return this.data.length;
    }

    get(index: number): Point {
        return this.data[index];
    }

    refper(index: number): Date {
        return this.data[index].refper;
    }

    refperStr(index: number): string {
        return datestring(this.refper(index));
    }

    value(index: number): number | null {
        return this.data[index].value;
    }

    values(): number[] {
        return this.map((point: Point) => point.value);
    }

    push(point: Point | PointStr) {
        this.data.push(Vector.formatPoint(point));
    }

    equals(other: Vector, index?: number): boolean {
        const pointEquals = (a: Point, b: Point): boolean => {
            return a.refper.getTime() == b.refper.getTime()
                && a.value == b.value;
        };
        if (index) return pointEquals(this.get(index), other.get(index));
        if (this.length !== other.length) return false;
        return !this.some((point, i) => !pointEquals(point, other.get(i)));
    }

    copy(): Vector {
        this.data.map
        return new Vector(
            this.map((point) => Vector.newPointValue(point, point.value)));
    }

    map(fn: (val: Point, i: number, arr: Point[]) => any, th?: any): any[] {
        return this.data.map(fn, th);
    }

    find(
        fn: (val: Point, i: number, arr: Point[]) => any, 
        th?: any): Point | undefined {

        return this.data.find(fn, th);
    }

    some(fn: (val: Point, i: number, arr: Point[]) => any, th?: any): boolean {
        return this.data.some(fn, th);
    }

    filter(
        fn: (val: Point, i: number, arr: Point[]) => boolean, 
        th?: any): Vector {
        
        return new Vector(this.data.filter(fn, th));
    }

    range(startDate: Date | string, endDate: Date | string): Vector {
        startDate = dateObject(startDate);
        endDate = dateObject(endDate);
        return this.filter((p) => p.refper >= startDate && p.refper <= endDate);
    }

    latestN(n: number): Vector {
        if (n > this.length) throw Error('N > length of vector.');
        return new Vector(this.data.slice(-n));
    }

    interoperable(other: Vector): boolean {
        if (this.length != other.length) return false;
        return !this.some((point, i) => {
            return point.refper.getTime() != other.refper(i).getTime();
        });
    }

    intersection(others: Vector[] | Vector): Vector {
        if (!Array.isArray(others)) others = [others];

        const refperCounts: {[date: number]: number} = {};

        const thisRefpers = this.data.map((p) => p.refper);
        const otherRefpers = others.reduce((acc: Date[], cur: Vector) => {
            return [...acc, ...cur.map((p: Point) => p.refper)];
        }, []);
        const refpers = [...thisRefpers, ...otherRefpers];

        refpers.map((refper) => {
            if (Number(refper) in refperCounts) refperCounts[Number(refper)]++;
            else refperCounts[Number(refper)] = 1;
        });

        return this.filter((p) => {
            return refperCounts[Number(p.refper)] == others.length + 1;
        });
    }

    sum(): number {
        return this.reduce((acc, cur) => acc + cur, 0);
    }

    average(): number | null {
        return this.length > 0 ? this.sum() / this.length : null;
    }

    max(): number {
        return Math.max(...this.values());
    }

    min(): number {
        return Math.min(...this.values());
    }
    
    reduce(
        fn: (acc: any, cur: any, i: number, arr: any[]) => any, 
        init?: any): any  {

        init = init === undefined ? this.value(0) : init;
        return this.map((p) => p.value).reduce(fn, init);
    }

    operate(other: Vector, op: operation): Vector {
        const a = this.intersection(other);
        const b = other.intersection(this);
        const data = a.data.map((pointA, i) => {
            return Vector.pointOperate(pointA, b.get(i), op);
        });
        return new Vector(data);
    }

    periodDeltaTransformation(op: nullableOperation): Vector {
        const data = this.data.map((point, i, data) => {
            if (data[i-1] === undefined) {
                return Vector.newPointValue(point, null);
            }

            const last = data[i-1].value;
            const cur = data[i].value;
            if (last && cur) {
                return Vector.newPointValue(point, op(cur, last));
            }
            return Vector.newPointValue(point, null);
        });
        return new Vector(data);
    }

    samePeriodPreviousYearTransformation(op: nullableOperation): Vector {
        // Only works on frequecnies > monthly for now.
        // Create dictionary mapping dates to values.
        const set: {[date: number]: Point} = {};
        for (const d of this.data) {
            const endOfMonth = new Date(
                d.refper.getFullYear(),
                d.refper.getMonth(),
                daysInMonth(d.refper.getFullYear(), d.refper.getMonth()));
            set[Number(endOfMonth)] = d;
        }

        const result = new Vector();
        for (const point of this.data) {
            const refper = point.refper;
            const previousYear = new Date(
                refper.getFullYear() - 1,
                refper.getMonth(),
                daysInMonth(refper.getFullYear() - 1, refper.getMonth()));

            if (Number(previousYear) in set) {
                result.push(
                    Vector.pointOperate(point, set[Number(previousYear)], op))
            } else {
                result.push(Vector.newPointValue(point, null))
            }
        }
        return result;
    }

    periodTransformation(op: transformation): Vector {
        const data = this.data.map((point) => {
            if (point.value) {
                return Vector.newPointValue(point, op(point.value));
            }
            return Vector.newPointValue(point, null);
        });
        return new Vector(data);
    }

    periodToPeriodPercentageChange(): Vector {
        return this.periodDeltaTransformation(percentageChange);
    }

    periodToPeriodDifference(): Vector {
        return this.periodDeltaTransformation((cur, last) => cur - last);
    }

    samePeriodPreviousYearPercentageChange(): Vector {
        return this.samePeriodPreviousYearTransformation(percentageChange);
    }

    samePeriodPreviousYearDifference(): Vector {
        return this.samePeriodPreviousYearTransformation((cur, last) => {
            return cur - last;
        });
    }

    convertToFrequency(
        mode: string, converter: (cur: Date, last: Date) => boolean): Vector {
        const split = Vector.frequencySplit(this, converter);
        return Vector.frequencyJoin(split, mode);
    }

    quinquennial(mode: string='last'): Vector {
        return Vector.convertToYearlyFrequency(this, mode, 5);
    }

    triAnnual(mode: string='last'): Vector {
        return Vector.convertToYearlyFrequency(this, mode, 3);
    }

    biAnnual(mode: string='last'): Vector {
        return Vector.convertToYearlyFrequency(this, mode, 2);
    }

    annual(mode: string='last'): Vector {
        return Vector.convertToYearlyFrequency(this, mode, 1);
    }

    semiAnnual(mode: string='last'): Vector {
        return this.convertToFrequency(mode, (curr, last) => {
            return curr.getMonth() === (last.getMonth() + 6) % 12;
        });
    }

    quarterly(mode: string='last'): Vector {
        return this.convertToFrequency(mode, (curr, last) => {
            return curr.getMonth() === (last.getMonth() + 3) % 12;
        });
    }

    monthly(mode: string='last'): Vector {
        return this.convertToFrequency(mode, (curr, last) => {
            return curr.getMonth() == (last.getMonth() + 1) % 12;
        });
    }

    biMonthly(mode: string='last'): Vector {
        return this.convertToFrequency(mode, (curr, last) => {
            return curr.getMonth() == (last.getMonth() + 2) % 12;
        });
    }

    weekly(mode: string='last'): Vector {
        return this.convertToFrequency(mode, function(curr, last) {
            return curr.getDay() == last.getDay() &&
                curr.getDate() != last.getDate(); // FIXME: Should not be needed
        });
    }

    round(decimals?: number): Vector {
        const data = this.data.map((point) => {
            if (point.value) {
                return Vector.newPointValue(
                    point, scalarRound(point.value, decimals));
            }
            return Vector.newPointValue(point, null);
        });
        return new Vector(data);
    }

    roundBankers(decimals?: number): Vector {
        const data = this.data.map((point) => {
            if (point.value) {
                return Vector.newPointValue(
                    point, scalarRoundBankers(point.value, decimals));
            }
            return Vector.newPointValue(point, null);
        });
        return new Vector(data);
    }

    json(): string {
        return JSON.stringify(this.data.map((point) => {
            return {
                'refper': datestring(point.refper),
                'value': point.value,
                'metadata': point.metadata
            };
        }));
    }

    private static maxMonth(vector: Vector) { 
        return Math.max(...vector.map((point) => point.refper.getMonth()));
    }

    private static convertToYearlyFrequency(
        vector: Vector, mode: string, years: number): Vector {

        const month = Vector.maxMonth(vector);
        vector = new Vector(dropWhile(vector.data, (point) => {
            return point.refper.getMonth() != month;
        }));
        return vector.convertToFrequency(mode, function(curr, last) {
            return curr.getFullYear() == last.getFullYear() + years;
        });
    }

    private static frequencySplit(
        vector: Vector, fn: (cur: Date, last: Date) => boolean): Vector[] {

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

    private static frequencyJoin(split: Vector[], mode?: string): Vector {
        const modes: {[mode: string]: (vector: Vector) => Point} = {
            'last': (vector: Vector) => vector.get(vector.length - 1),
            'sum': (vector: Vector) => {
                return Vector.newPointValue(
                    vector.get(vector.length - 1), vector.sum());
            },
            'average': (vector: Vector) => {
                return Vector.newPointValue(
                    vector.get(vector.length - 1), vector.average());
            },
            'max': (vector: Vector) => {
                return Vector.newPointValue(
                    vector.get(vector.length - 1), vector.max());
            },
            'min': (vector: Vector) => {
                return Vector.newPointValue(
                    vector.get(vector.length - 1), vector.min());
            }
        };
    
        return new Vector(split.map((chunk) => modes[mode || 'last'](chunk)));
    }

    private static pointOperate(
        p1: Point, p2: Point, op: nullableOperation): Point {

        if (p1.value === null || p2.value === null) {
            return  Vector.newPointValue(p1, null);
        }
        return Vector.newPointValue(p1, op(p1.value, p2.value));
    }

    private static isPointStr(point: Point | PointStr) {
        return typeof point.refper === 'string';
    }

    private static formatPoint(point: Point | PointStr): Point {
        return {
            'refper': dateObject(point.refper), 
            'value': point.value,
            'metadata': point.metadata
        };
    }

    public static newPointValue(point: Point, newValue: number | null): Point {
        return {
            'refper': point.refper, 
            'value': newValue,
            'metadata': point.metadata
        };
    }
}


function percentageChange(curr: number, last: number): number | null {
    return last == 0 ? null : ((curr - last) / Math.abs(last)) * 100;
}

function datestring(date: Date): string {
    return date.getFullYear() + '-'
        + (date.getMonth() + 1).toString().padStart(2, '0') + '-'
        + date.getDate().toString().padStart(2, '0');
}

function dateObject(date: string | Date): Date {
    return date instanceof Date ? 
        date : new Date(`${date.split('T')[0]}T00:00:00`);
}

function daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function dropWhile(
    array: any[], predicate: (item: any, i?: number) => boolean): any[] {

    let removeCount = 0;
    let i = array.length - 1;
    while (i > 0 && predicate(array[i], i)) {
        removeCount++;
        i--;
    }
    return array.slice(0, array.length - removeCount);
}

function takeWhile(
    array: any[], predicate: (item: any, i?: number) => boolean): any[] {

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

function scalarRound(value: number, decimals: number=0): number {
    return Number(Math.round(Number(`${value}e${decimals}`)) + `e-${decimals}`);
}

function scalarRoundBankers(value: number, decimals: number=0): number {
    const x = value * Math.pow(10, decimals);
    const r = Math.round(x);
    const br = Math.abs(x) % 1 === 0.5 ? (r % 2 === 0 ? r : r - 1) : r;
    return br / Math.pow(10, decimals);
}

export default Vector;