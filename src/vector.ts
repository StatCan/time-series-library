interface Point {
    refper: Date;
    value: number;
}

interface PointStr {
    refper: string;
    value: number;
}

class Vector {
    private _data: Point[]; 

    constructor(data: Point[] | PointStr[]) {
        if (data.length > 0) {
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

    push(point: Point) {
        this.data.push(point);
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

    private static isPointStr(point: Point | PointStr) {
        return typeof point.refper === 'string';
    }

    private static formatPoint(point: PointStr): Point {
        return {'refper': dateObject(point.refper), 'value': point.value};
    }

    private static newPointValue(point: Point, newValue: number): Point {
        return {'refper': point.refper, 'value': newValue};
    }
}


function datestring(date: Date): string {
    return date.getFullYear() + '-'
        + (date.getMonth() + 1).toString().padStart(2, '0') + '-'
        + date.getDate().toString().padStart(2, '0');
}

function dateObject(datestr: string): Date {
    return new Date(`${datestr.split('T')[0]}T00:00:00`);
}

export default Vector;