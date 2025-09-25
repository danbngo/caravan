import { useContext } from "react";
import { UIContext } from "../UIContext";
import { DeckArea } from "../../enums";
import { Deck } from "../../classes/Deck";
import { HandView } from "../CardView/HandView";
import { CardClickHandler } from "../Common/types";

export function CombatBoardHandSection({ deck, onClickCard }: { deck: Deck; onClickCard: CardClickHandler }) {
    const { selectedCard, targetCardLocations } = useContext(UIContext);

    const { owner } = deck;

    return (
        <div className="flex w-full items-center justify-between p-4">
            <div className="w-24">
                <div className="text-lg font-bold text-gray-800">Hand</div>
            </div>
            <HandView
                deck={deck}
                cards={deck.hand.cards}
                onClickCard={onClickCard}
                selectedCardIndex={
                    selectedCard?.owner == owner && selectedCard?.deckArea == DeckArea.Hand ? selectedCard.index : undefined
                }
                targetCardLocations={targetCardLocations}
            />
        </div>
    );
}
