import { GeneralCard } from "../classes/GeneralCard";
import { UnitCard } from "../classes/UnitCard";

export const UNIT_CARDS = {
    KNIGHT: new UnitCard('Knight', 6, 3, 0),
    SWORDSMAN: new UnitCard('Swordsman', 6, 2, 0),
    SPEARMAN: new UnitCard('Spearman', 4, 2, 0),
    ARCHER: new UnitCard('Archer', 4, 1, 2),
    SKIRMISHER: new UnitCard('Skirmisher', 2, 0, 1),
    THIEF: new UnitCard('Thief', 2, 1, 1),
    MAGE: new UnitCard('Mage', 2, 0, 3),
}
export const ALL_UNIT_CARDS = Object.values(UNIT_CARDS);

export const GENERAL_CARDS = {
    GENERAL: new GeneralCard('General', 10, 2, 0, 3, [])
}

export const ALL_GENERAL_CARDS = Object.values(GENERAL_CARDS)