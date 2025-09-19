import { UnitCard } from "../classes/UnitCard";
import { CardAction } from "../enums";

export function canWait(card: UnitCard): boolean {
    if (card.tapped || card.restrictedActions.includes(CardAction.Wait)) return false;
    if (card.waiting) return false;
    return true;
}

export function waitCard(card: UnitCard) {
    card.waiting = true;
}

export function unwaitCard(card: UnitCard) {
    card.waiting = false;
}
