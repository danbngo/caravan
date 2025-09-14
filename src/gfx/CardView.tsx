import { GeneralCard } from "../classes/GeneralCard";
import { UnitCard } from "../classes/UnitCard";
import { CardClickHandler } from "./interfaces";
import { NoCardView } from "./NoCardView";
import { UnitCardView } from "./UnitCardView";

export function CardView({
    card,
    onClick,
    isSelected,
    isTargeted
}: {
    card: UnitCard | GeneralCard | undefined;
    onClick?: CardClickHandler | undefined;
    isSelected?: boolean | undefined;
    isTargeted?: boolean | undefined;
}) {
    if (!card)
        return (
            <NoCardView
                onClick={onClick}
                isSelected={isSelected}
                isTargeted={isTargeted}
            />
        );
    return (
        <UnitCardView
            card={card}
            onClick={onClick}
            isSelected={isSelected}
            isTargeted={isTargeted}
        />
    );
}
