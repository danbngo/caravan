import { Board } from "../classes/Board";
import { Move } from "../classes/Move";
import { Person } from "../enums";

export function drawCard(board: Board, move: Move) {
    const { selectedCardLocation } = move;
    if (!selectedCardLocation) throw new Error("selected card location must be specified");
    const { person, index } = selectedCardLocation;
    const { deck } = board.calcPersonMetadata(person);
    const drawnCard = deck.drawCard(index);
    drawnCard.tap();
    if (deck.owner == Person.Player) {
        board.playerCardDrawn = true;
        board.addMessage(`You draw: ${drawnCard.name}.`);
    } else if (deck.owner == Person.Enemy) {
        board.enemyCardDrawn = true;
        board.addMessage(`Enemy draws: ${drawnCard.name}.`);
    } else throw new Error("unrecognized deck owner!");
}
