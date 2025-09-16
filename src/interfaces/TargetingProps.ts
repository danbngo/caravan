import { Deck } from "../classes/Deck";
import { UnitCard } from "../classes/UnitCard";
import { Person } from "../enums";

export interface TargetingProps {
    person: Person;
    index: number;
    card: UnitCard;
    deck: Deck;
    opposingDeck: Deck;
}
