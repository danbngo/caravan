import { CardAction, DeckArea, Person, TurnAction } from "../enums";
import { Action } from "./Action";
import { CardIndices } from "./CardIndices";
import { Deck } from "./Deck";
import { UnitCard } from "./UnitCard";

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
        const {
            turnAction,
            cardAction,
            selectedCardIndices,
            targetCardIndices
        } = action;
        if (turnAction) {
            this.processTurnAction(turnAction);
        } else if (cardAction) {
            this.processCardAction(
                cardAction,
                selectedCardIndices,
                targetCardIndices
            );
        } else throw new Error("unrecognized action type");
    }

    processCardAction(
        action: CardAction,
        selectedCardIndices?: CardIndices | undefined,
        targetCardIndices?: CardIndices | undefined
    ) {
        if (action == CardAction.Draw) {
            if (!selectedCardIndices)
                throw new Error(
                    "selectedCardIndices must be defined for this action!"
                );
            this.processCardActionDraw(selectedCardIndices);
        } else if (action == CardAction.Move) {
        }
    }

    processCardActionDraw(selectedCardIndices: CardIndices) {
        const { deck, person } = this.calcPersonMetadata(this.turn);
        const handIndex = selectedCardIndices.getFirstIndex(
            person,
            DeckArea.Hand
        );
        if (handIndex == undefined)
            throw new Error("hand index must be specified!");
        const drawnCard = deck.drawUnit(handIndex);
        if (this.isPlayerTurn) {
            this.playerCardDrawn = true;
            this.addMessage(`You draw: ${drawnCard.name}.`);
        } else {
            this.enemyCardDrawn = true;
            this.addMessage(`Enemy draws: ${drawnCard.name}.`);
        }
    }

    processTurnAction(action: TurnAction) {
        if (action == TurnAction.EndTurn) {
            this.nextTurn();
        }
    }

    calcPersonMetadata(person: Person) {
        const opponent = Person.Enemy ? Person.Player : Person.Enemy;
        const deck = person == Person.Enemy ? this.enemyDeck : this.playerDeck;
        const opposingDeck =
            person == Person.Player ? this.enemyDeck : this.playerDeck;
        return { person, opponent, deck, opposingDeck };
    }

    calcTargetableIndices(
        person: Person,
        handIndex: number,
        card: UnitCard,
        action: CardAction
    ) {
        const { deck, opponent, opposingDeck } =
            this.calcPersonMetadata(person);
        const validIndices: CardIndices = new CardIndices();
        if (action == CardAction.Move) {
            if (handIndex < 0) {
                validIndices.addIndices(person, DeckArea.Hand, [handIndex - 1]);
            }
            if (handIndex < deck.hand.size - 1) {
                validIndices.addIndices(person, DeckArea.Hand, [handIndex + 1]);
            }
        }
        if (action == CardAction.Attack) {
            if (opposingDeck.hand.cards[handIndex]) {
                validIndices.addIndices(opponent, DeckArea.Hand, [handIndex]);
            } else {
                validIndices.addIndices(opponent, DeckArea.General, [0]);
            }
        }
        return validIndices;
    }
}
