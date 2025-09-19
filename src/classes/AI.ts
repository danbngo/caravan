import { TurnAction } from "../enums";
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
        const reserveMoves = this.board.calcValidReserveMoves(this.person);
        const handMoves = this.board.calcValidHandMoves(this.person);
        const moves = [...reserveMoves, ...handMoves];
        if (moves.length == 0) {
            return TurnAction.EndTurn;
        }
        const move = randomMemberOfArray(moves);
        console.log("executing move:", move, "out of potential moves:", moves);
        return move;
    }
}
