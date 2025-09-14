import { UnitCard } from "../classes/UnitCard";

export type HandClickHandler = (index: number) => void;
export type CardClickHandler = (card: UnitCard | undefined) => void;
