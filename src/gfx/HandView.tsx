import { CardLocations } from "../classes/CardLocations";
import { Hand } from "../classes/Hand";
import { DeckArea, Person } from "../enums";
import { CardView } from "./CardView";
import { HandClickHandler } from "./interfaces";

export function HandView({
    hand,
    person,
    onClick,
    selectedCardIndex,
    targetedCardLocations
}: {
    hand: Hand;
    person: Person;
    onClick?: HandClickHandler | undefined;
    selectedCardIndex?: number | undefined;
    targetedCardLocations?: CardLocations | undefined;
}) {
    return (
        <div className="flex flex-row gap-4 overflow-x-auto p-2">
            {hand.cards.map((card, index) => (
                <CardView
                    key={index}
                    isSelected={selectedCardIndex == index}
                    isTargeted={targetedCardLocations?.hasIndex(
                        person,
                        DeckArea.Hand,
                        index
                    )}
                    onClick={() => {
                        if (onClick) onClick(index);
                    }}
                    card={card}
                />
            ))}
        </div>
    );
}
