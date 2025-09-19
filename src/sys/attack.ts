import { AttackEvent } from "../classes/AttackEvent";
import { Board } from "../classes/Board";
import { CardLocations } from "../classes/CardLocations";
import { Move } from "../classes/Move";
import { UnitCard } from "../classes/UnitCard";
import { CardAction, DeckArea } from "../enums";

export function canAttack(card: UnitCard): boolean {
    if (card.tapped || card.restrictedActions.includes(CardAction.Attack)) return false;
    if (card.traitIDs.includes("PACIFIST") || card.traitIDs.includes("BUILDING")) return false;
    return true;
}

export function calcAttackableLocations(board: Board, card: UnitCard): CardLocations {
    const { deck, foeDeck, index } = board.calcCardMetadata(card);
    const validLocations: CardLocations = new CardLocations([deck, foeDeck]);
    const targetCard = foeDeck.hand.cards[index];
    const [caIDs, ctIDs] = [card.abilityIDs, card.traitIDs];
    const targetAdjacentLocations = foeDeck.calcAdjacentHandLocations(index);
    const foeHandLocations = foeDeck.calcAllHandLocations();

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
        if (!ctIDs.includes("STEALTHY")) {
            if (ttIDs.includes("GIANT") || ttIDs.includes("BUILDING")) {
                bypass = true;
            }
        }
    }
    if (!skip) {
        if (targetCard) validLocations.addLocations(foeDeck, DeckArea.Hand, [index]);
        if (caIDs.includes("RANGED")) {
            foeHandLocations.forEach((tal) => {
                if (tal.card) validLocations.addLocations(foeDeck, DeckArea.Hand, [tal.index]);
            });
        } else if (caIDs.includes("REACH"))
            targetAdjacentLocations.forEach((tal) => {
                if (tal.card) validLocations.addLocations(foeDeck, DeckArea.Hand, [tal.index]);
            });
        if (bypass || !targetCard) validLocations.addLocations(foeDeck, DeckArea.General, [0]);
    }
    return validLocations;
}

export function attackCard(board: Board, move: Move) {
    const { card, targetLocation } = move;
    if (!targetLocation || !targetLocation.card) throw new Error("targetLocation must be defined");
    return new AttackEvent(board, card, targetLocation.card);
}
