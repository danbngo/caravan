import { randomizeArrayOrder } from "../utils/rndUtils";
import { UnitCard } from "./UnitCard";

export class CardStack {
    cards: UnitCard[];

    constructor({ cards }: { cards?: UnitCard[] } = {}) {
        this.cards = cards || [];
    }

    get length() {
        return this.cards.length;
    }

    shuffle() {
        randomizeArrayOrder(this.cards);
    }

    drawCard() {
        if (this.length == 0) throw new Error("no cards left to draw!");
        return this.cards.shift();
    }

    addCard(card: UnitCard, placeAt: "bottom" | "top") {
        if (placeAt == "bottom") this.cards.push(card);
        else this.cards.unshift(card);
    }

    removeCard(card: UnitCard) {
        const index = this.cards.indexOf(card);
        if (index == -1) throw new Error("card wasnt present in stack!");
        this.cards.splice(index, 1);
    }
}
