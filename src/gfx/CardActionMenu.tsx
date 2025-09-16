import { useContext } from "react";
import { CardAction, DeckArea, Person } from "../enums";
import { UIStateContext } from "./UIContext";
import { ActionButton } from "./ActionButton";
import { gs } from "../classes/Game";
import { UnitCard } from "../classes/UnitCard";

//remember - can only be used by player
export function CardActionMenu({ onAction }: { onAction: (a: CardAction) => void }) {
    const { selectedCardLocation } = useContext(UIStateContext);
    if (!selectedCardLocation) return <div />;
    const { person, deckArea, index } = selectedCardLocation;
    if (person == Person.Player && deckArea == DeckArea.Hand && index) {
        const selectedCard = gs.board.playerDeck.hand.cards[index];
        return <UnitCardActionMenu card={selectedCard} onAction={onAction} />;
    }
    return <div />;
}

export function UnitCardActionMenu({ card, onAction }: { card?: UnitCard | undefined; onAction: (a: CardAction) => void }) {
    const drawCardDisabledReason = gs.board.playerCardDrawn
        ? "[No draws remaining]"
        : gs.board.playerDeck.reserveStack.cards.length == 0
          ? "[No unit cards remaining]"
          : undefined;

    let buttons: {
        label: string;
        action: string;
        disabledReason?: string | undefined;
    }[] = [];

    if (!card) {
        buttons = [
            {
                label: "Draw Card",
                action: CardAction.Draw,
                disabledReason: drawCardDisabledReason
            }
        ];
    } else if (card.tapped) {
        buttons = [
            {
                label: "No actions available",
                disabledReason: "[Tapped]",
                action: ""
            }
        ];
    } else {
        buttons = [
            { label: "Swap", action: CardAction.Swap },
            { label: "Retreat", action: CardAction.Retreat },
            { label: "Attack", action: CardAction.Attack }
        ];
    }

    console.log("card action menu:", card, buttons);

    return (
        <div className="flex gap-2 p-2">
            {buttons.map((b) => (
                <ActionButton {...b} key={b.label} onAction={(s: string) => onAction(s as CardAction)} />
            ))}
        </div>
    );
}
