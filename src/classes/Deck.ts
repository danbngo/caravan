import { DeckArea } from "../enums";
import { CardLocation } from "./CardLocation";
import { CardLine } from "./CardLine";
import { Person } from "./Person";
import { CardStack } from "./CardStack";
import { UnitCard } from "./UnitCard";
import { GENERAL_CARDS } from "../defs/GENERAL_CARDS";

export class Deck {
    owner: Person;
    general: UnitCard;
    units: Set<UnitCard>;
    reserves: CardStack;
    hand: CardLine;
    line: CardLine;
    grave: CardStack;

    constructor({ owner, units, general }: { owner: Person; units?: Set<UnitCard> | undefined; general?: UnitCard }) {
        this.owner = owner;
        if (!units) units = new Set();
        this.units = new Set(Array.from(units).map((uc) => UnitCard.copy(uc, owner)));
        this.general = UnitCard.copy(general || GENERAL_CARDS.GENERAL);
        this.reserves = new CardStack({ cards: [...this.units] });
        this.line = new CardLine({ cards: [], size: 5 });
        this.hand = new CardLine({ cards: [], size: 7 });
        this.grave = new CardStack();
        this.reset();
    }

    reset() {
        console.log("resetting deck");
        for (const u of this.units) u.owner = this.owner;
        this.general.owner = this.owner;
        this.reserves = new CardStack({ cards: [...this.units] });
        this.line = new CardLine({ cards: [], size: this.line.size });
        this.hand = new CardLine({ cards: [], size: this.hand.size });
        this.grave = new CardStack();
        this.general.location = new CardLocation(this, DeckArea.General);
        this.shuffle();
        this.refillHand();
    }

    shuffle() {
        console.log("shuffling card");
        this.reserves.shuffle();
        for (let i = 0; i < this.reserves.length; i++) {
            const card = this.reserves.cards[i];
            card!.location = new CardLocation(this, DeckArea.Reserves, i);
        }
    }

    refillHand(numCardsToRefill = Math.min(this.reserves.length, this.hand.size - this.hand.numCards)) {
        console.log("refilling hand");
        for (let i = 0; i < numCardsToRefill; i++) {
            const card = this.reserves.drawCard();
            if (!card) throw new Error("no slots remaining to add card to!");
            const addedToIndex = this.hand.addCard(card);
            card.location = new CardLocation(this, DeckArea.Hand, addedToIndex);
        }
    }

    calcAdjacentLineLocations(handIndex: number) {
        const result: CardLocation[] = [];
        if (handIndex > 0) result.push(new CardLocation(this, DeckArea.Line, handIndex - 1));
        if (handIndex < this.line.size) result.push(new CardLocation(this, DeckArea.Line, handIndex + 1));
        return result;
    }

    calcAllLineLocations() {
        const result: CardLocation[] = [];
        for (let i = 0; i < this.line.size; i++) {
            result.push(new CardLocation(this, DeckArea.Line, i));
        }
        return result;
    }

    getCardAtLocation(cardLocation: CardLocation) {
        const { deckArea, index } = cardLocation;
        if (deckArea == DeckArea.General) return this.general;
        else if (deckArea == DeckArea.Grave) return this.grave.cards[index];
        else if (deckArea == DeckArea.Reserves) return this.reserves.cards[index];
        else if (deckArea == DeckArea.Line) return this.line.cards[index];
        else if (deckArea == DeckArea.Hand) return this.hand.cards[index];
        else throw new Error("unrecognized deckarea");
    }

    placeCard(card: UnitCard, atLineIndex: number) {
        console.log("placing card:", card, atLineIndex);
        const cardAtIndex = this.line.cards[atLineIndex];
        if (cardAtIndex) throw new Error("could not draw to an occupied line index!");
        if (!card || !card.location || card.location.deckArea != DeckArea.Hand)
            throw new Error("placed card must exist and begin in hand!");
        this.hand.removeCard(card);
        this.line.cards[atLineIndex] = card;
        card.location = new CardLocation(this, DeckArea.Line, atLineIndex);
    }

    swapCard(atLineIndex: number, toLineIndex: number) {
        console.log("swapping card:", atLineIndex, toLineIndex);
        const cardAtIndex = this.line.cards[atLineIndex];
        const cardToIndex = this.line.cards[toLineIndex];
        this.line.cards[atLineIndex] = cardToIndex;
        this.line.cards[toLineIndex] = cardAtIndex;
        if (cardAtIndex) cardAtIndex.location = new CardLocation(this, DeckArea.Line, toLineIndex);
        if (cardToIndex) cardToIndex.location = new CardLocation(this, DeckArea.Line, atLineIndex);
    }

    withdrawCard(card: UnitCard) {
        console.log("withdrawing card:", card);
        if (!card.location) throw new Error("card must have a location first!");
        if (card.location.deckArea !== DeckArea.Line) throw new Error("card should have been in line!");
        this.line.removeCard(card);
        card.tap(); //should never matter but cant be too safe!
        card.heal(card.maxHp);
        this.reserves.addCard(card, "bottom");
        card.location = new CardLocation(this, DeckArea.Reserves, this.reserves.length - 1);
    }

    dumpCard(card: UnitCard) {
        console.log("dumping card:", card);
        if (!card.location) throw new Error("card must have a location first!");
        if (card.location.deckArea !== DeckArea.Hand) throw new Error("card should have been in hand!");
        this.hand.removeCard(card);
        this.reserves.addCard(card, "bottom");
        card.location = new CardLocation(this, DeckArea.Reserves, this.reserves.length - 1);
    }

    buryCard(card: UnitCard) {
        console.log("burying card:", card);
        if (!card.location) throw new Error("card must have a location first!");
        if (card.location.deckArea !== DeckArea.Line) throw new Error("card should have been in line!");
        this.line.removeCard(card);
        card.hp = 0; //should always be the case but cant be too safe!
        card.tap(); //should never matter but cant be too safe!
        this.grave.addCard(card, "bottom");
        card.location = new CardLocation(this, DeckArea.Grave, this.grave.length - 1);
    }

    removeCard(card: UnitCard) {
        console.log("removing card:", card);
        if (!card.location) throw new Error("card must have a location first!");
        if (card.location.deckArea !== DeckArea.Line) throw new Error("card should have been in hand!");
        const { index } = card.location;
        this.line.cards[index] = undefined;
        card.location = undefined;
    }

    addCard(card: UnitCard) {
        console.log("adding card to reserves:", card);
        this.reserves.addCard(card, "bottom");
        card.location = new CardLocation(this, DeckArea.Reserves, this.reserves.length - 1);
    }
}
