import { CardLocation } from "../../classes/CardLocation";
import { Deck } from "../../classes/Deck";
import { UnitCard } from "../../classes/UnitCard";
import { DeckArea } from "../../enums";

export type LocationClickHandler = (location: CardLocation) => void;
export type CardClickHandler = (card: UnitCard) => void;
export type OnActClickHandler = (deck: Deck, deckArea: DeckArea, index?: number | undefined) => void;
export type UIMode = "Title" | "Create Character" | "Combat";
