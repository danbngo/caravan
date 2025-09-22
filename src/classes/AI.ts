import { CardAction, TurnAction } from "../enums";
import { DrawSystem } from "../systems/DrawSystem";
import { randomMemberOfArray } from "../utils/rndUtils";
import { Board } from "./Board";
import { Move } from "./Move";
import { Person } from "./Person";

export class AI {
    person: Person;
    board: Board;

    constructor({ person, board }: { person: Person; board: Board }) {
        this.person = person;
        this.board = board;
    }

    chooseMove(): TurnAction | Move {
        const { deck } = this.person;

        console.log("choosing move:", deck);

        if (deck.hand.numCards < deck.hand.size / 2 && DrawSystem.canRedraw(this.person)) return TurnAction.Redraw;

        const handMoves = this.board.calcValidHandMoves(this.person);
        const lineMoves = this.board.calcValidLineMoves(this.person);
        let moves = [...handMoves, ...lineMoves];

        console.log("valid moves:", moves);

        //dont allow swapping or withdrawing
        moves = moves.filter(
            (m) => m.action !== CardAction.Swap && m.action !== CardAction.Wait && m.action !== CardAction.Withdraw
        );

        if (moves.length == 0) {
            return TurnAction.EndTurn;
        }
        const move = randomMemberOfArray(moves);
        console.log("executing move:", move, "out of potential moves:", moves);
        return move;
    }
}
