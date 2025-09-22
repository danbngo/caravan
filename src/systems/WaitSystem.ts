import { UnitCard } from "../classes/UnitCard";
import { CardAction } from "../enums";

export class WaitSystem {
    static canWait(card: UnitCard): boolean {
        if (card.tapped || card.restrictedActions.includes(CardAction.Wait)) return false;
        if (card.waiting) return false;
        return true;
    }

    static waitCard(card: UnitCard) {
        card.waiting = true;
    }

    static unwaitCard(card: UnitCard) {
        card.waiting = false;
    }
}
