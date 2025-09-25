import { gs } from "../../classes/Game";
import { UnitCard } from "../../classes/UnitCard";
import { CardAction } from "../../enums";
import { AttackSystem } from "../../systems/AttackSystem";
import { SwapSystem } from "../../systems/SwapSystem";
import { WaitSystem } from "../../systems/WaitSystem";
import { WithdrawSystem } from "../../systems/WithdrawSystem";
import { ActionButton, ActionButtonProps } from "../Common/ActionButton";

export function LineCardActionMenu({ card, onAction }: { card: UnitCard; onAction: (a: CardAction) => void }) {
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
        const swapEnabled = SwapSystem.canSwap(card);
        const attackEnabled = AttackSystem.canAttack(card);
        const withdrawEnabled = WithdrawSystem.canWithdraw(card);
        const waitEnabled = WaitSystem.canWait(card);
        const swappableLocations = gs.board.calcTargetableLocations(card, CardAction.Swap);
        const swapDisabledReason = !swapEnabled
            ? "Can't swap"
            : swappableLocations.locations.length == 0
              ? "No valid destination"
              : undefined;
        const attackableLocations = gs.board.calcTargetableLocations(card, CardAction.Attack);
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
