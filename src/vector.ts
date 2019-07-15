import { start } from "repl";
import { getEnabledCategories } from "trace_events";
import { format } from "url";

interface Point {
    refper: Date;
    value: number;
    metadata?: any;
}

interface PointStr {
    refper: string;
    value: number;
    metadata?: any;
}

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

    value(index: number): number {
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

    interoperable(other: Vector) {
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

    private static newPointValue(point: Point, newValue: number): Point {
        return {
            'refper': point.refper, 
            'value': newValue,
            'metadata': point.metadata
        };
    }
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

export default Vector;