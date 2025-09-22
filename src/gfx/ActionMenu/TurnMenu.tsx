import { gs } from "../../classes/Game";
import { TurnAction } from "../../enums";
import { DrawSystem } from "../../systems/DrawSystem";
import { ActionButton, ActionButtonProps } from "../Common/ActionButton";

//remember - can only be used by player
export function TurnMenu({ onAction }: { onAction: (a: TurnAction) => void }) {
    const { player, board, enemy } = gs;
    console.log("turn menu started");
    const validLineMoves = board.calcValidLineMoves(player);
    const validHandMoves = board.calcValidHandMoves(player);
    const validMoves = [...validLineMoves, ...validHandMoves];
    console.log("valid moves remaning:", validMoves);
    let buttons: ActionButtonProps[] = [];
    buttons = [
        {
            label: "Redraw",
            action: TurnAction.Redraw,
            disabledReason: !DrawSystem.canRedraw(player) ? "[Cannot Redraw]" : undefined,
            onAction: (a: string) => onAction(a as TurnAction)
        },
        {
            label: "End Turn",
            action: TurnAction.EndTurn,
            disabledReason: board.turn == enemy ? "[Waiting For Enemy]" : undefined,
            warningReason: validMoves.length > 0 ? "[Still Moves Remaining]" : undefined,
            onAction: (a: string) => onAction(a as TurnAction)
        }
    ];

    return (
        <div className="flex gap-1 p-2">
            {buttons.map((b) => (
                <ActionButton {...b} key={b.label} onAction={(s: string) => onAction(s as TurnAction)} />
            ))}
        </div>
    );
}
