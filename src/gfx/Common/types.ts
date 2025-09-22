import { CardLocation } from "../../classes/CardLocation";
import { Deck } from "../../classes/Deck";
import { DeckArea } from "../../enums";

export type CardClickHandler = (cardLocation: CardLocation | undefined) => void;

export type OnActClickHandler = (deck: Deck, deckArea: DeckArea, index?: number | undefined) => void;
