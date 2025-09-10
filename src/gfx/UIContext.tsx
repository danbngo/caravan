import { createContext, useEffect, useState } from "react";
import { UnitCard } from "../classes/UnitCard";
import { DeckArea } from "../enums";

interface UIState {
    //selectedCard?: UnitCard | undefined
    //setSelectedCard: ((card: UnitCard | undefined) => void)
    selectedPlayerCardIndex?: number | undefined
    setSelectedPlayerCardIndex: ((index: number | undefined) => void)
    selectedEnemyCardIndex?: number | undefined
    setSelectedEnemyCardIndex: ((index: number | undefined) => void)
    selectedPlayerDeckArea?: DeckArea | undefined
    setSelectedPlayerDeckArea: ((deckArea: DeckArea | undefined) => void)
    selectedEnemyDeckArea?: DeckArea | undefined
    setSelectedEnemyDeckArea: ((deckArea: DeckArea | undefined) => void)
}

export const UIStateContext = createContext<UIState>({
    //setSelectedCard: (i: UnitCard | undefined) => console.log(i),
    setSelectedEnemyCardIndex: (i: number | undefined) => console.log(i),
    setSelectedPlayerCardIndex: (i: number | undefined) => console.log(i),
    setSelectedPlayerDeckArea: (i: DeckArea | undefined) => console.log(i),
    setSelectedEnemyDeckArea: (i: DeckArea | undefined) => console.log(i),
});

export function UIStateContextProvider({ children }: { children: React.ReactNode }) {
    //const [selectedCard, setSelectedCard] = useState<UnitCard | undefined>();
    const [selectedPlayerCardIndex, setSelectedPlayerCardIndex] = useState<number | undefined>();
    const [selectedEnemyCardIndex, setSelectedEnemyCardIndex] = useState<number | undefined>();
    const [selectedEnemyDeckArea, setSelectedEnemyDeckArea] = useState<DeckArea | undefined>();
    const [selectedPlayerDeckArea, setSelectedPlayerDeckArea] = useState<DeckArea | undefined>();

    useEffect(() => {
        if (selectedPlayerCardIndex !== undefined) setSelectedEnemyCardIndex(undefined)
    }, [selectedPlayerCardIndex])
    useEffect(() => {
        if (selectedEnemyCardIndex !== undefined) setSelectedPlayerCardIndex(undefined)
    }, [selectedEnemyCardIndex])

    return <UIStateContext.Provider value={
        {
            //selectedCard,
            //setSelectedCard,
            setSelectedEnemyCardIndex,
            setSelectedPlayerCardIndex,
            selectedEnemyCardIndex,
            selectedPlayerCardIndex,
            selectedEnemyDeckArea,
            setSelectedEnemyDeckArea,
            selectedPlayerDeckArea,
            setSelectedPlayerDeckArea
        }}>
        {children}
    </UIStateContext.Provider>
}