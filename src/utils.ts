export default class Utils {
    public static dropWhile(
        array: any[], predicate: (item: any, i?: number) => boolean): any[] {
    
        let removeCount = 0;
        let i = array.length - 1;
        while (i > 0 && predicate(array[i], i)) {
            removeCount++;
            i--;
        }
        return array.slice(0, array.length - removeCount);
    }
    
    public static takeWhile(
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

    public static daysInMonth(year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    public static dateObject(date: string | Date): Date {
        return date instanceof Date ? 
            date : new Date(`${date.split('T')[0]}T00:00:00`);
    }
}