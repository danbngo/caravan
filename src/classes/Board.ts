import { CardAction, DeckArea, TurnAction } from "../enums";
import { CardLocations } from "./CardLocations";
import { Move } from "./Move";
import { UnitCard } from "./UnitCard";
import { Person } from "./Person";
import { AI } from "./AI";
import { SwapSystem } from "../systems/SwapSystem";
import { PlacementSystem } from "../systems/PlacementSystem";
import { WithdrawSystem } from "../systems/WithdrawSystem";
import { WaitSystem } from "../systems/WaitSystem";
import { AttackSystem } from "../systems/AttackSystem";
import { TurnSystem } from "../systems/TurnSystem";
import { DrawSystem } from "../systems/DrawSystem";

export class Board {
    player: Person;
    enemy: Person;
    enemyAI: AI;
    turn: Person;
    round: number;

    constructor({ enemy, player }: { enemy: Person; player: Person }) {
        this.player = player;
        this.enemy = enemy;
        this.turn = player;
        this.round = 0; //need to manually start player turn
        this.enemyAI = new AI({ board: this, person: this.enemy });
    }

    calcCardMetadata(card: UnitCard) {
        const { owner, location } = card;
        if (!owner || !location) throw new Error("card must have an owner and location");
        const { index, deckArea } = location;
        const personMetadata = this.calcPersonMetadata(owner);
        const foeCard = deckArea == DeckArea.Line ? personMetadata.foeDeck.line.cards[index] : undefined;
        return { ...personMetadata, owner, location, card, deckArea, index, foeCard };
    }

    calcPersonMetadata(person: Person) {
        const foe = person == this.enemy ? this.player : this.enemy;
        const deck = person == this.enemy ? this.enemy.deck : this.player.deck;
        const foeDeck = person == this.enemy ? this.player.deck : this.enemy.deck;
        const { general } = deck;
        //const cardDrawn = person == this.player ? this.playerCardDrawn : this.enemyCardDrawn;
        return { person, foe, deck, foeDeck, general };
    }

    calcValidHandMoves(person: Person) {
        const moves: Move[] = [];
        const { deck } = this.calcPersonMetadata(person);
        const { hand } = deck;
        for (const card of hand.cards) {
            if (!card) continue;
            if (!PlacementSystem.canPlace(card)) continue;
            const placeableLocations = PlacementSystem.calcPlaceableLocations(person);
            for (const pl of placeableLocations.locations) {
                moves.push(new Move(CardAction.Place, card, pl));
            }
        }
        return moves;
    }

    calcValidLineMoves(person: Person) {
        const moves: Move[] = [];
        const { deck } = this.calcPersonMetadata(person);
        for (const card of deck.line.cards) {
            if (!card || card.tapped || card.dead || card.waiting) continue;
            const [caIDs] = [card.abilityIDs];
            console.log(caIDs);
            if (WithdrawSystem.canWithdraw(card)) {
                moves.push(new Move(CardAction.Withdraw, card));
            }
            if (AttackSystem.canAttack(card)) {
                const validAttackLocations = this.calcTargetableLocations(card, CardAction.Attack).locations;
                for (const i of validAttackLocations) {
                    //const targetCard = this.player.deck.line.cards[i.index];
                    moves.push(new Move(CardAction.Attack, card, i));
                }
            }
            if (SwapSystem.canSwap(card)) {
                const validMoveLocations = this.calcTargetableLocations(card, CardAction.Swap).locations;
                for (const i of validMoveLocations) {
                    //const targetCard = this.player.deck.line.cards[i.index];
                    moves.push(new Move(CardAction.Swap, card, i));
                }
            }
        }
        return moves;
    }

    processMove(move: Move) {
        console.log("process move called:", move);
        const { action } = move;
        if (action == CardAction.Place) {
            PlacementSystem.placeCard(move);
        } else if (action == CardAction.Swap) {
            SwapSystem.swapCard(move);
        } else if (action == CardAction.Withdraw) {
            WithdrawSystem.withdrawCard(move);
        } else if (action == CardAction.Attack) {
            AttackSystem.attackCard(move);
        } else if (action == CardAction.Wait) {
            WaitSystem.waitCard(move.card);
        } else if (action == CardAction.Un_Wait) {
            WaitSystem.unwaitCard(move.card);
        } else throw new Error("unrecognized action type");
    }

    processTurnAction(person: Person, turnAction: TurnAction) {
        if (turnAction == TurnAction.EndTurn) {
            TurnSystem.endTurn(person);
        } else if (turnAction == TurnAction.Redraw) {
            DrawSystem.redraw(person);
        } else throw new Error("unrecognized action type");
    }
    calcTargetableLocations(card: UnitCard, cardAction: CardAction): CardLocations {
        if (cardAction == CardAction.Swap) return SwapSystem.calcSwappableLocations(card);
        else if (cardAction == CardAction.Attack) return AttackSystem.calcAttackableLocations(card);
        else if (cardAction == CardAction.Place)
            return !card.owner ? new CardLocations([]) : PlacementSystem.calcPlaceableLocations(card.owner);
        else if (cardAction == CardAction.Wait) return new CardLocations([]);
        else throw new Error("unrecognized card action!");
    }

    handleEnemyTurn = async (betweenEnemyActions: () => Promise<void>) => {
        console.log("handling enemy turn");
        if (!this.enemyAI) throw new Error("Enemy AI not loaded");
        let attemptsRemaining = 100;
        while (this.turn == this.enemy && attemptsRemaining-- > 0) {
            await betweenEnemyActions();
            if (attemptsRemaining <= 0) throw new Error("too many actions for enemy turn!");
            this.handleEnemyAction();
        }
        betweenEnemyActions();
    };

    handleEnemyAction = () => {
        const choice = this.enemyAI.chooseMove();
        console.log("enemy choice:", choice);
        if (choice instanceof Move) this.processMove(choice);
        else this.processTurnAction(this.enemy, choice);
    };
}
