import { CardLocations } from "../../classes/CardLocations";
import { UnitCard } from "../../classes/UnitCard";
import { CardAction } from "../../enums";
import { PlacementSystem } from "../../systems/PlacementSystem";
import { ActionButton, ActionButtonProps } from "../Common/ActionButton";

export function HandCardActionMenu({ card, onAction }: { card: UnitCard; onAction: (a: CardAction) => void }) {
    let buttons: ActionButtonProps[] = [];
    if (!card) {
        buttons = [];
    } else {
        const placeEnabled = PlacementSystem.canPlace(card);
        const placeLocations = !card.owner ? new CardLocations([]) : PlacementSystem.calcPlaceableLocations(card.owner);

        const placeCardDisabledReason = !placeEnabled
            ? "Cannot place"
            : placeLocations.locations.length <= 0
              ? "No placeable locations"
              : undefined;

        buttons = [
            {
                label: "Place Card",
                action: CardAction.Place,
                onAction: (s: string) => onAction(s as CardAction),
                disabledReason: placeCardDisabledReason
            }
        ];
    }

    return (
        <div className="flex gap-1 p-2">
            {buttons.map((b) => (
                <ActionButton {...b} key={b.label} onAction={(s: string) => onAction(s as CardAction)} />
            ))}
        </div>
    );
}
