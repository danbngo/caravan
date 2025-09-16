export function getAllNumbersBetween(first: number, last: number): number[] {
    if (first > last) return [];
    return Array.from({ length: last - first + 1 }, (_, i) => first + i);
}
