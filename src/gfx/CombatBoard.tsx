import { useContext, useRef, useState } from "react";
import { HandView } from "./HandView";
import { LineSeparator } from "./LineSeperator";
import { CardActionMenu } from "./CardActionMenu";
import { UIStateContext } from "./UIContext";
import { CardAction, DeckArea, TurnAction } from "../enums";
import { CardView } from "./CardView";
import { TurnMenu } from "./TurnMenu";
import { MessagesView } from "./MessagesView";
import { gs } from "../classes/Game";
import { Move } from "../classes/Move";
import { CardLocation } from "../classes/CardLocation";
import { Deck } from "../classes/Deck";
import { ActionButton } from "./ActionButton";
import { PEOPLE } from "../defs/PEOPLE";
import { Person } from "../classes/Person";

type OnActClickHandler = (deck: Deck, deckArea: DeckArea, index?: number | undefined) => void;

export function CombatBoard() {
    const {
        selectedCardLocation,
        targetCardLocations,
        targetingAction,
        setTargetingAction,
        setSelectedCardLocation,
        setTargetCardLocations
    } = useContext(UIStateContext);

    const { enemyDeck, playerDeck, messages, turn } = gs.board;
    const [refreshTrigger, setRefreshTrigger] = useState<number>();
    const onActClickHandlerRef = useRef<OnActClickHandler | undefined>(undefined);

    console.log(
        "combat board re-render:",
        refreshTrigger,
        gs,
        enemyDeck,
        playerDeck,
        messages,
        turn,
        selectedCardLocation,
        targetCardLocations
    );

    function onClickCard(cardLocation: CardLocation) {
        const { deck, deckArea, index } = cardLocation;
        console.log("combat board: card clicked", deck, deckArea, index);
        if (onActClickHandlerRef.current) onActClickHandlerRef.current(deck, deckArea, index);
        else setSelectedCardLocation(new CardLocation(deck, deckArea, index || 0));
        setRefreshTrigger(Math.random());
    }

    function onClickCardAction(action: CardAction) {
        console.log("combat board: card action clicked:", action);
        if (!selectedCardLocation || !selectedCardLocation.card) return;
        const { card } = selectedCardLocation;

        if (action == CardAction.Swap || action == CardAction.Attack || action == CardAction.Draw) {
            setTargetingAction(action);
            const _targetCardLocations = gs.board.calcTargetableLocations(card, action);
            console.log("setting target card locations:", _targetCardLocations);
            setTargetCardLocations(_targetCardLocations);
            onActClickHandlerRef.current = (deck, deckArea, index) => {
                if (!_targetCardLocations.hasIndex(deck, deckArea, index || 0)) return;
                const move: Move = new Move(action, card, new CardLocation(deck, deckArea, index || 0));
                gs.board.processMove(move);
                onActClickHandlerRef.current = undefined;
                setTargetCardLocations();
                setTargetingAction();
                //edge case logic. think about fixing this later.
                if (move.action == CardAction.Swap) {
                    setSelectedCardLocation(move.targetLocation);
                }
            };
        } else gs.board.processMove(new Move(action, card));
        //reselect the acting card
        onClickCard(selectedCardLocation);
        setRefreshTrigger(Math.random());
    }

    function onClickTurnAction(action: TurnAction) {
        gs.board.processTurnAction(action);
        if (action == TurnAction.EndTurn) {
            gs.handleEnemyTurn(async () => {
                setRefreshTrigger(Math.random());
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(undefined);
                    }, 1000);
                });
            });
        }
        setRefreshTrigger(Math.random());
    }

    return (
        <div className="flex w-full p-4">
            <div className="w-[200px]">
                <MessagesView messages={messages} />
            </div>
            <div className="flex-1">
                <CombatBoardPersonSection deck={enemyDeck} onClickCard={onClickCard} />
                <CombatBoardPersonSection deck={playerDeck} onClickCard={onClickCard} />
                <LineSeparator />
                <div className="flex w-full items-center justify-between p-4">
                    {targetingAction && turn == PEOPLE.PLAYER ? (
                        <div>{`${targetingAction}: Choose target`}</div>
                    ) : selectedCardLocation?.person == PEOPLE.PLAYER && turn == PEOPLE.PLAYER ? (
                        <CardActionMenu board={gs.board} onAction={onClickCardAction} />
                    ) : (
                        <div />
                    )}
                    {targetingAction && turn == PEOPLE.PLAYER ? (
                        <div className="w-[200px]">
                            <ActionButton
                                label="Cancel"
                                action="Cancel"
                                onAction={() => {
                                    setTargetingAction(undefined);
                                    setTargetCardLocations(undefined);
                                }}
                            />
                        </div>
                    ) : (
                        <TurnMenu onAction={onClickTurnAction} />
                    )}
                </div>
            </div>
        </div>
    );
}

export function CombatBoardPersonSection({ deck, onClickCard }: { deck: Deck; onClickCard: (cl: CardLocation) => void }) {
    const { selectedCardLocation, targetCardLocations } = useContext(UIStateContext);

    const { owner } = deck;

    return (
        <div className="flex w-full items-center justify-between p-4">
            <CombatBoardPersonPanel person={deck.owner} />
            <HandView
                board={gs.board}
                deck={deck}
                onClick={(i) => i && onClickCard(i)}
                selectedCardIndex={
                    selectedCardLocation?.deck.owner == owner && selectedCardLocation?.deckArea == DeckArea.Hand
                        ? selectedCardLocation.index
                        : undefined
                }
                targetCardLocations={targetCardLocations}
            />
            <div className="flex flex-row gap-4 p-2">
                <CardView
                    board={gs.board}
                    card={deck.general}
                    onClick={() => onClickCard(new CardLocation(deck, DeckArea.General))}
                    isSelected={selectedCardLocation?.deck.owner == owner && selectedCardLocation?.deckArea == DeckArea.General}
                    isTargeted={targetCardLocations?.hasIndex(deck, DeckArea.General)}
                />
                <CardView
                    board={gs.board}
                    card={deck.reserves.cards[0]}
                    onClick={() => onClickCard(new CardLocation(deck, DeckArea.Reserves))}
                    isSelected={selectedCardLocation?.deck.owner == owner && selectedCardLocation?.deckArea == DeckArea.Reserves}
                    isTargeted={targetCardLocations?.hasIndex(deck, DeckArea.Reserves)}
                />
                <CardView
                    board={gs.board}
                    card={deck.grave.cards[0]}
                    onClick={() => onClickCard(new CardLocation(deck, DeckArea.Grave))}
                    isSelected={selectedCardLocation?.deck.owner == owner && selectedCardLocation?.deckArea == DeckArea.Grave}
                    isTargeted={targetCardLocations?.hasIndex(deck, DeckArea.Grave)}
                />
            </div>
        </div>
    );
}

export function CombatBoardPersonPanel({ person }: { person: Person }) {
    const { name, gold, mp, maxMp } = person;
    return (
        <div className="w-24">
            <div className="text-lg font-bold text-gray-800">{name}</div>
            <div>{`💰${gold}`}</div>
            <div>{`🔷${mp}/${maxMp}`}</div>
            <div>{`🔷${mp}/${maxMp}`}</div>
        </div>
    );
}
