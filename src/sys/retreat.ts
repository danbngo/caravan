import { Board } from "../classes/Board";
import { Move } from "../classes/Move";
import { Person } from "../enums";

export function retreatCard(board: Board, move: Move) {
    const { selectedCardLocation } = move;
    if (!selectedCardLocation) throw new Error("selected card location must be specified");
    const { person, index, card } = selectedCardLocation;
    if (!card) throw new Error("selected card must exist at location!");
    const { deck } = board.calcPersonMetadata(person);
    deck.withdrawCard(index);
    if (deck.owner == Person.Player) {
        board.playerCardDrawn = true;
        board.addMessage(`You withdraw: ${card.name}.`);
    } else if (deck.owner == Person.Enemy) {
        board.enemyCardDrawn = true;
        board.addMessage(`Enemy withdraws: ${card.name}.`);
    } else throw new Error("unrecognized deck owner!");
}
