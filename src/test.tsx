import { gs } from "./classes/GameState";
import { Deck } from "./classes/Deck";
import { ALL_UNIT_CARDS, GENERAL_CARDS } from "./defs/CARDS";
import { randomMemberOfArray } from "./utils/rndUtils";
import { UnitCard } from "./classes/UnitCard";

function makeRandomDeck() {
    const generalCard = GENERAL_CARDS.GENERAL
    const unitCards: Set<UnitCard> = new Set()
    for (let i = 0; i < 10; i++) {
        const card = randomMemberOfArray(ALL_UNIT_CARDS)
        unitCards.add(card)
    }
    return new Deck({ unitCards, generalCard })
}

export function startTestGame() {
    gs.playerDeck = makeRandomDeck()
    gs.enemyDeck = makeRandomDeck()
}