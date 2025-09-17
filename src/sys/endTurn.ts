import { Board } from "../classes/Board";
import { CardLocation } from "../classes/CardLocation";
import { UnitCard } from "../classes/UnitCard";

export function endTurnForCard(board: Board, cardLocation: CardLocation) {
    const { card, deck } = cardLocation;
    if (!card) return;
    const adjacentLocations: CardLocation[] = deck.getAdjacentCardLocations(cardLocation);
    const adjacentCards: UnitCard[] = adjacentLocations.map((al) => al.card).filter((card) => card !== undefined);
    const [caIDs] = [card.abilityIDs];
    if (caIDs.includes("MEDIC")) {
        for (const adjacentCard of adjacentCards) {
            if (!adjacentCard.traitIDs.includes("LIVING")) continue;
            const healAmount = card.heal(1);
            if (healAmount) board.addMessage(`${card.name} heals ${adjacentCard.name} for ${healAmount} HP.`);
        }
    }
    if (caIDs.includes("MECHANIC")) {
        for (const adjacentCard of adjacentCards) {
            if (!adjacentCard.traitIDs.includes("CONTRAPTION")) continue;
            const healAmount = card.heal(1);
            if (healAmount) board.addMessage(`${card.name} repairs ${adjacentCard.name} for ${healAmount} HP.`);
        }
    }
}
