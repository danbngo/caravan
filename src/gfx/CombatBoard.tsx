import { useContext, useState } from "react";
import { UnitCard } from "../classes/UnitCard";
import { HandView } from "./HandView";
import { LineSeparator } from "./LineSeperator";
import { CardActionMenu } from "./CardActionMenu";
import { gs } from '../classes/GameState'
import { UIStateContext } from "./UIContext";
import { CardAction, DeckArea, Person, TurnAction } from "../enums";
import { CardView } from "./CardView";
import { TurnMenu } from "./TurnMenu";
import { MessagesView } from "./MessagesView";

export function CombatBoard() {
    const {
        setSelectedEnemyCardIndex,
        setSelectedPlayerCardIndex,
        selectedEnemyCardIndex,
        selectedPlayerCardIndex,
        selectedEnemyDeckArea,
        selectedPlayerDeckArea,
        setSelectedEnemyDeckArea,
        setSelectedPlayerDeckArea,
    } = useContext(UIStateContext)

    const { enemyDeck, playerDeck, messages } = gs
    const [refreshTrigger, setRefreshTrigger] = useState<number>()

    function resetCardSelection(person: Person, deckArea?: DeckArea, cardIndex?: number) {
        setSelectedEnemyCardIndex(person == Person.Enemy ? cardIndex : undefined)
        setSelectedEnemyDeckArea(person == Person.Enemy ? deckArea : undefined)
        setSelectedPlayerCardIndex(person == Person.Player ? cardIndex : undefined)
        setSelectedPlayerDeckArea(person == Person.Player ? deckArea : undefined)
    }

    function onClickEnemyCard(index: number) {
        resetCardSelection(Person.Enemy, DeckArea.Hand, index)
    }
    function onClickPlayerCard(index: number) {
        resetCardSelection(Person.Player, DeckArea.Hand, index)
    }
    function onClickEnemyGeneral() {
        resetCardSelection(Person.Enemy, DeckArea.General)
    }
    function onClickEnemyReserves() {
        resetCardSelection(Person.Enemy, DeckArea.Reserves)
    }
    function onClickEnemyGrave() {
        resetCardSelection(Person.Enemy, DeckArea.Grave)
    }
    function onClickPlayerGeneral() {
        resetCardSelection(Person.Player, DeckArea.General)
    }
    function onClickPlayerReserves() {
        resetCardSelection(Person.Player, DeckArea.Reserves)
    }
    function onClickPlayerGrave() {
        resetCardSelection(Person.Player, DeckArea.Grave)
    }

    function onClickCardAction(action: CardAction) {
        if (selectedPlayerCardIndex == undefined) return
        gs.handleAction(selectedPlayerCardIndex, action)
        onClickPlayerCard(selectedPlayerCardIndex)
        setRefreshTrigger(Math.random())
    }

    function onClickTurnAction(action: TurnAction) {
        gs.handleTurnAction(action)
        setRefreshTrigger(Math.random())
    }


    return (
        <div className="flex w-full items-center p-4">
            <MessagesView messages={messages} />
            <div className='flex-1'>
                <div className="flex w-full items-center justify-between p-4">
                    <HandView hand={enemyDeck.hand} onClick={onClickEnemyCard} selectedCardIndex={selectedEnemyDeckArea == DeckArea.Hand ? selectedEnemyCardIndex : undefined} />
                    <div className="flex flex-row gap-4 overflow-x-auto p-2">
                        <CardView card={enemyDeck.generalCard} onClick={onClickEnemyGeneral} isSelected={selectedEnemyDeckArea == DeckArea.General} />
                        <CardView card={enemyDeck.reserveStack.cards[0]} onClick={onClickEnemyReserves} isSelected={selectedEnemyDeckArea == DeckArea.Reserves} />
                        <CardView card={enemyDeck.gravePile.cards[0]} onClick={onClickEnemyGrave} isSelected={selectedEnemyDeckArea == DeckArea.Grave} />
                    </div>
                </div>

                <CombatBoardLabels />

                <div className="flex w-full items-center justify-between p-4">
                    <HandView hand={playerDeck.hand} onClick={onClickPlayerCard} selectedCardIndex={selectedPlayerDeckArea == DeckArea.Hand ? selectedPlayerCardIndex : undefined} />
                    <div className="flex flex-row gap-4 overflow-x-auto p-2">
                        <CardView card={playerDeck.generalCard} onClick={onClickPlayerGeneral} isSelected={selectedPlayerDeckArea == DeckArea.General} />
                        <CardView card={playerDeck.reserveStack.cards[0]} onClick={onClickPlayerReserves} isSelected={selectedPlayerDeckArea == DeckArea.Reserves} />
                        <CardView card={playerDeck.gravePile.cards[0]} onClick={onClickPlayerGrave} isSelected={selectedPlayerDeckArea == DeckArea.Grave} />
                    </div>
                </div>


                <LineSeparator />
                <div className="flex w-full items-center justify-between p-4">
                    {selectedPlayerCardIndex ? <CardActionMenu onAction={onClickCardAction} /> : <div />}
                    <TurnMenu onAction={onClickTurnAction} />
                </div>
            </div>
        </div>
    );
}

export function CombatBoardLabels() {
    return <div className="relative w-full h-16">
        <h4 className="absolute left-[24%] top-1/2 -translate-y-1/2 text-xl font-bold">
            Units
        </h4>

        <h4 className="absolute left-[72.5%] top-1/2 -translate-y-1/2 text-xl font-bold">
            General
        </h4>

        <h4 className="absolute left-[82%] top-1/2 -translate-y-1/2 text-xl font-bold">
            Reserves
        </h4>

        <h4 className="absolute left-[91.5%] top-1/2 -translate-y-1/2 text-xl font-bold">
            Grave
        </h4>
    </div>
}