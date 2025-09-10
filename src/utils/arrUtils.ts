export function hasDuplicates<T>(arr: T[]): boolean {
    const seen = new Set<T>();
    for (const item of arr) {
        if (!item) continue
        if (seen.has(item)) {
            return true; // found a repeat
        }
        seen.add(item);
    }
    return false; // no repeats
}

export function safeRemoveFromArray<T>(arr: T[] | Set<T>, obj: T) {
    if (arr instanceof Array) {
        const index = arr.indexOf(obj);
        if (index !== -1) {
            arr.splice(index, 1);
        }
    }
    else if (arr instanceof Set) {
        arr.delete(obj)
    }
    return arr;
}

export function safeAddToArray<T>(arr: T[] | Set<T>, obj: T) {
    if (arr instanceof Array) {
        if (!arr.includes(obj)) {
            arr.push(obj);
        }
    }
    else {
        arr.add(obj)
    }
    return arr;
}