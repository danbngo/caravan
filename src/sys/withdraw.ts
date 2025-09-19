import { Board } from "../classes/Board";
import { Move } from "../classes/Move";
import { UnitCard } from "../classes/UnitCard";
import { PEOPLE } from "../defs/PEOPLE";
import { CardAction } from "../enums";

export function canWithdraw(board: Board, card: UnitCard) {
    const { foeCard } = board.calcCardMetadata(card);
    const [ctIDs] = [card.traitIDs];
    if (card.tapped || card.restrictedActions.includes(CardAction.Withdraw)) return false;
    if (ctIDs.includes("BUILDING") || ctIDs.includes("OATH")) return false;
    if (foeCard && foeCard.abilityIDs.includes("CAPTIVATE")) return false;
    return true;
}

export function withdrawCard(board: Board, move: Move) {
    const { card } = move;
    const { person } = board.calcCardMetadata(card);
    if (!card) throw new Error("selected card must exist at location!");
    const { deck } = board.calcPersonMetadata(person);
    deck.withdrawCard(card);
    if (deck.owner == PEOPLE.PLAYER) {
        board.addMessage(`You withdraw: ${card.name}.`);
    } else if (deck.owner == PEOPLE.ENEMY) {
        board.addMessage(`Enemy withdraws: ${card.name}.`);
    } else throw new Error("unrecognized deck owner!");
}
