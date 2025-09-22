import { UnitCard } from "./UnitCard";

export class CardLine {
    cards: (UnitCard | undefined)[];
    size: number;

    constructor({ cards, size }: { cards: (UnitCard | undefined)[]; size: number }) {
        this.cards = cards || [];
        this.size = size;
        this.rationalize();
    }

    get numCards() {
        return this.cards.filter((card) => card !== undefined).length;
    }

    //add to next empty slot
    addCard(card: UnitCard) {
        const nextEmptySlotIndex = this.getNextEmptySlotIndex();
        if (nextEmptySlotIndex == -1) throw new Error("no slots remaining!");
        this.cards[nextEmptySlotIndex] = card;
        return nextEmptySlotIndex;
    }

    getNextEmptySlotIndex() {
        for (let i = 0; i < this.size; i++) {
            if (this.cards[i] == undefined) return i;
        }
        return -1;
    }

    rationalize() {
        while (this.cards.length < this.size) this.cards.push(undefined);
    }

    removeCard(card: UnitCard) {
        const index = this.cards.indexOf(card);
        if (index == -1) throw new Error("card wasnt present in hand!");
        this.cards[index] = undefined;
    }
}
