import { Board } from "../classes/Board";
import { CardLocations } from "../classes/CardLocations";
import { Move } from "../classes/Move";
import { UnitCard } from "../classes/UnitCard";
import { PEOPLE } from "../defs/PEOPLE";
import { CardAction, DeckArea } from "../enums";

export function canSwap(board: Board, card: UnitCard) {
    const { index, foeDeck } = board.calcCardMetadata(card);
    if (card.tapped || card.restrictedActions.includes(CardAction.Swap)) return false;
    const enemyCard = foeDeck.hand.cards[index];
    const [ctIDs] = [card.traitIDs];
    if (ctIDs.includes("BUILDING") || (enemyCard && enemyCard.abilityIDs.includes("CAPTIVATE"))) return false;
    if (card.tapped || card.dead) return false;
    return true;
}

export function calcSwappableLocations(board: Board, card: UnitCard) {
    const { deck, foeDeck, index } = board.calcCardMetadata(card);

    const validLocations: CardLocations = new CardLocations([deck, foeDeck]);
    const [caIDs] = [card.abilityIDs];
    console.log("checking for card swappable locations");

    if (!canSwap(board, card)) return validLocations;
    console.log("card can swap");

    for (let i = 0; i < deck.hand.size; i++) {
        const diff = Math.abs(i - index);
        if (diff == 0) continue;
        const cardAtIndex = deck.hand.cards[i];
        if (diff !== 1) {
            if (!caIDs.includes("MANEUVER")) continue;
            if (cardAtIndex && !cardAtIndex.abilityIDs.includes("MANEUVER")) continue;
        }
        if (cardAtIndex) {
            if (!canSwap(board, cardAtIndex)) continue;
        }
        validLocations.addLocations(deck, DeckArea.Hand, [i]);
    }
    return validLocations;
}

export function swapCard(board: Board, move: Move) {
    const { card, targetLocation } = move;
    if (!targetLocation) throw new Error("selected and target card locations must be specified!");

    const targetCard = targetLocation.card;
    const { deck, index } = board.calcCardMetadata(card);

    deck.swapCard(index, targetLocation.index);
    if (card.abilityIDs.includes("CHARGE")) card.restrictedActions.push(CardAction.Swap, CardAction.Withdraw);
    else card.tap();
    targetCard?.tap();

    if (board.turn == PEOPLE.PLAYER) {
        if (targetCard) {
            board.addMessage(`You swap places: ${card.name} with ${targetCard.name}.`);
        } else {
            board.addMessage(`You move: ${card.name}.`);
        }
    } else {
        if (targetCard) {
            board.addMessage(`Enemy swaps places: ${card.name} with ${targetCard.name}.`);
        } else {
            board.addMessage(`Enemy moves: ${card.name}.`);
        }
    }
}
