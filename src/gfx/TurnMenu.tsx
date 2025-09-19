import { gs } from "../classes/Game";
import { PEOPLE } from "../defs/PEOPLE";
import { TurnAction } from "../enums";
import { ActionButton, ActionButtonProps } from "./ActionButton";

//remember - can only be used by player
export function TurnMenu({ onAction }: { onAction: (a: TurnAction) => void }) {
    console.log("turn menu started");
    const validHandMoves = gs.board.calcValidHandMoves(PEOPLE.PLAYER);
    const validReserveMoves = gs.board.calcValidReserveMoves(PEOPLE.PLAYER);
    const validMoves = [...validHandMoves, ...validReserveMoves];
    console.log("valid moves remaning:", validMoves);
    let buttons: ActionButtonProps[] = [];
    buttons = [
        {
            label: "End Turn",
            action: TurnAction.EndTurn,
            disabledReason: gs.board.turn == PEOPLE.ENEMY ? "[Waiting For Enemy]" : undefined,
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
