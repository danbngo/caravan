import { CardAction, TurnAction } from "../enums";
import { CardLocation } from "./CardLocation";

export class Move {
    action: CardAction | TurnAction;
    selectedCardLocation?: CardLocation | undefined;
    targetCardLocation?: CardLocation | undefined;
    constructor(
        action: CardAction | TurnAction,
        selectedCardLocation?: CardLocation | undefined,
        targetCardLocation?: CardLocation | undefined
    ) {
        this.action = action;
        this.selectedCardLocation = selectedCardLocation;
        this.targetCardLocation = targetCardLocation;
    }
}
