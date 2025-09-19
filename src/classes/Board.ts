import { CardAction, DeckArea, TurnAction } from "../enums";
import { attackCard, calcAttackableLocations, canAttack } from "../sys/attack";
import { calcPlaceableLocations, canDraw, drawCard } from "../sys/draw";
import { canWithdraw, withdrawCard } from "../sys/withdraw";
import { calcSwappableLocations, canSwap, swapCard } from "../sys/swap";
import { CardLocations } from "./CardLocations";
import { Deck } from "./Deck";
import { Move } from "./Move";
import { UnitCard } from "./UnitCard";
import { unwaitCard, waitCard } from "../sys/wait";
import { PEOPLE } from "../defs/PEOPLE";
import { Person } from "./Person";

export class Board {
    playerDeck: Deck;
    enemyDeck: Deck;
    //playerCardDrawn: boolean;
    //enemyCardDrawn: boolean;
    turn: Person;
    round: number;
    messages: string[];

    constructor({ playerDeck, enemyDeck }: { playerDeck?: Deck; enemyDeck?: Deck } = {}) {
        this.playerDeck = playerDeck || new Deck();
        this.enemyDeck = enemyDeck || new Deck();
        this.turn = PEOPLE.PLAYER;
        this.round = 0; //need to manually start player turn
        //this.playerCardDrawn = false;
        //this.enemyCardDrawn = false;
        this.messages = ["Game started."];
        this.playerDeck.reset();
        this.enemyDeck.reset();
        this.playerDeck.owner.mp = 0;
        this.enemyDeck.owner.mp = 0;
        this.startTurn(PEOPLE.PLAYER);
    }

    calcCardMetadata(card: UnitCard) {
        const { owner, location } = card;
        if (!owner || !location) throw new Error("card must have an owner and location");
        const { index, deckArea } = location;
        const personMetadata = this.calcPersonMetadata(owner);
        const foeCard = deckArea == DeckArea.Hand ? personMetadata.foeDeck.hand.cards[index] : undefined;
        return { ...personMetadata, owner, location, card, deckArea, index, foeCard };
    }

    addMessage(msg: string) {
        this.messages.push(msg);
    }

    endTurn(person: Person) {
        console.log("ending turn for:", person);
        const { deck, foe } = this.calcPersonMetadata(person);
        console.log("foe:", foe);
        for (const card of deck.hand.cards) {
            if (card && !card.tapped) {
                if (card?.traitIDs.includes("LIVING")) card.heal(1);
            }
        }
        this.addMessage(`${person} turn: ended.`);
        this.startTurn(foe);
    }

    startTurn(person: Person) {
        this.turn = person;
        const { deck } = this.calcPersonMetadata(person);
        deck.owner.healMp(1);
        for (const card of deck.units) card.untap();
        if (person == PEOPLE.PLAYER) {
            this.round++;
            this.addMessage(`...Round ${this.round}...`);
        }
        this.addMessage(`${person} turn: started.`);
    }

    calcValidReserveMoves(person: Person) {
        const moves: Move[] = [];
        const { deck } = this.calcPersonMetadata(person);
        const { reserves } = deck;
        const nextReserve = reserves.cards[0];
        if (!nextReserve) return [];
        if (canDraw(this, nextReserve)) {
            const placeableLocations = calcPlaceableLocations(this, person);
            for (const pl of placeableLocations.locations) {
                moves.push(new Move(CardAction.Draw, nextReserve, pl));
            }
        }
        return moves;
    }

    calcValidHandMoves(person: Person) {
        const moves: Move[] = [];
        const { deck } = this.calcPersonMetadata(person);
        for (const card of deck.hand.cards) {
            if (!card || card.tapped || card.dead || card.waiting) continue;
            const [caIDs] = [card.abilityIDs];
            console.log(caIDs);
            if (canWithdraw(this, card)) {
                moves.push(new Move(CardAction.Withdraw, card));
            }
            if (canAttack(card)) {
                const validAttackLocations = this.calcTargetableLocations(card, CardAction.Attack).locations;
                for (const i of validAttackLocations) {
                    //const targetCard = this.playerDeck.hand.cards[i.index];
                    moves.push(new Move(CardAction.Attack, card, i));
                }
            }
            if (canSwap(this, card)) {
                const validMoveLocations = this.calcTargetableLocations(card, CardAction.Swap).locations;
                for (const i of validMoveLocations) {
                    //const targetCard = this.playerDeck.hand.cards[i.index];
                    moves.push(new Move(CardAction.Swap, card, i));
                }
            }
        }
        //if (moves.length == 0) moves.push(new Move(TurnAction.EndTurn));
        return moves;
    }

    processMove(move: Move) {
        console.log("process move called:", move);
        const { action } = move;
        if (action == CardAction.Draw) {
            drawCard(this, move);
        } else if (action == CardAction.Swap) {
            swapCard(this, move);
        } else if (action == CardAction.Withdraw) {
            withdrawCard(this, move);
        } else if (action == CardAction.Attack) {
            attackCard(this, move);
        } else if (action == CardAction.Wait) {
            waitCard(move.card);
        } else if (action == CardAction.Un_Wait) {
            unwaitCard(move.card);
        } else throw new Error("unrecognized action type");
    }

    processTurnAction(turnAction: TurnAction) {
        if (turnAction == TurnAction.EndTurn) {
            this.endTurn(this.turn);
        } else throw new Error("unrecognized action type");
    }

    calcPersonMetadata(person: Person) {
        const foe = person == PEOPLE.ENEMY ? PEOPLE.PLAYER : PEOPLE.ENEMY;
        const deck = person == PEOPLE.ENEMY ? this.enemyDeck : this.playerDeck;
        const foeDeck = person == PEOPLE.ENEMY ? this.playerDeck : this.enemyDeck;
        const { general } = deck;
        //const cardDrawn = person == PEOPLE.PLAYER ? this.playerCardDrawn : this.enemyCardDrawn;
        return { person, foe, deck, foeDeck, general };
    }

    calcTargetableLocations(card: UnitCard, cardAction: CardAction): CardLocations {
        if (cardAction == CardAction.Swap) return calcSwappableLocations(this, card);
        else if (cardAction == CardAction.Attack) return calcAttackableLocations(this, card);
        else if (cardAction == CardAction.Draw)
            return !card.owner ? new CardLocations([]) : calcPlaceableLocations(this, card.owner);
        else if (cardAction == CardAction.Wait) return new CardLocations([]);
        else throw new Error("unrecognized card action!");
    }
}
