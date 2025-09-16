import { Person, TurnAction } from "../enums";
import { randomMemberOfArray } from "../utils/rndUtils";
import { Board } from "./Board";
import { Move } from "./Move";

export class AI {
    person: Person;
    board: Board;

    constructor({ person, board }: { person: Person; board: Board }) {
        this.person = person;
        this.board = board;
    }

    chooseMove() {
        const unitMoves = this.board.calcValidUnitMoves(this.person);
        if (unitMoves.length == 0) {
            return new Move(TurnAction.EndTurn);
        }
        const move = randomMemberOfArray(unitMoves);
        console.log("executing move:", move, "out of potential moves:", unitMoves);
        return move;
    }
}
