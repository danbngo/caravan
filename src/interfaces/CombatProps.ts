import { Board } from "../classes/Board";
import { CardLocation } from "../classes/CardLocation";
import { Deck } from "../classes/Deck";
import { UnitCard } from "../classes/UnitCard";
import { Person } from "../enums";

export interface CombatProps {
    board: Board;
    person: Person;
    opponent: Person;
    deck: Deck;
    opposingDeck: Deck;
    card: UnitCard;
    targetCard: UnitCard;
    selectedCardLocation: CardLocation;
    targetCardLocation: CardLocation;
}
