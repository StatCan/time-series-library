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

    constructor(data: Point[]) {
        this._data = data;
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
        return this.map((point) => point.value);
    }

    push(point: Point) {
        this.data.push(point);
    }

    equals(other: Vector, index: number=undefined): boolean {
        const pointEquals = (a: Point, b: Point): boolean => {
            return a.refper.getTime() == b.refper.getTime()
                && a.value == b.value;
        };
        if (index) return pointEquals(this.get(index), other.get(index));
        if (this.length !== other.length) return false;
        return !this.some((point, i) => !pointEquals(point, other.get(i)));
    }

    copy(): Vector {
        return new Vector(
            this.map((point) => Vector.newPointValue(point, point.value)));
    }

    map(fn, ...rest): any[] {
        return this.data.map(fn, ...rest);
    }

    find(fn, ...rest): any {
        return this.data.find(fn, ...rest);
    }

    some(fn, ...rest): boolean {
        return this.data.some(fn, ...rest);
    }

    private static newPointValue(point, newValue): Point {
        return {'refper': point.refper, 'value': newValue};
    }
}


function datestring(date: Date): string {
    return date.getFullYear() + '-'
        + (date.getMonth() + 1).toString().padStart(2, '0') + '-'
        + date.getDate().toString().padStart(2, '0');
}

module.exports = Vector;