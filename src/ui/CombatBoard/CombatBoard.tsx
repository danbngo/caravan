import { useContext, useEffect, useRef, useState } from "react";
import { LineSeparator } from "../Common/LineSeperator";
import { UIContext } from "../UIContext";
import { CardAction } from "../../enums";
import { MessagesView } from "./MessagesView";
import { gs } from "../../classes/Game";
import { Move } from "../../classes/Move";
import { CardLocation } from "../../classes/CardLocation";
import { CombatBoardHandSection } from "./CombatBoardHandSection";
import { OnActClickHandler } from "../Common/types";
import { CombatBoardMenuSection } from "./CombatBoardMenuSection";
import { CombatBoardPersonSection } from "./CombatBoardPersonSection";
import { UnitCard } from "../../classes/UnitCard";

export function CombatBoard() {
    const { setTargetingAction, setSelectedCard, setTargetCardLocations, targetingAction, targetCardLocations, selectedCard } =
        useContext(UIContext);

    const { enemy, player } = gs;
    const [refreshTrigger, setRefreshTrigger] = useState<number>();
    const onActClickHandlerRef = useRef<OnActClickHandler | undefined>(undefined);

    console.log(refreshTrigger);

    function onClick(item: UnitCard | CardLocation) {
        const location = item instanceof UnitCard ? item.location : item;
        if (!location) return;
        const { deck, deckArea, index } = location;
        console.log("combat board: card clicked", deck, deckArea, index);
        if (onActClickHandlerRef.current) onActClickHandlerRef.current(deck, deckArea, index);
        else if (item instanceof UnitCard) setSelectedCard(item);
        setRefreshTrigger(Math.random());
    }

    function startTargetingCardAction() {
        onActClickHandlerRef.current = (deck, deckArea, index) => {
            if (!targetCardLocations || !targetingAction || !selectedCard) return;
            if (!targetCardLocations.hasIndex(deck, deckArea, index || 0)) return;
            const move: Move = new Move(targetingAction, selectedCard, new CardLocation(deck, deckArea, index || 0));
            gs.board.processMove(move);
            onActClickHandlerRef.current = undefined;
            setTargetCardLocations();
            setTargetingAction();
            //edge case logic. think about fixing this later.
            if (move.action == CardAction.Swap) {
                setSelectedCard(move.card);
            }
        };
    }

    useEffect(() => {
        if (selectedCard && selectedCard && targetingAction) startTargetingCardAction();
    }, [targetingAction, targetCardLocations]);

    return (
        <div className="flex w-full p-4">
            <div className="w-[200px]">
                <MessagesView messages={gs.messages} />
            </div>
            <div className="flex-1">
                <CombatBoardPersonSection deck={enemy.deck} onClickCard={onClick} onClickLocation={onClick} />
                <LineSeparator />
                <CombatBoardPersonSection deck={player.deck} onClickCard={onClick} onClickLocation={onClick} />
                <LineSeparator />
                <CombatBoardHandSection deck={player.deck} onClickCard={onClick} />
                <LineSeparator />
                <CombatBoardMenuSection onClickCard={onClick} forceRefresh={() => setRefreshTrigger(Math.random())} />
            </div>
        </div>
    );
}
