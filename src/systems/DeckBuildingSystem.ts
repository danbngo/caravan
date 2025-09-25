import { Deck } from "../classes/Deck";
import { Person } from "../classes/Person";
import { UnitCard } from "../classes/UnitCard";
import { GENERAL_CARDS } from "../defs/GENERAL_CARDS";
import { ALL_UNIT_CARDS } from "../defs/UNIT_CARDS";
import { randomMemberOfArray } from "../utils/rndUtils";

export class DeckBuildingSystem {
    static makeRandomDeck(owner: Person, numCards: number = 30, possibleCards = ALL_UNIT_CARDS) {
        const general = GENERAL_CARDS.GENERAL;
        const units: Set<UnitCard> = new Set();
        for (let i = 0; i < numCards; i++) {
            const card = randomMemberOfArray(possibleCards);
            units.add(UnitCard.copy(card));
        }
        return new Deck({ owner, units, general });
    }
}
