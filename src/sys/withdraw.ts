import { Board } from "../classes/Board";
import { Move } from "../classes/Move";
import { Person } from "../enums";
import { TargetingProps } from "../interfaces/TargetingProps";

export function canWithdraw(targetingProps: TargetingProps) {
    const { card, opposingDeck, index } = targetingProps;
    const targetCard = opposingDeck.hand.cards[index];
    const [ctIDs] = [card.traitIDs];
    if ((!ctIDs.includes("IMMOBILE") && !ctIDs.includes("OATH")) || (targetCard && targetCard.abilityIDs.includes("CAPTIVATE")))
        return false;
    return true;
}

export function withdrawCard(board: Board, move: Move) {
    const { selectedCardLocation } = move;
    if (!selectedCardLocation) throw new Error("selected card location must be specified");
    const { person, index, card } = selectedCardLocation;
    if (!card) throw new Error("selected card must exist at location!");
    const { deck } = board.calcPersonMetadata(person);
    deck.withdrawCard(index);
    if (deck.owner == Person.Player) {
        board.addMessage(`You withdraw: ${card.name}.`);
    } else if (deck.owner == Person.Enemy) {
        board.addMessage(`Enemy withdraws: ${card.name}.`);
    } else throw new Error("unrecognized deck owner!");
}
