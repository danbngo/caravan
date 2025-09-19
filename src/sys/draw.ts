import { Board } from "../classes/Board";
import { CardLocations } from "../classes/CardLocations";
import { Move } from "../classes/Move";
import { Person } from "../classes/Person";
import { UnitCard } from "../classes/UnitCard";
import { PEOPLE } from "../defs/PEOPLE";
import { DeckArea } from "../enums";

export function canDraw(board: Board, card: UnitCard): boolean {
    if (!card.location || card.location.deckArea !== DeckArea.Reserves) {
        throw new Error("shouldnt be checking canDraw on non-reserves card"); //return false;
    }
    const { owner } = board.calcCardMetadata(card);
    if (owner.mp <= 0) return false;
    return true;
}

export function calcPlaceableLocations(board: Board, person: Person) {
    const { deck } = board.calcPersonMetadata(person);
    const validLocations: CardLocations = new CardLocations([deck]);
    for (let i = 0; i < deck.hand.size; i++) {
        const cardAtIndex = deck.hand.cards[i];
        if (cardAtIndex) continue;
        validLocations.addLocations(deck, DeckArea.Hand, [i]);
    }
    return validLocations;
}

export function drawCard(board: Board, move: Move) {
    console.log("drawCard called:", board, move);
    const { card, targetLocation } = move;
    if (!targetLocation) throw new Error("selected card location must be specified");
    const { owner, deck } = board.calcCardMetadata(card);
    const drawnCard = deck.drawCard(targetLocation.index);
    if (card !== drawnCard) throw new Error("sanity check failed: card on top of reserves should have been drawn!");
    owner.damageMp(1);
    drawnCard.tap();
    if (owner == PEOPLE.PLAYER) {
        //board.playerCardDrawn = true;
        board.addMessage(`You draw: ${drawnCard.name}.`);
    } else if (owner == PEOPLE.ENEMY) {
        //board.enemyCardDrawn = true;
        board.addMessage(`Enemy draws: ${drawnCard.name}.`);
    } else throw new Error("unrecognized deck owner!");
}
