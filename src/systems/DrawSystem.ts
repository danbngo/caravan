import { Person } from "../classes/Person";

export class DrawSystem {
    static canRedraw(person: Person) {
        const { mp, deck } = person;
        return mp >= 3 && deck.reserves.length > 0;
    }

    static redraw(person: Person) {
        console.log("redrawing for:", person);
        person.mp -= 3;
        for (const card of person.deck.hand.cards) {
            if (card) person.deck.dumpCard(card);
        }
        person.deck.reserves.shuffle();
        person.deck.refillHand();
    }
}
