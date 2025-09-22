import { useContext } from "react";
import { CardLocation } from "../../classes/CardLocation";
import { UIStateContext } from "../Common/UIContext";
import { DeckArea } from "../../enums";
import { Deck } from "../../classes/Deck";
import { HandView } from "../CardView/HandView";

export function CombatBoardHandSection({ deck, onClickCard }: { deck: Deck; onClickCard: (cl: CardLocation) => void }) {
    const { selectedCardLocation, targetCardLocations } = useContext(UIStateContext);

    const { owner } = deck;

    return (
        <div className="flex w-full items-center justify-between p-4">
            <div className="w-24">
                <div className="text-lg font-bold text-gray-800">Hand</div>
            </div>
            <HandView
                deck={deck}
                cards={deck.hand.cards}
                onClick={(i) => i && onClickCard(i)}
                selectedCardIndex={
                    selectedCardLocation?.deck.owner == owner && selectedCardLocation?.deckArea == DeckArea.Hand
                        ? selectedCardLocation.index
                        : undefined
                }
                targetCardLocations={targetCardLocations}
            />
        </div>
    );
}
