import { CardAction, DeckArea, Person, TurnAction } from "../enums";
import { Action } from "../interfaces/Action";
import { CardLocation } from "../interfaces/CardLocation";
import { CardLocations } from "./CardLocations";
import { Deck } from "./Deck";

export class Board {
    playerDeck: Deck;
    enemyDeck: Deck;
    playerCardDrawn: boolean;
    enemyCardDrawn: boolean;
    turn: Person;
    round: number;
    messages: string[];

    constructor({
        playerDeck,
        enemyDeck
    }: { playerDeck?: Deck; enemyDeck?: Deck } = {}) {
        this.playerDeck = playerDeck || new Deck();
        this.enemyDeck = enemyDeck || new Deck();
        this.turn = Person.Player;
        this.round = 1;
        this.playerCardDrawn = false;
        this.enemyCardDrawn = false;
        this.messages = ["Game started."];
    }

    addMessage(msg: string) {
        this.messages.push(msg);
    }

    nextTurn() {
        if (this.turn == Person.Player) {
            this.turn = Person.Enemy;
            for (const card of this.enemyDeck.unitCards) card.untap();
            this.addMessage(`Player turn: ended.`);
            this.addMessage(`Enemy turn: started.`);
        } else {
            this.turn = Person.Player;
            for (const card of this.playerDeck.unitCards) card.untap();
            this.round++;
            this.addMessage(`Enemy turn: ended.`);
            this.addMessage(`Played turn: started.`);
            this.addMessage(`Round ${this.round}...`);
        }
        this.playerCardDrawn = false;
        this.enemyCardDrawn = false;
    }

    get isPlayerTurn() {
        const isPlayerTurn = this.turn == Person.Player;
        return isPlayerTurn;
    }

    processAction(action: Action) {
        const { turnAction, cardAction } = action;
        if (turnAction == TurnAction.EndTurn) {
            this.nextTurn();
        } else if (cardAction == CardAction.Draw) {
            this.processCardActionDraw(action);
        } else if (cardAction == CardAction.Move) {
            this.processCardActionMove(action);
        } else throw new Error("unrecognized action type");
    }

    processCardActionDraw(action: Action) {
        const { selectedCardLocation } = action;
        const { person, index } = selectedCardLocation;
        const { deck } = this.calcPersonMetadata(person);
        const drawnCard = deck.drawUnit(index);
        if (this.isPlayerTurn) {
            this.playerCardDrawn = true;
            this.addMessage(`You draw: ${drawnCard.name}.`);
        } else {
            this.enemyCardDrawn = true;
            this.addMessage(`Enemy draws: ${drawnCard.name}.`);
        }
    }

    processCardActionMove(action: Action) {
        const {
            selectedCardLocation,
            targetCardLocation,
            selectedCard,
            targetCard
        } = action;
        const { person, index } = selectedCardLocation;
        if (!selectedCard) throw new Error("selected card must be specified!");
        const {deck} = this.calcPersonMetadata(person)

        deck.moveUnit(selectedCardLocation.)


        if (this.isPlayerTurn) {
            this.playerCardDrawn = true;
            if (targetCard) {
                this.addMessage(
                    `You swap places: ${selectedCard.name} with ${targetCard.name}.`
                );
            } else {
                this.addMessage(`You move: ${selectedCard.name}.`);
            }
        } else {
            this.enemyCardDrawn = true;
            if (targetCard) {
                this.addMessage(
                    `Enemy swaps places: ${selectedCard.name} with ${targetCard.name}.`
                );
            } else {
                this.addMessage(`Enemy moves: ${selectedCard.name}.`);
            }
        }
    }

    calcPersonMetadata(person: Person) {
        const opponent = Person.Enemy ? Person.Player : Person.Enemy;
        const deck = person == Person.Enemy ? this.enemyDeck : this.playerDeck;
        const opposingDeck =
            person == Person.Player ? this.enemyDeck : this.playerDeck;
        return { person, opponent, deck, opposingDeck };
    }

    calcTargetableLocations(
        selectedCardLocation: CardLocation,
        action: CardAction
    ) {
        const { person, index } = selectedCardLocation;
        const { deck, opponent, opposingDeck } =
            this.calcPersonMetadata(person);
        const validLocations: CardLocations = new CardLocations();
        if (action == CardAction.Move) {
            if (index < 0) {
                validLocations.addLocations(person, DeckArea.Hand, [index - 1]);
            }
            if (index < deck.hand.size - 1) {
                validLocations.addLocations(person, DeckArea.Hand, [index + 1]);
            }
        }
        if (action == CardAction.Attack) {
            if (opposingDeck.hand.cards[index]) {
                validLocations.addLocations(opponent, DeckArea.Hand, [index]);
            } else {
                validLocations.addLocations(opponent, DeckArea.General, [0]);
            }
        }
        return validLocations;
    }
}
