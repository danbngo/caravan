import { DeckArea } from "../enums";
import { safeAddToArray } from "../utils/arrUtils";
import { CardLocation } from "./CardLocation";
import { Deck } from "./Deck";

export class CardLocations {
    locations: CardLocation[];
    decks: Deck[];

    constructor(decks: Deck[]) {
        this.decks = decks;
        this.locations = [];
    }

    addLocations(deck: Deck, deckArea: DeckArea, indices: number[]) {
        for (const i of indices) safeAddToArray(this.locations, new CardLocation(deck, deckArea, i));
    }

    removeLocations(deck: Deck, deckArea: DeckArea, indices: number[]) {
        this.locations = this.locations.filter((l) => l.deck !== deck || l.deckArea !== deckArea || !indices.includes(l.index));
    }

    setLocations(deck: Deck, deckArea: DeckArea, indices: number[]) {
        this.locations = [];
        this.addLocations(deck, deckArea, indices);
    }

    getLocationIndices(deck: Deck, deckArea: DeckArea): number[] {
        return this.locations.filter((l) => l.deck == deck && l.deckArea == deckArea).map((l) => l.index);
    }

    hasIndex(deck: Deck, deckArea: DeckArea, index: number = 0): boolean {
        const indices = this.getLocationIndices(deck, deckArea);
        return indices.includes(index);
    }
}
