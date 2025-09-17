import { useContext } from "react";
import { CardAction, DeckArea, Person } from "../enums";
import { UIStateContext } from "./UIContext";
import { ActionButton } from "./ActionButton";
import { gs } from "../classes/Game";
import { Board } from "../classes/Board";
import { CardLocation } from "../classes/CardLocation";
import { canWithdraw } from "../sys/withdraw";

//remember - can only be used by player
export function CardActionMenu({ board, onAction }: { board: Board; onAction: (a: CardAction) => void }) {
    const { selectedCardLocation } = useContext(UIStateContext);
    if (!selectedCardLocation) return <div />;
    const { person, deckArea, index } = selectedCardLocation;
    if (person == Person.Player && deckArea == DeckArea.Hand && index !== undefined) {
        return <UnitCardActionMenu board={board} selectedCardLocation={selectedCardLocation} onAction={onAction} />;
    }
    return <div />;
}

export function UnitCardActionMenu({
    board,
    selectedCardLocation,
    onAction
}: {
    board: Board;
    selectedCardLocation: CardLocation;
    onAction: (a: CardAction) => void;
}) {
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

    const { card } = selectedCardLocation;
    console.log("selectedCardLocation:", selectedCardLocation, card);

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
        const swappableLocations = board.calcTargetableLocations(selectedCardLocation, CardAction.Swap);
        const swapDisabledReason = swappableLocations.locations.length == 0 ? "Cannot move" : undefined;
        const attackableLocations = board.calcTargetableLocations(selectedCardLocation, CardAction.Attack);
        const attackDisabledReason = attackableLocations.locations.length == 0 ? "Cannot attack" : undefined;
        const withdrawEnabled = canWithdraw(board.calcTargetingProps(selectedCardLocation));
        const withdrawDisabledReason = !withdrawEnabled ? undefined : "Cannot withdraw";
        buttons = [
            { label: "Swap", action: CardAction.Swap, disabledReason: swapDisabledReason },
            { label: "Withdraw", action: CardAction.Withdraw, disabledReason: withdrawDisabledReason },
            { label: "Attack", action: CardAction.Attack, disabledReason: attackDisabledReason }
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
