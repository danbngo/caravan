import { CardAction, DeckArea, Person, TurnAction } from "../enums";
import { randomMemberOfArray } from "../utils/rndUtils";
import { Action } from "./Action";
import { Board } from "./Board";
import { CardLocations } from "./CardLocations";

export class AI {
    board: Board;

    constructor({ board }: { board: Board }) {
        this.board = board;
    }

    chooseAction() {
        const actions = this.calcPotentialActions();
        const action = randomMemberOfArray(actions);
        return action;
    }

    calcPotentialActions() {
        const actions: Action[] = [];
        const { enemyDeck, enemyCardDrawn } = this.board;
        enemyDeck.hand.cards.forEach((card, handIndex) => {
            const selectedCardLocations = new CardLocations();
            selectedCardLocations.addLocations(Person.Enemy, DeckArea.Hand, [
                handIndex
            ]);
            if (!card) {
                if (!enemyCardDrawn) {
                    actions.push(
                        new Action({
                            cardAction: CardAction.Draw,
                            selectedCardLocations
                        })
                    );
                }
                return;
            }
            if (card.tapped || card.dead) return;
            actions.push(
                new Action({
                    cardAction: CardAction.Retreat,
                    selectedCardLocations
                })
            );
            const validMoveLocations = this.board
                .calcTargetableLocations(
                    Person.Enemy,
                    handIndex,
                    card,
                    CardAction.Move
                )
                .split();
            for (const i of validMoveLocations) {
                actions.push(
                    new Action({
                        cardAction: CardAction.Move,
                        selectedCardLocations,
                        targetCardLocations: i
                    })
                );
            }
            const validAttackLocations = this.board
                .calcTargetableLocations(
                    Person.Enemy,
                    handIndex,
                    card,
                    CardAction.Attack
                )
                .split();
            for (const i of validAttackLocations) {
                actions.push({
                    cardAction: CardAction.Attack,
                    selectedCardLocations,
                    targetCardLocations: i
                });
            }
        });
        if (actions.length == 0)
            actions.push({ turnAction: TurnAction.EndTurn });
        return actions;
    }
}
