import { Deck } from "./classes/Deck";
import { ALL_UNIT_CARDS, GENERAL_CARDS } from "./defs/CARDS";
import { randomMemberOfArray } from "./utils/rndUtils";
import { UnitCard } from "./classes/UnitCard";
import { gs } from "./classes/Game";
import { Board } from "./classes/Board";
import { AI } from "./classes/AI";
import { PEOPLE } from "./defs/PEOPLE";
import { Person } from "./classes/Person";

function makeRandomDeck(owner: Person) {
    const general = GENERAL_CARDS.GENERAL;
    const units: Set<UnitCard> = new Set();
    for (let i = 0; i < 10; i++) {
        const card = randomMemberOfArray(ALL_UNIT_CARDS);
        units.add(card);
    }
    return new Deck({ owner, units, general });
}

export function startTestGame() {
    gs.playerDeck = makeRandomDeck(PEOPLE.PLAYER);

    gs.board = new Board({
        playerDeck: gs.playerDeck,
        enemyDeck: makeRandomDeck(PEOPLE.ENEMY)
    });

    gs.enemyAI = new AI({ board: gs.board, person: PEOPLE.ENEMY });
}
