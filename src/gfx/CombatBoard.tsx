import { useContext, useRef, useState } from "react";
import { HandView } from "./HandView";
import { LineSeparator } from "./LineSeperator";
import { CardActionMenu } from "./CardActionMenu";
import { UIStateContext } from "./UIContext";
import { CardAction, DeckArea, Person, TurnAction } from "../enums";
import { CardView } from "./CardView";
import { TurnMenu } from "./TurnMenu";
import { MessagesView } from "./MessagesView";
import { gs } from "../classes/Game";

type OnActClickHandler = (person: Person, deckArea: DeckArea, index?: number | undefined) => void

export function CombatBoard() {
    const {
        selectedCardIndices,
        targetableCardIndices,
        targetingAction,
        setTargetingAction
    } = useContext(UIStateContext)

    const { enemyDeck, playerDeck, messages, turn } = gs.board
    const [refreshTrigger, setRefreshTrigger] = useState<number>()
    const onActClickHandlerRef = useRef<OnActClickHandler | undefined>(undefined)

    //console.log('combat board re-render:', gs, enemyDeck, playerDeck, messages, turn)

    function onClickCard(person: Person, deckArea: DeckArea, index?: number) {
        console.log('combat board: card clicked', person, deckArea, index)
        if (onActClickHandlerRef.current) onActClickHandlerRef.current(person, deckArea, index)
        else selectedCardIndices.setIndices(person, deckArea, [index || 0])
        setRefreshTrigger(Math.random())
    }

    function onClickCardAction(action: CardAction) {
        console.log('combat board: card action clicked:', action)
        //const selectedPlayerCardIndex = selectedCardIndices.getFirstIndex(Person.Player, DeckArea.Hand)
        //if (selectedPlayerCardIndex == undefined) return
        //need logic for all targetable abilities
        if (action == CardAction.Move || action == CardAction.Attack) {
            setTargetingAction(action)
            onActClickHandlerRef.current = (p, d, i) => {
                if (targetableCardIndices.hasIndex(p, d, i || 0)) {
                    gs.board.processCardAction(action, selectedCardIndices)
                    onActClickHandlerRef.current = undefined
                }
            }
        }
        else gs.board.processCardAction(action, selectedCardIndices)
        //reselect the acting card
        onClickCard(Person.Player, DeckArea.Hand, selectedCardIndices.getFirstIndex(Person.Player, DeckArea.Hand))
        setRefreshTrigger(Math.random())
    }

    function onClickTurnAction(action: TurnAction) {
        gs.board.processTurnAction(action)
        if (action == TurnAction.EndTurn) {
            gs.handleEnemyTurn(async () => {
                setRefreshTrigger(Math.random())
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(undefined)
                    }, 1000)
                })
            })
        }
        setRefreshTrigger(Math.random())
    }

    return (
        <div className="flex w-full items-center p-4">
            <div className='w-[75px]'><MessagesView messages={messages} /></div>
            <div className='flex-1'>
                <div className="flex w-full items-center justify-between p-4">
                    <HandView hand={enemyDeck.hand} onClick={(i) => onClickCard(Person.Enemy, DeckArea.Hand, i)} selectedCardIndex={selectedCardIndices.getFirstIndex(Person.Enemy, DeckArea.Hand)} />
                    <div className="flex flex-row gap-4 overflow-x-auto p-2">
                        <CardView
                            card={enemyDeck.generalCard}
                            onClick={(i) => onClickCard(Person.Enemy, DeckArea.General)}
                            isSelected={selectedCardIndices.hasAnyIndices(Person.Enemy, DeckArea.General)}
                        />
                        <CardView card={enemyDeck.reserveStack.cards[0]} onClick={(i) => onClickCard(Person.Enemy, DeckArea.Reserves)} isSelected={selectedCardIndices.hasAnyIndices(Person.Enemy, DeckArea.Reserves)} />
                        <CardView card={enemyDeck.gravePile.cards[0]} onClick={(i) => onClickCard(Person.Enemy, DeckArea.Grave)} isSelected={selectedCardIndices.hasAnyIndices(Person.Enemy, DeckArea.Hand)} />
                    </div>
                </div>
                <CombatBoardLabels />
                <div className="flex w-full items-center justify-between p-4">
                    <HandView hand={playerDeck.hand} onClick={(i) => onClickCard(Person.Player, DeckArea.Hand, i)} selectedCardIndex={selectedCardIndices.getFirstIndex(Person.Player, DeckArea.Hand)} />
                    <div className="flex flex-row gap-4 overflow-x-auto p-2">
                        <CardView card={playerDeck.generalCard} onClick={(i) => onClickCard(Person.Player, DeckArea.General)} isSelected={selectedCardIndices.hasAnyIndices(Person.Player, DeckArea.General)} />
                        <CardView card={playerDeck.reserveStack.cards[0]} onClick={(i) => onClickCard(Person.Player, DeckArea.Reserves)} isSelected={selectedCardIndices.hasAnyIndices(Person.Player, DeckArea.Reserves)} />
                        <CardView card={playerDeck.gravePile.cards[0]} onClick={(i) => onClickCard(Person.Player, DeckArea.Grave)} isSelected={selectedCardIndices.hasAnyIndices(Person.Player, DeckArea.Hand)} />
                    </div>
                </div>
                <LineSeparator />
                <div className="flex w-full items-center justify-between p-4">
                    {targetingAction && turn == Person.Player ? <div>{`${targetingAction}: Choose target`}</div>
                        : selectedCardIndices.hasAnyIndices(Person.Player, DeckArea.Hand) && turn == Person.Player ? <CardActionMenu onAction={onClickCardAction} /> : <div />}
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