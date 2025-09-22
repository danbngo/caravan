import { CardLocation } from "../../classes/CardLocation";
import { CardDisplayState } from "../../enums";
import { CardClickHandler } from "../Common/types";
import { CardWrapper } from "./CardWrapper";

export function NoCardView({
    cardLocation,
    onClick,
    isSelected,
    isTargeted
}: {
    cardLocation?: CardLocation | undefined;
    onClick: CardClickHandler | undefined;
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
                if (onClick) onClick(cardLocation);
            }}
        ></CardWrapper>
    );
}
