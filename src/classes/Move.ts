import { CardAction } from "../enums";
import { CardLocation } from "./CardLocation";
import { UnitCard } from "./UnitCard";

export class Move {
    action: CardAction;
    card: UnitCard;
    targetLocation?: CardLocation | undefined;
    constructor(action: CardAction, card: UnitCard, targetLocation?: CardLocation | undefined) {
        this.action = action;
        this.card = card;
        this.targetLocation = targetLocation;
    }
}
