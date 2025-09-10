import { TurnAction } from "../enums";

//remember - can only be used by player
export function TurnMenu({ onAction }: { onAction: (a: TurnAction) => void }) {
    let buttons: { label: string; action: TurnAction | undefined, disabledReason?: string | undefined }[] = [];
    buttons = [
        { label: "End Turn", action: TurnAction.EndTurn },
    ];

    return (
        <div className="flex gap-2 p-2">
            {buttons.map((b) => (
                <button
                    className={
                        b.disabledReason ? "w-full px-4 py-2 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    }
                    title={b.disabledReason}
                    key={b.action}
                    disabled={!b.action || b.disabledReason !== undefined}
                    onClick={() => b.action && onAction(b.action)}
                >
                    {`${b.label}${b.disabledReason ? ' ' + b.disabledReason : ''}`}
                </button>
            ))}
        </div>
    );
};

