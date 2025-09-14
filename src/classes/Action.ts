import { CardAction, TurnAction } from "../enums";
import { CardIndices } from "./CardIndices";
import { UnitCard } from "./UnitCard";

export class Action {
    selectedCardIndices?: CardIndices | undefined;
    selectedCard?: UnitCard | undefined;
    cardAction?: CardAction | undefined;
    turnAction?: TurnAction | undefined;
    targetCard?: UnitCard | undefined;
    targetCardIndices?: CardIndices | undefined;

    constructor({
        selectedCardIndices,
        selectedCard,
        cardAction,
        turnAction,
        targetCard,
        targetCardIndices,
    }: {
        selectedCardIndices?: CardIndices | undefined;
        selectedCard?: UnitCard | undefined;
        cardAction?: CardAction | undefined;
        turnAction?: TurnAction | undefined;
        targetCard?: UnitCard | undefined;
        targetCardIndices?: CardIndices | undefined;
    }) {
        this.selectedCard = selectedCard;
        this.selectedCardIndices = selectedCardIndices;
        this.turnAction = turnAction;
        this.targetCard = targetCard;
        this.targetCardIndices = targetCardIndices;
        this.cardAction = cardAction;
    }
}
