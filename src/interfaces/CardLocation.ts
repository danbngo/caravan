import { DeckArea, Person } from "../enums";

export interface CardLocation {
    person: Person;
    deckArea: DeckArea;
    index: number;
}
