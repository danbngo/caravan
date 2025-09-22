import { AttackEvent } from "./AttackEvent";
import { CardLocations } from "../classes/CardLocations";
import { gs } from "../classes/Game";
import { Move } from "../classes/Move";
import { UnitCard } from "../classes/UnitCard";
import { CardAction, DeckArea } from "../enums";

export class AttackSystem {
    static canAttack(card: UnitCard): boolean {
        if (card.tapped || card.restrictedActions.includes(CardAction.Attack)) return false;
        if (card.traitIDs.includes("PACIFIST") || card.traitIDs.includes("BUILDING")) return false;
        return true;
    }

    static calcAttackableLocations(card: UnitCard): CardLocations {
        const { deck, foeDeck, index } = gs.board.calcCardMetadata(card);
        const validLocations: CardLocations = new CardLocations([deck, foeDeck]);
        const targetCard = foeDeck.line.cards[index];
        const [caIDs, ctIDs] = [card.abilityIDs, card.traitIDs];
        const targetAdjacentLocations = foeDeck.calcAdjacentLineLocations(index);
        const foeLineLocations = foeDeck.calcAllLineLocations();

        let bypass: boolean = targetCard == undefined;
        const skip: boolean = ctIDs.includes("PACIFIST") || ctIDs.includes("BUILDING");

        if (!bypass && targetCard) {
            const [taIDs, ttIDs] = [targetCard.abilityIDs, targetCard.traitIDs];
            console.log(taIDs);
            if (ctIDs.includes("FLYING")) {
                if (!ttIDs.includes("FLYING") && !ttIDs.includes("GIANT")) {
                    bypass = true;
                }
            }
            if (!caIDs.includes("STEALTHY")) {
                if (ttIDs.includes("GIANT") || ttIDs.includes("BUILDING")) {
                    bypass = true;
                }
            }
        }
        if (!skip) {
            if (targetCard) validLocations.addLocations(foeDeck, DeckArea.Line, [index]);
            if (caIDs.includes("RANGED")) {
                foeLineLocations.forEach((tal) => {
                    if (tal.card) validLocations.addLocations(foeDeck, DeckArea.Line, [tal.index]);
                });
            } else if (caIDs.includes("REACH"))
                targetAdjacentLocations.forEach((tal) => {
                    if (tal.card) validLocations.addLocations(foeDeck, DeckArea.Line, [tal.index]);
                });
            if (bypass || !targetCard) validLocations.addLocations(foeDeck, DeckArea.General, [0]);
        }
        return validLocations;
    }

    static attackCard(move: Move) {
        const { card, targetLocation } = move;
        if (!targetLocation || !targetLocation.card) throw new Error("targetLocation must be defined");
        return new AttackEvent(card, targetLocation.card);
    }
}
