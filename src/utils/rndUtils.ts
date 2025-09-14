export function rollDie(faces: number): number {
    if (faces < 1) throw new Error("Die must have at least 1 face");
    return Math.floor(Math.random() * faces) + 1;
}

export function randomMemberOfArray<T>(arr: T[]): T {
    if (arr.length === 0) throw new Error("Cannot pick from an empty array");
    const index = rollDie(arr.length) - 1; // rollDie is 1-based
    return arr[index]!;
}

export function randomizeArrayOrder<T>(arr: T[]) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i] as any, arr[j] as any] = [arr[j], arr[i]];
    }
}
