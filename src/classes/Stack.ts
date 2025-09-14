import { randomizeArrayOrder } from "../utils/rndUtils";
import { UnitCard } from "./UnitCard";

export class Stack {
    cards: UnitCard[];

    constructor({ cards }: { cards?: UnitCard[] } = {}) {
        this.cards = cards || [];
    }

    shuffle() {
        randomizeArrayOrder(this.cards);
    }

    drawCard() {
        if (this.cards.length == 0) throw new Error("no cards left to draw!");
        return this.cards.shift();
    }

    addCard(card: UnitCard, placeAt: "bottom" | "top") {
        if (placeAt == "bottom") this.cards.push(card);
        else this.cards.unshift(card);
    }
}
