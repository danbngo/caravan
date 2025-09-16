import { gs } from "../classes/Game";
import { Person, TurnAction } from "../enums";
import { ActionButton, ActionButtonProps } from "./ActionButton";

//remember - can only be used by player
export function TurnMenu({ onAction }: { onAction: (a: TurnAction) => void }) {
    const validMoves = gs.board.calcValidUnitMoves(Person.Player);
    console.log("remaining valid moves:", validMoves);
    let buttons: ActionButtonProps[] = [];
    buttons = [
        {
            label: "End Turn",
            action: TurnAction.EndTurn,
            disabledReason: gs.board.turn == Person.Enemy ? "[Waiting For Enemy]" : undefined,
            warningReason: validMoves.length > 0 ? "[Still Moves Remaining]" : undefined,
            onAction: (a: string) => onAction(a as TurnAction)
        }
    ];

    return (
        <div className="flex gap-2 p-2">
            {buttons.map((b) => (
                <ActionButton {...b} key={b.label} onAction={(s: string) => onAction(s as TurnAction)} />
            ))}
        </div>
    );
}
