import { gs } from "../classes/Game";
import { Move } from "../classes/Move";
import { UnitCard } from "../classes/UnitCard";
import { CardAction } from "../enums";

export class WithdrawSystem {
    static canWithdraw(card: UnitCard) {
        const { foeCard } = gs.board.calcCardMetadata(card);
        const [ctIDs] = [card.traitIDs];
        if (card.tapped || card.restrictedActions.includes(CardAction.Withdraw)) return false;
        if (ctIDs.includes("BUILDING") || ctIDs.includes("OATH")) return false;
        if (foeCard && foeCard.abilityIDs.includes("CAPTIVATE")) return false;
        return true;
    }

    static withdrawCard(move: Move) {
        const { card } = move;
        const { person } = gs.board.calcCardMetadata(card);
        if (!card) throw new Error("selected card must exist at location!");
        const { deck } = gs.board.calcPersonMetadata(person);
        deck.withdrawCard(card);
        if (deck.owner == gs.player) {
            gs.addMessage(`You withdraw: ${card.name}.`);
        } else if (deck.owner == gs.enemy) {
            gs.addMessage(`Enemy withdraws: ${card.name}.`);
        } else throw new Error("unrecognized deck owner!");
    }
}
