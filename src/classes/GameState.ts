import { CardAction, Person, TurnAction } from "../enums";
import { Deck } from "./Deck";

export class GameState {
    playerDeck: Deck;
    enemyDeck: Deck;
    playerCardDrawn: boolean;
    enemyCardDrawn: boolean;
    turn: Person;
    round: number;
    messages: string[];

    constructor({ playerDeck, enemyDeck }: { playerDeck?: Deck, enemyDeck?: Deck } = {}) {
        this.playerDeck = playerDeck || new Deck();
        this.enemyDeck = enemyDeck || new Deck();
        this.turn = Person.Player;
        this.round = 1;
        this.playerCardDrawn = false
        this.enemyCardDrawn = false
        this.messages = ['Game started.']
    }

    addMessage(msg: string) {
        this.messages.push(msg)
    }

    nextTurn() {
        if (this.turn == Person.Player) {
            this.turn = Person.Enemy
            for (const card of this.enemyDeck.unitCards) card.untap()
            this.addMessage(`Player turn ended. Starting enemy turn.`)
        }
        else {
            this.turn = Person.Player
            for (const card of this.playerDeck.unitCards) card.untap()
            this.round++
            this.addMessage(`Enemy turn ended. Starting player turn.`)
            this.addMessage(`Starting round ${this.round}...`)
        }
        this.playerCardDrawn = false
        this.enemyCardDrawn = false
    }

    get isPlayerTurn() {
        const isPlayerTurn = this.turn == Person.Player
        return isPlayerTurn
    }

    handleAction(selectedCardIndex: number, action: CardAction) {
        const deck = this.isPlayerTurn ? this.playerDeck : this.enemyDeck
        //const card = deck.hand.cards[selectedCardIndex]
        if (!deck) throw new Error('deck was not ready!')
        if (action == CardAction.Draw) {
            const drawnCard = deck.drawUnit(selectedCardIndex)
            if (this.isPlayerTurn) {
                this.playerCardDrawn = true
                this.addMessage(`You draw a ${drawnCard.name}.`)
            }
            else {
                this.enemyCardDrawn = true
                this.addMessage(`Enemy draws a ${drawnCard.name}.`)
            }
        }
    }

    handleTurnAction(action: TurnAction) {
        if (action == TurnAction.EndTurn) {
            this.nextTurn()
        }
    }

    startPlayerTurn() {
        this.turn = Person.Player
    }
    startEnemyTurn() {
        this.turn = Person.Enemy
        for (const card of this.enemyDeck.unitCards) card.untap()
    }
}

export const gs = new GameState()