export enum Person {
    Player = "Player",
    Enemy = "Enemy"
}

export enum CardAction {
    Draw = "Draw",
    Move = "Move",
    Attack = "Attack",
    Retreat = "Retreat"
}

export enum TurnAction {
    EndTurn = "EndTurn"
}

export enum DeckArea {
    Hand = "Hand",
    General = "General",
    Reserves = "Reserves",
    Grave = "Grave"
}

export enum CardDisplayState {
    Normal = "Normal",
    Tapped = "Tapped",
    Reserve = "Reserve",
    Dead = "Dead",
    Empty = "Empty"
}

export enum CardPosition {
    Hand = "Hand",
    General = "General",
    Reserve = "Reserve",
    Grave = "Grave"
}
