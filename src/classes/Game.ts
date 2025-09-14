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
        this.enemyAI = new AI({ board: this.board });
    }

    handleEnemyTurn(onEnemyActed: () => void) {
        if (!this.enemyAI) throw new Error("Enemy AI not loaded");
        let attemptsRemaining = 100;
        while (this.board.turn == Person.Enemy && attemptsRemaining-- > 0) {
            if (attemptsRemaining <= 0)
                throw new Error("too many actions for enemy turn!");
            this.handleEnemyAction();
            onEnemyActed();
        }
    }

    handleEnemyAction() {
        const action = this.enemyAI.chooseAction();
        const {
            cardAction,
            turnAction,
            selectedCardIndices,
            targetCardIndices
        } = action;
        if (turnAction) this.board.processTurnAction(turnAction);
        else if (cardAction)
            this.board.processCardAction(
                cardAction,
                selectedCardIndices,
                targetCardIndices
            );
        else
            throw new Error(
                "invalid action, must specify turnAction or cardAction"
            );
    }
}

export const gs = new Game();
