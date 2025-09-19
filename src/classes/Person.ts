export class Person {
    name: string;
    gold: number;
    mp: number;
    maxMp: number;
    constructor({ name = "Person", gold = 0, maxMp = 10 }: { name?: string; gold?: number; maxMp?: number } = {}) {
        this.name = name;
        this.gold = gold;
        this.mp = maxMp;
        this.maxMp = maxMp;
    }

    healMp(forHp: number) {
        const oldHp = this.mp;
        this.mp = Math.min(this.maxMp, this.mp + forHp);
        return this.mp - oldHp;
    }

    damageMp(forHp: number) {
        this.mp = Math.max(0, this.mp - forHp);
    }
}
