import { gs } from "../classes/Game";
import { Person, TurnAction } from "../enums";
import { ActionButton } from "./ActionButton";

//remember - can only be used by player
export function TurnMenu({ onAction }: { onAction: (a: TurnAction) => void }) {
    let buttons: { label: string; action: string, disabledReason?: string | undefined }[] = [];
    buttons = [
        { label: "End Turn", action: TurnAction.EndTurn, disabledReason: gs.board.turn == Person.Enemy ? '[Waiting For Enemy]' : undefined },
    ];

    return (
        <div className="flex gap-2 p-2">
            {buttons.map(b => <ActionButton {...b} onAction={(s: string) => onAction(s as TurnAction)} />)}
        </div>
    );
};

