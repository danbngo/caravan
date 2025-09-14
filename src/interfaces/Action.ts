import { UnitCard } from "../classes/UnitCard";
import { TurnAction } from "../enums";

export interface Action {
    selectedCardLocation: CardLocation | undefined;
    selectedCard?: UnitCard | undefined;
    cardAction?: CardAction | undefined;
    turnAction?: TurnAction | undefined;
    targetCard?: UnitCard | undefined;
    targetCardLocation: CardLocation | undefined;
}
