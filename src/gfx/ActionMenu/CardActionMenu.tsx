import { useContext } from "react";
import { CardAction, DeckArea } from "../../enums";
import { UIStateContext } from "../Common/UIContext";
import { HandCardActionMenu } from "./HandCardActionMenu";
import { gs } from "../../classes/Game";
import { LineCardActionMenu } from "./LineCardActionMenu";

//remember - can only be used by player
export function CardActionMenu({ onAction }: { onAction: (a: CardAction) => void }) {
    console.log("showing card action menu");
    const { selectedCardLocation } = useContext(UIStateContext);
    if (!selectedCardLocation || !selectedCardLocation.card) return <div />;
    const { person, deckArea } = selectedCardLocation;
    if (person == gs.player) {
        if (deckArea == DeckArea.Line) {
            return <LineCardActionMenu card={selectedCardLocation.card} onAction={onAction} />;
        }
        if (deckArea == DeckArea.Hand) {
            return <HandCardActionMenu card={selectedCardLocation.card} onAction={onAction} />;
        }
    }
    return <div />;
}
