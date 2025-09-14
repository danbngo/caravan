import { CardAction, DeckArea, Person, TurnAction } from "../enums";
import { randomMemberOfArray } from "../utils/rndUtils";
import { Action } from "./Action";
import { Board } from "./Board";
import { CardIndices } from "./CardIndices";

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
        const { playerDeck, enemyDeck, enemyCardDrawn } = this.board;
        enemyDeck.hand.cards.forEach((card, handIndex) => {
            const selectedCardIndices = new CardIndices();
            selectedCardIndices.addIndices(Person.Enemy, DeckArea.Hand, [
                handIndex,
            ]);
            if (!card) {
                if (!enemyCardDrawn) {
                    actions.push(
                        new Action({
                            cardAction: CardAction.Draw,
                            selectedCardIndices,
                        }),
                    );
                }
                return;
            }
            if (card.tapped || card.dead) return;
            actions.push(
                new Action({
                    cardAction: CardAction.Retreat,
                    selectedCardIndices,
                }),
            );
            const validMoveIndices = this.board
                .calcTargetableIndices(
                    Person.Enemy,
                    handIndex,
                    card,
                    CardAction.Move,
                )
                .split();
            for (const i of validMoveIndices) {
                actions.push(
                    new Action({
                        cardAction: CardAction.Move,
                        selectedCardIndices,
                        targetCardIndices: i,
                    }),
                );
            }
            const validAttackIndices = this.board
                .calcTargetableIndices(
                    Person.Enemy,
                    handIndex,
                    card,
                    CardAction.Attack,
                )
                .split();
            for (const i of validAttackIndices) {
                actions.push({
                    cardAction: CardAction.Attack,
                    selectedCardIndices,
                    targetCardIndices: i,
                });
            }
        });
        if (actions.length == 0)
            actions.push({ turnAction: TurnAction.EndTurn });
        return actions;
    }
}
