import { Person } from "../enums";
import { AI } from "./AI";
import { Board } from "./Board";
import { Deck } from "./Deck";

export class Game {
    playerDeck: Deck;
    board: Board;
    enemyAI: AI;

    constructor() {
        this.playerDeck = new Deck();
        this.board = new Board({ playerDeck: this.playerDeck });
        this.enemyAI = new AI({ board: this.board, person: Person.Enemy });
    }

    async handleEnemyTurn(betweenEnemyActions: () => Promise<void>) {
        if (!this.enemyAI) throw new Error("Enemy AI not loaded");
        let attemptsRemaining = 100;
        while (this.board.turn == Person.Enemy && attemptsRemaining-- > 0) {
            await betweenEnemyActions();
            if (attemptsRemaining <= 0) throw new Error("too many actions for enemy turn!");
            this.handleEnemyAction();
        }
        betweenEnemyActions();
    }

    handleEnemyAction() {
        const move = this.enemyAI.chooseMove();
        this.board.processMove(move);
    }
}

export const gs = new Game();
