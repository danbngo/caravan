import { Board } from "../classes/Board";
import { CardLocation } from "../classes/CardLocation";
import { CardLocations } from "../classes/CardLocations";
import { Deck } from "../classes/Deck";
import { DeckArea } from "../enums";
import { CardView } from "./CardView";
import { CardClickHandler } from "./interfaces";

export function HandView({
    board,
    deck,
    onClick,
    selectedCardIndex,
    targetCardLocations
}: {
    board: Board;
    deck: Deck;
    onClick?: CardClickHandler | undefined;
    selectedCardIndex?: number | undefined;
    targetCardLocations?: CardLocations | undefined;
}) {
    const { hand } = deck;
    return (
        <div className="flex flex-row gap-4 p-2">
            {hand.cards.map((card, index) => (
                <CardView
                    board={board}
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
