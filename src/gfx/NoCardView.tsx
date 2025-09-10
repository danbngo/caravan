import { CardDisplayState } from "../enums";
import { CardWrapper } from "./CardWrapper";
import { CardClickHandler } from "./interfaces";

export function NoCardView({ onClick, isSelected }: { onClick: CardClickHandler | undefined, isSelected?: boolean | undefined }) {
    return <CardWrapper onClick={onClick} isSelected={isSelected} title='Empty ' displayState={CardDisplayState.Empty}>
    </CardWrapper>
}