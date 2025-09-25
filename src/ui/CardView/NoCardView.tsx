import { CardLocation } from "../../classes/CardLocation";
import { CardDisplayState } from "../../enums";
import { LocationClickHandler } from "../Common/types";
import { CardWrapper } from "./CardWrapper";

export function NoCardView({
    cardLocation,
    onClickLocation,
    isSelected,
    isTargeted
}: {
    cardLocation?: CardLocation | undefined;
    onClickLocation: LocationClickHandler | undefined;
    isSelected?: boolean | undefined;
    isTargeted?: boolean | undefined;
}) {
    return (
        <CardWrapper
            isSelected={isSelected}
            isTargeted={isTargeted}
            title="Empty"
            displayState={CardDisplayState.Empty}
            onClick={() => {
                if (onClickLocation && cardLocation) onClickLocation(cardLocation);
            }}
        ></CardWrapper>
    );
}
