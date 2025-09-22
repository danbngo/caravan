import { CardLocation } from "../../classes/CardLocation";
import { CardLocations } from "../../classes/CardLocations";
import { Deck } from "../../classes/Deck";
import { UnitCard } from "../../classes/UnitCard";
import { DeckArea } from "../../enums";
import { CardView } from "./CardView";
import { CardClickHandler } from "../Common/types";

export function LineView({
    deck,
    cards,
    onClick,
    selectedCardIndex,
    targetCardLocations
}: {
    deck: Deck;
    cards: (UnitCard | undefined)[];
    onClick?: CardClickHandler | undefined;
    selectedCardIndex?: number | undefined;
    targetCardLocations?: CardLocations | undefined;
}) {
    return (
        <div className="flex flex-row gap-4 p-2">
            {cards.map((card, index) => (
                <CardView
                    key={index}
                    isSelected={selectedCardIndex == index}
                    isTargeted={targetCardLocations?.hasIndex(deck, DeckArea.Line, index)}
                    onClick={() => {
                        console.log("handview onclick");
                        if (onClick) onClick(new CardLocation(deck, DeckArea.Line, index));
                    }}
                    card={card}
                />
            ))}
        </div>
    );
}
