import { DeckArea } from "../enums";
import { Deck } from "./Deck";

export class CardLocation {
    deck: Deck;
    deckArea: DeckArea;
    index: number;

    constructor(deck: Deck, deckArea: DeckArea, index: number = 0) {
        this.deck = deck;
        this.deckArea = deckArea;
        this.index = index;
    }

    get card() {
        return this.deck.getCardAtLocation(this);
    }

    get person() {
        return this.deck.owner;
    }
}
