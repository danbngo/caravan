import { CardLocations } from "../classes/CardLocations";
import { gs } from "../classes/Game";
import { Move } from "../classes/Move";
import { Person } from "../classes/Person";
import { UnitCard } from "../classes/UnitCard";
import { DeckArea } from "../enums";

export class PlacementSystem {
    static canPlace(card: UnitCard): boolean {
        if (!card.location || card.location.deckArea !== DeckArea.Hand) {
            throw new Error("shouldnt be checking canPlace on non-hand card"); //return false;
        }
        const { owner } = gs.board.calcCardMetadata(card);
        if (owner.mp < card.level) return false;
        return true;
    }

    static calcPlaceableLocations(person: Person) {
        const { deck } = gs.board.calcPersonMetadata(person);
        const validLocations: CardLocations = new CardLocations([deck]);
        for (let i = 0; i < deck.line.size; i++) {
            const cardAtIndex = deck.line.cards[i];
            if (cardAtIndex) continue;
            validLocations.addLocations(deck, DeckArea.Line, [i]);
        }
        return validLocations;
    }

    static placeCard(move: Move) {
        console.log("placeCard called:", move);
        const { card, targetLocation } = move;
        if (!targetLocation) throw new Error("selected card location must be specified");
        const { owner, deck } = gs.board.calcCardMetadata(card);
        deck.placeCard(card, targetLocation.index);
        owner.damageMp(card.level);
        card.tap();
        if (owner == gs.player) {
            //board.playerCardDrawn = true;
            gs.addMessage(`You place: ${card.name}.`);
        } else if (owner == gs.enemy) {
            //board.enemyCardDrawn = true;
            gs.addMessage(`Enemy place: ${card.name}.`);
        } else throw new Error("unrecognized deck owner!");
    }
}
