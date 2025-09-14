import { UnitCard } from "./UnitCard";

export class Hand {
    static MAX_HAND_SIZE: number = 6;
    static MIN_HAND_SIZE: number = 3;
    static DEFAULT_HAND_SIZE: number = 5;

    cards: (UnitCard | undefined)[];
    size: number;

    constructor(
        { cards, size }: { cards: (UnitCard | undefined)[]; size?: number } = {
            cards: [],
            size: Hand.DEFAULT_HAND_SIZE
        }
    ) {
        this.cards = cards || [];
        this.size = size || Hand.DEFAULT_HAND_SIZE;
        this.validate();
        this.rationalize();
    }

    validate() {
        if (this.size < Hand.MIN_HAND_SIZE || this.size > Hand.MAX_HAND_SIZE)
            throw new Error("hand size out of range");
        if (this.cards.length > this.size)
            throw new Error("num of initial cards exceeded size limit");
    }

    rationalize() {
        while (this.cards.length < this.size) this.cards.push(undefined);
    }
}
