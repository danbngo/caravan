import { PEOPLE } from "../defs/PEOPLE";
import { AI } from "./AI";
import { Board } from "./Board";
import { Deck } from "./Deck";
import { Move } from "./Move";

export class Game {
    playerDeck: Deck;
    board: Board;
    enemyAI: AI;

    constructor() {
        this.playerDeck = new Deck();
        this.board = new Board({ playerDeck: this.playerDeck });
        this.enemyAI = new AI({ board: this.board, person: PEOPLE.ENEMY });
    }

    async handleEnemyTurn(betweenEnemyActions: () => Promise<void>) {
        if (!this.enemyAI) throw new Error("Enemy AI not loaded");
        let attemptsRemaining = 100;
        while (this.board.turn == PEOPLE.ENEMY && attemptsRemaining-- > 0) {
            await betweenEnemyActions();
            if (attemptsRemaining <= 0) throw new Error("too many actions for enemy turn!");
            this.handleEnemyAction();
        }
        betweenEnemyActions();
    }

    handleEnemyAction() {
        const choice = this.enemyAI.chooseMove();
        if (choice instanceof Move) this.board.processMove(choice);
        else this.board.processTurnAction(choice);
    }
}

export const gs = new Game();
