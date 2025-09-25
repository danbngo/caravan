import { CardActionMenu } from "../ActionMenu/CardActionMenu";
import { TurnMenu } from "../ActionMenu/TurnMenu";
import { useContext } from "react";
import { UIContext } from "../UIContext";
import { CardAction, TurnAction } from "../../enums";
import { gs } from "../../classes/Game";
import { Move } from "../../classes/Move";
import { TargetingMenu } from "../ActionMenu/TargetingMenu";
import { CardClickHandler } from "../Common/types";

export function CombatBoardMenuSection({
    onClickCard,
    forceRefresh
}: {
    onClickCard: CardClickHandler;
    forceRefresh: () => void;
}) {
    const { selectedCard, targetingAction, setTargetingAction, setTargetCardLocations } = useContext(UIContext);
    const { turn } = gs.board;

    function onClickCardAction(action: CardAction) {
        console.log("combat board: card action clicked:", action);
        if (!selectedCard) return;

        if (action == CardAction.Swap || action == CardAction.Attack || action == CardAction.Place) {
            setTargetingAction(action);
            const _targetCardLocations = gs.board.calcTargetableLocations(selectedCard, action);
            console.log("setting target card locations:", _targetCardLocations);
            setTargetCardLocations(_targetCardLocations);
        } else gs.board.processMove(new Move(action, selectedCard));
        //reselect the acting card
        onClickCard(selectedCard);
        //setRefreshTrigger(Math.random());
        forceRefresh();
    }

    function onClickTurnAction(action: TurnAction) {
        gs.board.processTurnAction(gs.player, action);
        if (action == TurnAction.EndTurn) {
            gs.board.handleEnemyTurn(async () => {
                //setRefreshTrigger(Math.random());
                forceRefresh();
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(undefined);
                    }, 1000);
                });
            });
        }
        forceRefresh();
        //setRefreshTrigger(Math.random());
    }

    if (targetingAction && turn == gs.player) {
        return <TargetingMenu />;
    } else if (selectedCard?.owner == gs.player && turn == gs.player) {
        return (
            <div className="flex w-full items-center justify-between p-4">
                <CardActionMenu onAction={onClickCardAction} />
                <TurnMenu onAction={onClickTurnAction} />
            </div>
        );
    } else return <div />;
}
