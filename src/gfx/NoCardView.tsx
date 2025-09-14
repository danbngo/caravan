import { CardDisplayState } from "../enums";
import { CardWrapper } from "./CardWrapper";
import { CardClickHandler } from "./interfaces";

export function NoCardView({
    onClick,
    isSelected,
    isTargeted
}: {
    onClick: CardClickHandler | undefined;
    isSelected?: boolean | undefined;
    isTargeted?: boolean | undefined;
}) {
    return (
        <CardWrapper
            onClick={onClick}
            isSelected={isSelected}
            isTargeted={isTargeted}
            title="Empty "
            displayState={CardDisplayState.Empty}
        ></CardWrapper>
    );
}
