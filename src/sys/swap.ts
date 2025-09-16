import { Board } from "../classes/Board";
import { CardLocations } from "../classes/CardLocations";
import { Move } from "../classes/Move";
import { DeckArea } from "../enums";
import { TargetingProps } from "../interfaces/TargetingProps";

export function calcSwappableLocations(targetingProps: TargetingProps) {
    const { index, deck, card, opposingDeck } = targetingProps;
    const validLocations: CardLocations = new CardLocations([deck, opposingDeck]);
    if (index > 0) {
        validLocations.addLocations(deck, DeckArea.Hand, [index - 1]);
    }
    if (index < deck.hand.size - 1) {
        validLocations.addLocations(deck, DeckArea.Hand, [index + 1]);
    }
    if (card.abilityIDs.includes("MANEUVER")) {
        for (let i = 0; i < deck.hand.size; i++) {
            const cardAtIndex = deck.hand.cards[i];
            if (cardAtIndex == card) continue;
            if (cardAtIndex && !cardAtIndex.abilityIDs.includes("MANEUVER")) continue;
            validLocations.addLocations(deck, DeckArea.Hand, [i]);
        }
    }
    return validLocations;
}

export function swapCard(board: Board, move: Move) {
    const { selectedCardLocation, targetCardLocation } = move;
    if (!selectedCardLocation || !targetCardLocation) throw new Error("selected and target card locations must be specified!");

    const selectedCard = selectedCardLocation.card;
    const targetCard = targetCardLocation.card;
    if (!selectedCard || !selectedCardLocation || !targetCardLocation)
        throw new Error("selected card, card location, target card location must be specified!");
    const { person } = selectedCardLocation;
    const { deck } = board.calcPersonMetadata(person);

    deck.swapCard(selectedCardLocation.index, targetCardLocation.index);
    selectedCard.tap();
    targetCard?.tap();

    if (board.isPlayerTurn) {
        if (targetCard) {
            board.addMessage(`You swap places: ${selectedCard.name} with ${targetCard.name}.`);
        } else {
            board.addMessage(`You move: ${selectedCard.name}.`);
        }
    } else {
        if (targetCard) {
            board.addMessage(`Enemy swaps places: ${selectedCard.name} with ${targetCard.name}.`);
        } else {
            board.addMessage(`Enemy moves: ${selectedCard.name}.`);
        }
    }
}
