import { UnitCard } from "../classes/UnitCard";

export const GENERAL_CARDS = {
    GENERAL: new UnitCard("General", "Leader of the army.", 7, 10, 1, [], ["LIVING"]),
    GENERAL_2: new UnitCard("General 2", "Leader of the army.", 7, 10, 1, [], ["LIVING"]),
    GENERAL_3: new UnitCard("General 3", "Leader of the army.", 7, 10, 1, [], ["LIVING"])
};

export const ALL_GENERAL_CARDS = Object.values(GENERAL_CARDS);
