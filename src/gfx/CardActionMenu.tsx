import { useContext } from "react";
import { CardAction, DeckArea, Person } from "../enums";
import { UIStateContext } from "./UIContext";
import { ActionButton } from "./ActionButton";
import { gs } from "../classes/Game";

//remember - can only be used by player
export function CardActionMenu({
    onAction,
}: {
    onAction: (a: CardAction) => void;
}) {
    const { selectedCardIndices } = useContext(UIStateContext);
    const selectedCardIndex = selectedCardIndices.getFirstIndex(
        Person.Player,
        DeckArea.Hand,
    );

    if (selectedCardIndex == undefined) return <div />;

    const drawCardDisabledReason = gs.board.playerCardDrawn
        ? "[Already drew from reserves this round]"
        : gs.board.playerDeck.reserveStack.cards.length == 0
          ? "[No unit cards remaining]"
          : undefined;

    let buttons: {
        label: string;
        action: string;
        disabledReason?: string | undefined;
    }[] = [];

    const selectedCard = gs.board.playerDeck.hand.cards[selectedCardIndex];

    if (!selectedCard) {
        buttons = [
            {
                label: "Draw Card",
                action: CardAction.Draw,
                disabledReason: drawCardDisabledReason,
            },
        ];
    } else if (selectedCard.tapped) {
        buttons = [
            {
                label: "No actions available",
                disabledReason: "[Tapped]",
                action: "",
            },
        ];
    } else {
        buttons = [
            { label: "Move", action: CardAction.Move },
            { label: "Retreat", action: CardAction.Retreat },
            { label: "Attack", action: CardAction.Attack },
        ];
    }

    console.log("card action menu:", selectedCard, buttons);

    return (
        <div className="flex gap-2 p-2">
            {buttons.map((b) => (
                <ActionButton
                    {...b}
                    onAction={(s: string) => onAction(s as CardAction)}
                />
            ))}
        </div>
    );
}
