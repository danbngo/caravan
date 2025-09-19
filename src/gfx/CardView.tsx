import { Board } from "../classes/Board";
import { UnitCard } from "../classes/UnitCard";
import { CardClickHandler } from "./interfaces";
import { NoCardView } from "./NoCardView";
import { UnitCardView } from "./UnitCardView";

export function CardView({
    board,
    card,
    onClick,
    isSelected,
    isTargeted
}: {
    board: Board;
    card: UnitCard | undefined;
    onClick?: CardClickHandler | undefined;
    isSelected?: boolean | undefined;
    isTargeted?: boolean | undefined;
}) {
    if (!card) return <NoCardView onClick={onClick} isSelected={isSelected} isTargeted={isTargeted} />;
    return <UnitCardView board={board} card={card} onClick={onClick} isSelected={isSelected} isTargeted={isTargeted} />;
}
