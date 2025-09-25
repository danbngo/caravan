import { Board } from "./Board";
import { Person } from "./Person";

export class Game {
    player: Person;
    board: Board;
    messages: string[];

    constructor() {
        this.player = new Person({ name: "Player" });
        this.messages = ["Game started."];
        this.board = new Board({ enemy: new Person({ name: "" }), player: this.player });
    }

    addMessage = (msg: string) => {
        console.log("this:", this);
        this.messages.push(msg);
    };

    get enemy() {
        return this.board.enemy;
    }
}

export const gs = new Game();
