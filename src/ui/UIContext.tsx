import { createContext, ReactNode, useState } from "react";
import { CardAction } from "../enums";
import { CardLocations } from "../classes/CardLocations";
import { UIMode } from "./Common/types";
import { UnitCard } from "../classes/UnitCard";

interface UIState {
    selectedCard?: UnitCard | undefined;
    targetCardLocations: CardLocations | undefined;
    targetingAction?: CardAction | undefined;
    setTargetingAction: (i?: CardAction | undefined) => void;
    setSelectedCard: (i?: UnitCard) => void;
    setTargetCardLocations: (i?: CardLocations) => void;
    setUIMode: (mode: UIMode) => void;
    uiMode: UIMode;
}

export const UIContext = createContext<UIState>({
    selectedCard: undefined,
    targetCardLocations: undefined,
    targetingAction: undefined,
    setTargetingAction: (i?: CardAction | undefined) => console.log(i),
    setSelectedCard: (i?: UnitCard) => console.log(i),
    setTargetCardLocations: (i?: CardLocations) => console.log(i),
    setUIMode: () => {},
    uiMode: "Title"
});

export function UIContextProvider({ children }: { children: ReactNode }) {
    const [targetingAction, setTargetingAction] = useState<CardAction | undefined>(undefined);
    const [targetCardLocations, setTargetCardLocations] = useState<CardLocations | undefined>(undefined);
    const [selectedCard, setSelectedCard] = useState<UnitCard | undefined>(undefined);
    const [uiMode, setUIMode] = useState<UIMode>("Title");

    console.log("context provider updated:", uiMode);

    return (
        <UIContext.Provider
            value={{
                uiMode,
                setUIMode,
                selectedCard,
                setSelectedCard,
                targetingAction,
                setTargetingAction,
                targetCardLocations,
                setTargetCardLocations
            }}
        >
            {children}
        </UIContext.Provider>
    );
}
