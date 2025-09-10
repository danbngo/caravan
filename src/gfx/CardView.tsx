import { GeneralCard } from "../classes/GeneralCard"
import { UnitCard } from "../classes/UnitCard"
import { CardClickHandler } from "./interfaces"
import { NoCardView } from "./NoCardView"
import { UnitCardView } from "./UnitCardView"

export function CardView({ card, onClick, isSelected }: { card: UnitCard | GeneralCard | undefined, onClick: CardClickHandler | undefined, isSelected?: boolean | undefined }) {
    if (!card) return <NoCardView onClick={onClick} isSelected={isSelected} />
    return <UnitCardView card={card} onClick={onClick} isSelected={isSelected} />
}
