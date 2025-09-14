import { GENERAL_CARDS } from "../defs/CARDS";
import { CardPosition } from "../enums";
import { GeneralCard } from "./GeneralCard";
import { Hand } from "./Hand";
import { Pile } from "./Pile";
import { Stack } from "./Stack";
import { UnitCard } from "./UnitCard";

export class Deck {
    generalCard: GeneralCard;
    unitCards: Set<UnitCard>;
    reserveStack: Stack;
    hand: Hand;
    gravePile: Pile;

    constructor({
        unitCards,
        generalCard
    }: {
        unitCards?: Set<UnitCard> | undefined;
        generalCard?: GeneralCard;
    } = {}) {
        if (!unitCards) unitCards = new Set();
        this.unitCards = new Set(
            Array.from(unitCards).map((uc) => UnitCard.copy(uc))
        );
        this.generalCard = GeneralCard.copy(
            generalCard || GENERAL_CARDS.GENERAL
        );
        this.reserveStack = new Stack({ cards: [...this.unitCards] });
        this.hand = new Hand();
        this.gravePile = new Pile();
        this.reset();
    }

    reset() {
        this.reserveStack = new Stack({ cards: [...this.unitCards] });
        this.hand = new Hand();
        this.gravePile = new Pile();
        this.reserveStack.shuffle();
        for (const card of this.unitCards) card.position = CardPosition.Reserve;
        this.generalCard.position = CardPosition.General;
    }

    drawUnit(atHandIndex: number) {
        const cardAtIndex = this.hand.cards[atHandIndex];
        if (cardAtIndex)
            throw new Error("could not draw to an occupied hand index!");
        if (this.reserveStack.cards.length == 0)
            throw new Error("no cards left to draw!");
        const drawnCard = this.reserveStack.drawCard();
        if (!drawnCard) throw new Error("could not draw from reserves!");
        if (cardAtIndex) this.withdrawUnit(atHandIndex);
        this.hand.cards[atHandIndex] = drawnCard;
        drawnCard.tap();
        drawnCard.position = CardPosition.Hand;
        return drawnCard;
    }

    moveUnit(atHandIndex: number, toHandIndex: number) {
        const cardAtIndex = this.hand.cards[atHandIndex];
        const cardToIndex = this.hand.cards[toHandIndex];
        this.hand.cards[atHandIndex] = cardToIndex;
        this.hand.cards[toHandIndex] = cardAtIndex;
    }

    withdrawUnit(atHandIndex: number) {
        const withdrawnCard = this.hand.cards[atHandIndex];
        if (!withdrawnCard) throw new Error("no card at given hand index!");
        this.hand.cards[atHandIndex] = undefined;
        withdrawnCard.tap(); //should never matter but cant be too safe!
        withdrawnCard.position = CardPosition.Reserve;
    }
}
