import { CardAction, DeckArea, Person, TurnAction } from "../enums";
import { TargetingProps } from "../interfaces/TargetingProps";
import { attackCard, calcAttackableLocations } from "../sys/attack";
import { drawCard } from "../sys/draw";
import { canWithdraw, withdrawCard } from "../sys/withdraw";
import { calcSwappableLocations, swapCard } from "../sys/swap";
import { CardLocation } from "./CardLocation";
import { CardLocations } from "./CardLocations";
import { Deck } from "./Deck";
import { Move } from "./Move";

export class Board {
    playerDeck: Deck;
    enemyDeck: Deck;
    playerCardDrawn: boolean;
    enemyCardDrawn: boolean;
    turn: Person;
    round: number;
    messages: string[];

    constructor({ playerDeck, enemyDeck }: { playerDeck?: Deck; enemyDeck?: Deck } = {}) {
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
            for (const card of this.playerDeck.hand.cards) {
                if (card && !card.tapped) {
                    if (card?.traitIDs.includes("LIVING")) card.heal(1);
                }
            }
            for (const card of this.enemyDeck.unitCards) card.untap();
            this.addMessage(`Player turn: ended.`);
            this.addMessage(`Enemy turn: started.`);
        } else {
            this.turn = Person.Player;
            for (const card of this.enemyDeck.hand.cards) {
                if (card && !card.tapped) {
                    if (card?.traitIDs.includes("LIVING")) card.heal(1);
                }
            }
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

    calcValidUnitMoves(person: Person) {
        const moves: Move[] = [];
        const { deck, cardDrawn } = this.calcPersonMetadata(person);
        deck.hand.cards.forEach((selectedCard, handIndex) => {
            const selectedCardLocation = new CardLocation(deck, DeckArea.Hand, handIndex);
            if (!selectedCard) {
                if (!cardDrawn) {
                    moves.push(new Move(CardAction.Draw, selectedCardLocation));
                }
                return;
            }
            if (selectedCard.tapped || selectedCard.dead) return;
            const [caIDs] = [selectedCard.abilityIDs];
            console.log(caIDs);
            const targetingProps = this.calcTargetingProps(selectedCardLocation);
            if (canWithdraw(targetingProps)) {
                moves.push(new Move(CardAction.Withdraw, selectedCardLocation));
            }
            const validMoveLocations = this.calcTargetableLocations(selectedCardLocation, CardAction.Swap).locations;
            for (const i of validMoveLocations) {
                //const targetCard = this.playerDeck.hand.cards[i.index];
                moves.push(new Move(CardAction.Swap, selectedCardLocation, i));
            }
            const validAttackLocations = this.calcTargetableLocations(selectedCardLocation, CardAction.Attack).locations;
            for (const i of validAttackLocations) {
                //const targetCard = this.playerDeck.hand.cards[i.index];
                moves.push(new Move(CardAction.Attack, selectedCardLocation, i));
            }
        });
        //if (moves.length == 0) moves.push(new Move(TurnAction.EndTurn));
        return moves;
    }

    processMove(move: Move) {
        const { action } = move;
        if (action == TurnAction.EndTurn) {
            this.nextTurn();
        } else if (action == CardAction.Draw) {
            drawCard(this, move);
        } else if (action == CardAction.Swap) {
            swapCard(this, move);
        } else if (action == CardAction.Withdraw) {
            withdrawCard(this, move);
        } else if (action == CardAction.Attack) {
            attackCard(this, move);
        } else throw new Error("unrecognized action type");
    }

    calcPersonMetadata(person: Person) {
        const opponent = Person.Enemy ? Person.Player : Person.Enemy;
        const deck = person == Person.Enemy ? this.enemyDeck : this.playerDeck;
        const opposingDeck = person == Person.Player ? this.enemyDeck : this.playerDeck;
        const cardDrawn = person == Person.Player ? this.playerCardDrawn : this.enemyCardDrawn;
        return { person, opponent, deck, opposingDeck, cardDrawn };
    }

    calcTargetableLocations(selectedCardLocation: CardLocation, cardAction: CardAction): CardLocations {
        const targetingProps = this.calcTargetingProps(selectedCardLocation);
        if (cardAction == CardAction.Swap) return calcSwappableLocations(targetingProps);
        if (cardAction == CardAction.Attack) return calcAttackableLocations(targetingProps);
        else throw new Error("unrecognized card action!");
    }

    calcTargetingProps(selectedCardLocation: CardLocation) {
        const { person, index, card } = selectedCardLocation;
        if (!card) throw new Error("no point calcing targets if no card at location!");
        const { deck, opposingDeck } = this.calcPersonMetadata(person);
        const targetingProps: TargetingProps = { person, index, card, deck, opposingDeck };
        return targetingProps;
    }
}
