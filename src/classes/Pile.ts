import { UnitCard } from "./UnitCard";

export class Pile {
    cards: UnitCard[]

    constructor({ cards }: { cards?: UnitCard[] | undefined } = {}) {
        this.cards = cards || []
    }
}