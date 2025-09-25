import { useContext } from "react";
import { CardView } from "../CardView/CardView";
import { CombatBoardPersonPanel } from "./CombatBoardPersonPanel";
import { UIContext } from "../UIContext";
import { DeckArea } from "../../enums";
import { Deck } from "../../classes/Deck";
import { LineView } from "../CardView/LineView";
import { CardClickHandler, LocationClickHandler } from "../Common/types";

export function CombatBoardPersonSection({
    deck,
    onClickCard,
    onClickLocation
}: {
    deck: Deck;
    onClickCard: CardClickHandler;
    onClickLocation: LocationClickHandler;
}) {
    const { selectedCard, targetCardLocations } = useContext(UIContext);

    const { owner } = deck;

    return (
        <div className="flex w-full items-center justify-between p-4">
            <CombatBoardPersonPanel deck={deck} person={deck.owner} />
            <LineView
                deck={deck}
                cards={deck.line.cards}
                onClickCard={onClickCard}
                onClickLocation={onClickLocation}
                selectedCardIndex={
                    selectedCard?.owner == owner && selectedCard?.deckArea == DeckArea.Line ? selectedCard.index : undefined
                }
                targetCardLocations={targetCardLocations}
            />
            <CardView
                card={deck.general}
                onClickCard={onClickCard}
                isSelected={selectedCard?.owner == owner && selectedCard?.deckArea == DeckArea.General}
                isTargeted={targetCardLocations?.hasIndex(deck, DeckArea.General)}
            />
        </div>
    );
}
