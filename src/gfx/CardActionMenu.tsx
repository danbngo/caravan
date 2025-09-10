import { useContext } from "react";
import { gs } from "../classes/GameState";
import { CardAction } from "../enums";
import { UIStateContext } from "./UIContext";

//remember - can only be used by player
export function CardActionMenu({ onAction }: { onAction: (a: CardAction) => void }) {
    const { selectedPlayerCardIndex } = useContext(UIStateContext)

    if (selectedPlayerCardIndex == undefined) return <div />

    const drawCardDisabledReason =
        gs.playerCardDrawn ? '[Already drew from reserves this round]'
            : gs.playerDeck.reserveStack.cards.length == 0 ? '[No unit cards remaining]'
                : undefined

    let buttons: { label: string; action: CardAction | undefined, disabledReason?: string | undefined }[] = [];

    const selectedCard = gs.playerDeck.hand.cards[selectedPlayerCardIndex]

    if (!selectedCard) {
        buttons = [{ label: "Draw Card", action: CardAction.Draw, disabledReason: drawCardDisabledReason }];
    } else if (selectedCard.tapped) {
        buttons = [{ label: "No actions available", disabledReason: '[Tapped]', action: undefined }];
    } else {
        buttons = [
            { label: "Move", action: CardAction.Move },
            { label: "Retreat", action: CardAction.Retreat },
            { label: "Attack", action: CardAction.Attack },
        ];
    }

    console.log('card action menu:', selectedCard, selectedPlayerCardIndex, buttons)

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

