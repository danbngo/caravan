import { GENERAL_CARDS } from "../defs/CARDS";
import { PEOPLE } from "../defs/PEOPLE";
import { DeckArea } from "../enums";
import { CardLocation } from "./CardLocation";
import { Hand } from "./Hand";
import { Person } from "./Person";
import { Stack } from "./Stack";
import { UnitCard } from "./UnitCard";

export class Deck {
    owner: Person;
    general: UnitCard;
    units: Set<UnitCard>;
    reserves: Stack;
    hand: Hand;
    grave: Stack;

    constructor(
        {
            owner,
            units,
            general
        }: {
            owner: Person;
            units?: Set<UnitCard> | undefined;
            general?: UnitCard;
        } = { owner: PEOPLE.PLAYER }
    ) {
        this.owner = owner;
        if (!units) units = new Set();
        this.units = new Set(Array.from(units).map((uc) => UnitCard.copy(uc, owner)));
        this.general = UnitCard.copy(general || GENERAL_CARDS.GENERAL);
        this.reserves = new Stack({ cards: [...this.units] });
        this.hand = new Hand();
        this.grave = new Stack();
        this.reset();
    }

    reset() {
        this.reserves = new Stack({ cards: [...this.units] });
        this.hand = new Hand();
        this.grave = new Stack();
        this.general.location = new CardLocation(this, DeckArea.General);
        this.owner.mp = 0;
        this.shuffle();
        for (const u of this.units) u.owner = this.owner;
        this.general.owner = this.owner;
    }

    shuffle() {
        this.reserves.shuffle();
        for (let i = 0; i < this.reserves.cards.length; i++) {
            const card = this.reserves.cards[i];
            card!.location = new CardLocation(this, DeckArea.Reserves, i);
        }
    }

    calcAdjacentHandLocations(handIndex: number) {
        const result: CardLocation[] = [];
        if (handIndex > 0) result.push(new CardLocation(this, DeckArea.Hand, handIndex - 1));
        if (handIndex < this.hand.size) result.push(new CardLocation(this, DeckArea.Hand, handIndex + 1));
        return result;
    }

    calcAllHandLocations() {
        const result: CardLocation[] = [];
        for (let i = 0; i < this.hand.size; i++) {
            result.push(new CardLocation(this, DeckArea.Hand, i));
        }
        return result;
    }

    getCardAtLocation(cardLocation: CardLocation) {
        const { deckArea, index } = cardLocation;
        if (deckArea == DeckArea.General) return this.general;
        else if (deckArea == DeckArea.Grave) return this.grave.cards[index];
        else if (deckArea == DeckArea.Reserves) return this.reserves.cards[index];
        else if (deckArea == DeckArea.Hand) return this.hand.cards[index];
        else throw new Error("unrecognized deckarea");
    }

    drawCard(atHandIndex: number) {
        const cardAtIndex = this.hand.cards[atHandIndex];
        if (cardAtIndex) throw new Error("could not draw to an occupied hand index!");
        if (this.reserves.cards.length == 0) throw new Error("no cards left to draw!");
        const drawnCard = this.reserves.drawCard();
        if (!drawnCard) throw new Error("could not draw from reserves!");
        this.hand.cards[atHandIndex] = drawnCard;
        drawnCard.location = new CardLocation(this, DeckArea.Hand, atHandIndex);
        return drawnCard;
    }

    swapCard(atHandIndex: number, toHandIndex: number) {
        const cardAtIndex = this.hand.cards[atHandIndex];
        const cardToIndex = this.hand.cards[toHandIndex];
        this.hand.cards[atHandIndex] = cardToIndex;
        this.hand.cards[toHandIndex] = cardAtIndex;
        if (cardAtIndex) cardAtIndex.location = new CardLocation(this, DeckArea.Hand, toHandIndex);
        if (cardToIndex) cardToIndex.location = new CardLocation(this, DeckArea.Hand, atHandIndex);
    }

    withdrawCard(card: UnitCard) {
        if (!card.location) throw new Error("card must have a location first!");
        if (card.location.deckArea !== DeckArea.Hand) throw new Error("card should have been in hand!");
        const { index } = card.location;
        this.hand.cards[index] = undefined;
        card.tap(); //should never matter but cant be too safe!
        card.heal(card.maxHp);
        this.reserves.addCard(card, "bottom");
        card.location = new CardLocation(this, DeckArea.Reserves, this.reserves.cards.length - 1);
    }

    buryCard(card: UnitCard) {
        if (!card.location) throw new Error("card must have a location first!");
        if (card.location.deckArea !== DeckArea.Hand) throw new Error("card should have been in hand!");
        const { index } = card.location;
        this.hand.cards[index] = undefined;
        card.hp = 0; //should always be the case but cant be too safe!
        card.tap(); //should never matter but cant be too safe!
        this.grave.addCard(card, "bottom");
        card.location = new CardLocation(this, DeckArea.Grave, this.grave.cards.length - 1);
    }

    removeCard(card: UnitCard) {
        if (!card.location) throw new Error("card must have a location first!");
        if (card.location.deckArea !== DeckArea.Hand) throw new Error("card should have been in hand!");
        const { index } = card.location;
        this.hand.cards[index] = undefined;
        card.location = undefined;
    }

    addCard(card: UnitCard) {
        this.reserves.addCard(card, "bottom");
        card.location = new CardLocation(this, DeckArea.Reserves, this.reserves.cards.length - 1);
    }
}
