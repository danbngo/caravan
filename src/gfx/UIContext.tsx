import { createContext, useEffect, useRef, useState } from "react";
import { CardAction, DeckArea, Person } from "../enums";
import { CardIndices } from "../classes/CardIndices";


interface UIState {
    selectedCardIndices: CardIndices
    targetableCardIndices: CardIndices
    targetingAction?: CardAction | undefined
    setTargetingAction: (i?: CardAction | undefined) => void
}

export const UIStateContext = createContext<UIState>({
    selectedCardIndices: new CardIndices(),
    targetableCardIndices: new CardIndices(),
    targetingAction: undefined,
    setTargetingAction: (i?: CardAction | undefined) => console.log(i),
});

export function UIStateContextProvider({ children }: { children: React.ReactNode }) {
    const [targetingAction, setTargetingAction] = useState<CardAction | undefined>(undefined)
    const targetableCardIndicesRef = useRef<CardIndices>(new CardIndices())
    const selectedCardIndicesRef = useRef<CardIndices>(new CardIndices())

    return <UIStateContext.Provider value={
        {
            selectedCardIndices: selectedCardIndicesRef.current,
            targetingAction,
            setTargetingAction,
            targetableCardIndices: targetableCardIndicesRef.current,
        }}>
        {children}
    </UIStateContext.Provider>
}