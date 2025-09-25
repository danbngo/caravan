import { CardLocations } from "../../classes/CardLocations";
import { Deck } from "../../classes/Deck";
import { UnitCard } from "../../classes/UnitCard";
import { DeckArea } from "../../enums";
import { CardView } from "./CardView";
import { CardClickHandler } from "../Common/types";

export function HandView({
    deck,
    cards,
    onClickCard,
    selectedCardIndex,
    targetCardLocations
}: {
    deck?: Deck;
    cards: (UnitCard | undefined)[];
    onClickCard?: CardClickHandler | undefined;
    selectedCardIndex?: number | undefined;
    targetCardLocations?: CardLocations | undefined;
}) {
    return (
        <div className="flex flex-row gap-4 p-2">
            {cards.map((card, index) => (
                <CardView
                    key={index}
                    isSelected={selectedCardIndex == index}
                    isTargeted={deck && targetCardLocations?.hasIndex(deck, DeckArea.Hand, index)}
                    onClickCard={() => {
                        console.log("handview onclick");
                        if (card && onClickCard) onClickCard(card);
                    }}
                    card={card}
                />
            ))}
        </div>
    );
}
