import { GENERAL_CARDS } from "../defs/CARDS";
import { CardPosition, DeckArea, Person } from "../enums";
import { CardLocation } from "./CardLocation";
import { GeneralCard } from "./GeneralCard";
import { Hand } from "./Hand";
import { Pile } from "./Pile";
import { Stack } from "./Stack";
import { UnitCard } from "./UnitCard";

export class Deck {
    owner: Person;
    generalCard: GeneralCard;
    unitCards: Set<UnitCard>;
    reserveStack: Stack;
    hand: Hand;
    gravePile: Pile;

    constructor(
        {
            owner,
            unitCards,
            generalCard
        }: {
            owner: Person;
            unitCards?: Set<UnitCard> | undefined;
            generalCard?: GeneralCard;
        } = { owner: Person.Player }
    ) {
        this.owner = owner;
        if (!unitCards) unitCards = new Set();
        this.unitCards = new Set(Array.from(unitCards).map((uc) => UnitCard.copy(uc, owner)));
        this.generalCard = GeneralCard.copy(generalCard || GENERAL_CARDS.GENERAL);
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

    getCardAtLocation(cardLocation: CardLocation) {
        const { deckArea, index } = cardLocation;
        if (deckArea == DeckArea.General) return this.generalCard;
        else if (deckArea == DeckArea.Grave) return this.gravePile.cards[index];
        else if (deckArea == DeckArea.Reserves) return this.reserveStack.cards[index];
        else if (deckArea == DeckArea.Hand) return this.hand.cards[index];
        else throw new Error("unrecognized deckarea");
    }

    drawCard(atHandIndex: number) {
        const cardAtIndex = this.hand.cards[atHandIndex];
        if (cardAtIndex) throw new Error("could not draw to an occupied hand index!");
        if (this.reserveStack.cards.length == 0) throw new Error("no cards left to draw!");
        const drawnCard = this.reserveStack.drawCard();
        if (!drawnCard) throw new Error("could not draw from reserves!");
        if (cardAtIndex) this.withdrawCard(atHandIndex);
        this.hand.cards[atHandIndex] = drawnCard;
        drawnCard.position = CardPosition.Hand;
        return drawnCard;
    }

    swapCard(atHandIndex: number, toHandIndex: number) {
        const cardAtIndex = this.hand.cards[atHandIndex];
        const cardToIndex = this.hand.cards[toHandIndex];
        this.hand.cards[atHandIndex] = cardToIndex;
        this.hand.cards[toHandIndex] = cardAtIndex;
    }

    withdrawCard(atHandIndex: number) {
        const withdrawnCard = this.hand.cards[atHandIndex];
        if (!withdrawnCard) throw new Error("no card at given hand index!");
        this.hand.cards[atHandIndex] = undefined;
        withdrawnCard.tap(); //should never matter but cant be too safe!
        withdrawnCard.position = CardPosition.Reserve;
    }

    buryCard(atHandIndex: number) {
        const buriedCard = this.hand.cards[atHandIndex];
        if (!buriedCard) throw new Error("no card at given hand index!");
        this.hand.cards[atHandIndex] = undefined;
        buriedCard.hp = 0;
        buriedCard.tap(); //should never matter but cant be too safe!
        buriedCard.position = CardPosition.Grave;
        this.gravePile.cards.unshift(buriedCard);
    }
}
