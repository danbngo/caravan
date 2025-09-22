import { useContext } from "react";
import { CardLocation } from "../../classes/CardLocation";
import { CardView } from "../CardView/CardView";
import { CombatBoardPersonPanel } from "./CombatBoardPersonPanel";
import { UIStateContext } from "../Common/UIContext";
import { DeckArea } from "../../enums";
import { Deck } from "../../classes/Deck";
import { LineView } from "../CardView/LineView";

export function CombatBoardPersonSection({ deck, onClickCard }: { deck: Deck; onClickCard: (cl: CardLocation) => void }) {
    const { selectedCardLocation, targetCardLocations } = useContext(UIStateContext);

    const { owner } = deck;

    return (
        <div className="flex w-full items-center justify-between p-4">
            <CombatBoardPersonPanel deck={deck} person={deck.owner} />
            <LineView
                deck={deck}
                cards={deck.line.cards}
                onClick={(i) => i && onClickCard(i)}
                selectedCardIndex={
                    selectedCardLocation?.deck.owner == owner && selectedCardLocation?.deckArea == DeckArea.Line
                        ? selectedCardLocation.index
                        : undefined
                }
                targetCardLocations={targetCardLocations}
            />
            <CardView
                card={deck.general}
                onClick={() => onClickCard(new CardLocation(deck, DeckArea.General))}
                isSelected={selectedCardLocation?.deck.owner == owner && selectedCardLocation?.deckArea == DeckArea.General}
                isTargeted={targetCardLocations?.hasIndex(deck, DeckArea.General)}
            />
        </div>
    );
}
