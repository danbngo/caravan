import { CardLocation } from "../classes/CardLocation";
import { gs } from "../classes/Game";
import { Person } from "../classes/Person";
import { UnitCard } from "../classes/UnitCard";

export class TurnSystem {
    static endTurn(person: Person) {
        const { board } = gs;
        console.log("ending turn for:", person);
        const { deck, foe } = board.calcPersonMetadata(person);
        console.log("foe:", foe);
        for (const card of deck.line.cards) {
            if (!card) continue;
            if (!card.tapped) {
                if (card?.traitIDs.includes("LIVING")) card.heal(1);
            }
            card.untap();
        }
        deck.refillHand();
        gs.addMessage(`${person.name} turn: ended.`);
        this.startTurn(foe);
    }

    static startTurn(person: Person) {
        const { board } = gs;
        board.turn = person;
        const { deck } = board.calcPersonMetadata(person);
        deck.owner.healMp(1);
        for (const card of deck.units) card.untap();
        if (person == board.player) {
            board.round++;
            gs.addMessage(`...Round ${board.round}...`);
        }
        gs.addMessage(`${person.name} turn: started.`);
    }

    static endTurnForCard(cardLocation: CardLocation) {
        const { card, deck } = cardLocation;
        if (!card) return;
        const adjacentLocations: CardLocation[] = deck.calcAdjacentLineLocations(cardLocation.index);
        const adjacentCards: UnitCard[] = adjacentLocations.map((al) => al.card).filter((card) => card !== undefined);
        const [caIDs] = [card.abilityIDs];
        if (caIDs.includes("MEDIC")) {
            for (const adjacentCard of adjacentCards) {
                if (!adjacentCard.traitIDs.includes("LIVING")) continue;
                const healAmount = card.heal(2);
                if (healAmount) gs.addMessage(`${card.name} heals ${adjacentCard.name} for ${healAmount} HP.`);
            }
        }
        if (caIDs.includes("MECHANIC")) {
            for (const adjacentCard of adjacentCards) {
                if (!adjacentCard.traitIDs.includes("CONTRAPTION")) continue;
                const healAmount = card.heal(2);
                if (healAmount) gs.addMessage(`${card.name} repairs ${adjacentCard.name} for ${healAmount} HP.`);
            }
        }
    }
}
