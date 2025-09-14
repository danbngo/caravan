export function hasDuplicates<T>(arr: T[]): boolean {
    const seen = new Set<T>();
    for (const item of arr) {
        if (!item) continue;
        if (seen.has(item)) {
            return true; // found a repeat
        }
        seen.add(item);
    }
    return false; // no repeats
}

export function safeRemoveFromArray<T>(arr: T[] | Set<T>, ...objs: T[]) {
    if (arr instanceof Array) {
        for (const obj of objs) {
            const index = arr.indexOf(obj);
            if (index !== -1) {
                arr.splice(index, 1);
            }
        }
    } else if (arr instanceof Set) {
        for (const obj of objs) {
            arr.delete(obj);
        }
    }
    return arr;
}

export function safeAddToArray<T>(arr: T[] | Set<T>, ...objs: T[]) {
    if (arr instanceof Array) {
        for (const obj of objs) {
            if (!arr.includes(obj)) {
                arr.push(obj);
            }
        }
    } else {
        for (const obj of objs) {
            arr.add(obj);
        }
    }
    return arr;
}
