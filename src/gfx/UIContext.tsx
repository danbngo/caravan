import { createContext, ReactNode, useRef, useState } from "react";
import { CardAction } from "../enums";
import { CardLocations } from "../classes/CardLocations";

interface UIState {
    selectedCardLocations: CardLocations;
    targetedCardLocations: CardLocations;
    targetingAction?: CardAction | undefined;
    setTargetingAction: (i?: CardAction | undefined) => void;
}

export const UIStateContext = createContext<UIState>({
    selectedCardLocations: new CardLocations(),
    targetedCardLocations: new CardLocations(),
    targetingAction: undefined,
    setTargetingAction: (i?: CardAction | undefined) => console.log(i)
});

export function UIStateContextProvider({ children }: { children: ReactNode }) {
    const [targetingAction, setTargetingAction] = useState<
        CardAction | undefined
    >(undefined);
    const targetedCardLocationsRef = useRef<CardLocations>(new CardLocations());
    const selectedCardLocationsRef = useRef<CardLocations>(new CardLocations());

    return (
        <UIStateContext.Provider
            value={{
                selectedCardLocations: selectedCardLocationsRef.current,
                targetingAction,
                setTargetingAction,
                targetedCardLocations: targetedCardLocationsRef.current
            }}
        >
            {children}
        </UIStateContext.Provider>
    );
}
