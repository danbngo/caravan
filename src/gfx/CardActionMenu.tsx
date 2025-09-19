import { useContext } from "react";
import { CardAction, DeckArea } from "../enums";
import { UIStateContext } from "./UIContext";
import { ActionButton, ActionButtonProps } from "./ActionButton";
import { Board } from "../classes/Board";
import { UnitCard } from "../classes/UnitCard";
import { canAttack } from "../sys/attack";
import { canSwap } from "../sys/swap";
import { canWithdraw } from "../sys/withdraw";
import { calcPlaceableLocations, canDraw } from "../sys/draw";
import { CardLocations } from "../classes/CardLocations";
import { canWait } from "../sys/wait";
import { PEOPLE } from "../defs/PEOPLE";

//remember - can only be used by player
export function CardActionMenu({ board, onAction }: { board: Board; onAction: (a: CardAction) => void }) {
    console.log("showing card action menu");
    const { selectedCardLocation } = useContext(UIStateContext);
    if (!selectedCardLocation || !selectedCardLocation.card) return <div />;
    const { person, deckArea } = selectedCardLocation;
    if (person == PEOPLE.PLAYER) {
        if (deckArea == DeckArea.Hand) {
            return <UnitCardActionMenu board={board} card={selectedCardLocation.card} onAction={onAction} />;
        }
        if (deckArea == DeckArea.Reserves) {
            return <ReserveCardActionMenu board={board} card={selectedCardLocation.card} onAction={onAction} />;
        }
    }
    return <div />;
}

export function UnitCardActionMenu({
    board,
    card,
    onAction
}: {
    board: Board;
    card: UnitCard;
    onAction: (a: CardAction) => void;
}) {
    let buttons: ActionButtonProps[] = [];

    if (!card) {
        buttons = [];
    } else if (card.tapped) {
        buttons = [
            {
                label: "No actions available",
                disabledReason: "[Tapped]",
                action: "",
                onAction: () => {}
            }
        ];
    } else if (card.waiting) {
        buttons = [
            {
                label: "Stop Waiting",
                action: CardAction.Un_Wait,
                onAction: (s: string) => onAction(s as CardAction)
            }
        ];
    } else {
        const swapEnabled = canSwap(board, card);
        const attackEnabled = canAttack(card);
        const withdrawEnabled = canWithdraw(board, card);
        const waitEnabled = canWait(card);
        const swappableLocations = board.calcTargetableLocations(card, CardAction.Swap);
        const swapDisabledReason = !swapEnabled
            ? "Can't swap"
            : swappableLocations.locations.length == 0
              ? "No valid destination"
              : undefined;
        const attackableLocations = board.calcTargetableLocations(card, CardAction.Attack);
        const attackDisabledReason = !attackEnabled
            ? "Can't attack"
            : attackableLocations.locations.length == 0
              ? "No valid targets"
              : undefined;
        const withdrawDisabledReason = !withdrawEnabled ? "Cannot withdraw" : undefined;
        const waitDisabledReason = !waitEnabled ? "Cannot wait" : undefined;
        console.log(withdrawEnabled, withdrawDisabledReason);
        buttons = [
            {
                label: "Swap",
                action: CardAction.Swap,
                disabledReason: swapDisabledReason,
                onAction: (s: string) => onAction(s as CardAction)
            },
            {
                label: "Withdraw",
                action: CardAction.Withdraw,
                disabledReason: withdrawDisabledReason,
                onAction: (s: string) => onAction(s as CardAction)
            },
            {
                label: "Attack",
                action: CardAction.Attack,
                disabledReason: attackDisabledReason,
                onAction: (s: string) => onAction(s as CardAction)
            },
            {
                label: "Wait",
                action: CardAction.Wait,
                disabledReason: waitDisabledReason,
                onAction: (s: string) => onAction(s as CardAction)
            }
        ];
    }

    console.log("card action menu:", card, buttons);

    return (
        <div className="flex gap-1 p-2">
            {buttons.map((b) => (
                <ActionButton {...b} key={b.label} />
            ))}
        </div>
    );
}

export function ReserveCardActionMenu({
    board,
    card,
    onAction
}: {
    board: Board;
    card: UnitCard;
    onAction: (a: CardAction) => void;
}) {
    let buttons: ActionButtonProps[] = [];
    if (!card) {
        buttons = [];
    } else {
        const drawEnabled = canDraw(board, card);
        const drawLocations = !card.owner ? new CardLocations([]) : calcPlaceableLocations(board, card.owner);

        const drawCardDisabledReason = !drawEnabled
            ? "Cannot draw"
            : drawLocations.locations.length <= 0
              ? "No placeable locations"
              : undefined;

        buttons = [
            {
                label: "Draw Card",
                action: CardAction.Draw,
                onAction: (s: string) => onAction(s as CardAction),
                disabledReason: drawCardDisabledReason
            }
        ];
    }

    console.log("reserve card action menu:", card, buttons);

    return (
        <div className="flex gap-1 p-2">
            {buttons.map((b) => (
                <ActionButton {...b} key={b.label} onAction={(s: string) => onAction(s as CardAction)} />
            ))}
        </div>
    );
}
