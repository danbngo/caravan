import { Board } from "../classes/Board";
import { CardLocation } from "../classes/CardLocation";
import { GeneralCard } from "../classes/GeneralCard";
import { UnitCard } from "../classes/UnitCard";
import { CardClickHandler } from "./interfaces";
import { NoCardView } from "./NoCardView";
import { UnitCardView } from "./UnitCardView";

export function CardView({
    board,
    card,
    cardLocation,
    onClick,
    isSelected,
    isTargeted
}: {
    board: Board;
    card: UnitCard | GeneralCard | undefined;
    cardLocation?: CardLocation | undefined;
    onClick?: CardClickHandler | undefined;
    isSelected?: boolean | undefined;
    isTargeted?: boolean | undefined;
}) {
    if (!card) return <NoCardView onClick={onClick} isSelected={isSelected} isTargeted={isTargeted} />;
    return (
        <UnitCardView
            board={board}
            card={card}
            cardLocation={cardLocation}
            onClick={onClick}
            isSelected={isSelected}
            isTargeted={isTargeted}
        />
    );
}
