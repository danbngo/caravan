import { CardLocation } from "../classes/CardLocation";
import { CardLocations } from "../classes/CardLocations";
import { Deck } from "../classes/Deck";
import { DeckArea } from "../enums";
import { CardView } from "./CardView";
import { CardClickHandler } from "./interfaces";

export function HandView({
    deck,
    onClick,
    selectedCardIndex,
    targetCardLocations
}: {
    deck: Deck;
    onClick?: CardClickHandler | undefined;
    selectedCardIndex?: number | undefined;
    targetCardLocations?: CardLocations | undefined;
}) {
    const { hand } = deck;
    return (
        <div className="flex flex-row gap-4 overflow-x-auto p-2">
            {hand.cards.map((card, index) => (
                <CardView
                    key={index}
                    isSelected={selectedCardIndex == index}
                    isTargeted={targetCardLocations?.hasIndex(deck, DeckArea.Hand, index)}
                    onClick={() => {
                        console.log("handview onclick");
                        if (onClick) onClick(new CardLocation(deck, DeckArea.Hand, index));
                    }}
                    card={card}
                />
            ))}
        </div>
    );
}
