import { UnitCard } from "../../classes/UnitCard";
import { CardClickHandler, LocationClickHandler } from "../Common/types";
import { NoCardView } from "./NoCardView";
import { UnitCardView } from "./UnitCardView";

export function CardView({
    card,
    onClickCard,
    onClickLocation,
    isSelected,
    isTargeted
}: {
    card: UnitCard | undefined;
    onClickCard?: CardClickHandler | undefined;
    onClickLocation?: LocationClickHandler | undefined;
    isSelected?: boolean | undefined;
    isTargeted?: boolean | undefined;
}) {
    if (!card) return <NoCardView onClickLocation={onClickLocation} isSelected={isSelected} isTargeted={isTargeted} />;
    return <UnitCardView card={card} onClickCard={onClickCard} isSelected={isSelected} isTargeted={isTargeted} />;
}
