import { useContext, useEffect, useRef, useState } from "react";
import { LineSeparator } from "../Common/LineSeperator";
import { UIStateContext } from "../Common/UIContext";
import { CardAction } from "../../enums";
import { MessagesView } from "./MessagesView";
import { gs } from "../../classes/Game";
import { Move } from "../../classes/Move";
import { CardLocation } from "../../classes/CardLocation";
import { CombatBoardHandSection } from "./CombatBoardHandSection";
import { OnActClickHandler } from "../Common/types";
import { CombatBoardMenuSection } from "./CombatBoardMenuSection";
import { CombatBoardPersonSection } from "./CombatBoardPersonSection";

export function CombatBoard() {
    const {
        setTargetingAction,
        setSelectedCardLocation,
        setTargetCardLocations,
        targetingAction,
        targetCardLocations,
        selectedCardLocation
    } = useContext(UIStateContext);

    const { enemy, player } = gs;
    const [refreshTrigger, setRefreshTrigger] = useState<number>();
    const onActClickHandlerRef = useRef<OnActClickHandler | undefined>(undefined);

    console.log(refreshTrigger);

    function onClickCard(cardLocation: CardLocation) {
        const { deck, deckArea, index } = cardLocation;
        console.log("combat board: card clicked", deck, deckArea, index);
        if (onActClickHandlerRef.current) onActClickHandlerRef.current(deck, deckArea, index);
        else setSelectedCardLocation(new CardLocation(deck, deckArea, index || 0));
        setRefreshTrigger(Math.random());
    }

    function startTargetingCardAction() {
        onActClickHandlerRef.current = (deck, deckArea, index) => {
            if (!targetCardLocations || !targetingAction || !selectedCardLocation || !selectedCardLocation.card) return;
            if (!targetCardLocations.hasIndex(deck, deckArea, index || 0)) return;
            const move: Move = new Move(targetingAction, selectedCardLocation.card, new CardLocation(deck, deckArea, index || 0));
            gs.board.processMove(move);
            onActClickHandlerRef.current = undefined;
            setTargetCardLocations();
            setTargetingAction();
            //edge case logic. think about fixing this later.
            if (move.action == CardAction.Swap) {
                setSelectedCardLocation(move.targetLocation);
            }
        };
    }

    useEffect(() => {
        if (selectedCardLocation && selectedCardLocation.card && targetingAction) startTargetingCardAction();
    }, [targetingAction, targetCardLocations]);

    return (
        <div className="flex w-full p-4">
            <div className="w-[200px]">
                <MessagesView messages={gs.messages} />
            </div>
            <div className="flex-1">
                <CombatBoardPersonSection deck={enemy.deck} onClickCard={onClickCard} />
                <LineSeparator />
                <CombatBoardPersonSection deck={player.deck} onClickCard={onClickCard} />
                <LineSeparator />
                <CombatBoardHandSection deck={player.deck} onClickCard={onClickCard} />
                <LineSeparator />
                <CombatBoardMenuSection onClickCard={onClickCard} forceRefresh={() => setRefreshTrigger(Math.random())} />
            </div>
        </div>
    );
}
