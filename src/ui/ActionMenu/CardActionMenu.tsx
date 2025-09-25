import { useContext } from "react";
import { CardAction, DeckArea } from "../../enums";
import { UIContext } from "../UIContext";
import { HandCardActionMenu } from "./HandCardActionMenu";
import { gs } from "../../classes/Game";
import { LineCardActionMenu } from "./LineCardActionMenu";

//remember - can only be used by player
export function CardActionMenu({ onAction }: { onAction: (a: CardAction) => void }) {
    console.log("showing card action menu");
    const { selectedCard } = useContext(UIContext);
    if (!selectedCard) return <div />;
    const { owner, deckArea } = selectedCard;
    if (owner == gs.player) {
        if (deckArea == DeckArea.Line) {
            return <LineCardActionMenu card={selectedCard} onAction={onAction} />;
        }
        if (deckArea == DeckArea.Hand) {
            return <HandCardActionMenu card={selectedCard} onAction={onAction} />;
        }
    }
    return <div />;
}
