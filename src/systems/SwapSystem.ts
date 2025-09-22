import { CardLocations } from "../classes/CardLocations";
import { gs } from "../classes/Game";
import { Move } from "../classes/Move";
import { UnitCard } from "../classes/UnitCard";
import { CardAction, DeckArea } from "../enums";

export class SwapSystem {
    static canSwap(card: UnitCard) {
        const { index, foeDeck } = gs.board.calcCardMetadata(card);
        if (card.tapped || card.restrictedActions.includes(CardAction.Swap)) return false;
        const enemyCard = foeDeck.line.cards[index];
        const [ctIDs] = [card.traitIDs];
        if (ctIDs.includes("BUILDING") || (enemyCard && enemyCard.abilityIDs.includes("CAPTIVATE"))) return false;
        if (card.tapped || card.dead) return false;
        return true;
    }

    static calcSwappableLocations(card: UnitCard) {
        const { deck, foeDeck, index } = gs.board.calcCardMetadata(card);

        const validLocations: CardLocations = new CardLocations([deck, foeDeck]);
        const [caIDs] = [card.abilityIDs];
        console.log("checking for card swappable locations");

        if (!this.canSwap(card)) return validLocations;
        console.log("card can swap");

        for (let i = 0; i < deck.line.size; i++) {
            const diff = Math.abs(i - index);
            if (diff == 0) continue;
            const cardAtIndex = deck.line.cards[i];
            if (diff !== 1) {
                if (!caIDs.includes("MANEUVER")) continue;
                if (cardAtIndex && !cardAtIndex.abilityIDs.includes("MANEUVER")) continue;
            }
            if (cardAtIndex) {
                if (!this.canSwap(cardAtIndex)) continue;
            }
            validLocations.addLocations(deck, DeckArea.Line, [i]);
        }
        return validLocations;
    }

    static swapCard(move: Move) {
        const { board, addMessage } = gs;
        const { card, targetLocation } = move;
        if (!targetLocation) throw new Error("selected and target card locations must be specified!");

        const targetCard = targetLocation.card;
        const { deck, index } = board.calcCardMetadata(card);

        deck.swapCard(index, targetLocation.index);
        if (card.abilityIDs.includes("CHARGE")) card.restrictedActions.push(CardAction.Swap, CardAction.Withdraw);
        else card.tap();
        targetCard?.tap();

        if (board.turn == gs.player) {
            if (targetCard) {
                addMessage(`You swap places: ${card.name} with ${targetCard.name}.`);
            } else {
                addMessage(`You move: ${card.name}.`);
            }
        } else {
            if (targetCard) {
                addMessage(`Enemy swaps places: ${card.name} with ${targetCard.name}.`);
            } else {
                addMessage(`Enemy moves: ${card.name}.`);
            }
        }
    }
}
