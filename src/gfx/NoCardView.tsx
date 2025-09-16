import { CardLocation } from "../classes/CardLocation";
import { CardDisplayState } from "../enums";
import { CardWrapper } from "./CardWrapper";
import { CardClickHandler } from "./interfaces";

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
