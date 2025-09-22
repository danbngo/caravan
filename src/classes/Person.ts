import { Deck } from "./Deck";

export class Person {
    name: string;
    gold: number;
    mp: number;
    maxMp: number;
    deck: Deck;

    constructor({ name = "Person", gold = 0, maxMp = 10 }: { name?: string; gold?: number; maxMp?: number } = {}) {
        this.name = name;
        this.gold = gold;
        this.mp = maxMp;
        this.maxMp = maxMp;
        this.deck = new Deck({ owner: this });
    }

    healMp(forHp: number) {
        const oldHp = this.mp;
        this.mp = Math.min(this.maxMp, this.mp + forHp);
        return this.mp - oldHp;
    }

    damageMp(forHp: number) {
        this.mp = Math.max(0, this.mp - forHp);
    }

    reset() {
        this.mp = this.maxMp;
    }
}
