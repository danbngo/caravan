import { createContext, ReactNode, useState } from "react";
import { CardAction } from "../enums";
import { CardLocations } from "../classes/CardLocations";
import { CardLocation } from "../classes/CardLocation";

interface UIState {
    selectedCardLocation?: CardLocation | undefined;
    targetCardLocations: CardLocations | undefined;
    targetingAction?: CardAction | undefined;
    setTargetingAction: (i?: CardAction | undefined) => void;
    setSelectedCardLocation: (i?: CardLocation) => void;
    setTargetCardLocations: (i?: CardLocations) => void;
}

export const UIStateContext = createContext<UIState>({
    selectedCardLocation: undefined,
    targetCardLocations: undefined,
    targetingAction: undefined,
    setTargetingAction: (i?: CardAction | undefined) => console.log(i),
    setSelectedCardLocation: (i?: CardLocation) => console.log(i),
    setTargetCardLocations: (i?: CardLocations) => console.log(i)
});

export function UIStateContextProvider({ children }: { children: ReactNode }) {
    const [targetingAction, setTargetingAction] = useState<CardAction | undefined>(undefined);
    const [targetCardLocations, setTargetCardLocations] = useState<CardLocations | undefined>(undefined);
    const [selectedCardLocation, setSelectedCardLocation] = useState<CardLocation | undefined>(undefined);

    return (
        <UIStateContext.Provider
            value={{
                selectedCardLocation,
                setSelectedCardLocation,
                targetingAction,
                setTargetingAction,
                targetCardLocations,
                setTargetCardLocations
            }}
        >
            {children}
        </UIStateContext.Provider>
    );
}
