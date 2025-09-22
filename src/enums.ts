export enum CardAction {
    Swap = "Swap",
    Attack = "Attack",
    Withdraw = "Withdraw",
    Wait = "Wait",
    Un_Wait = "Un-Wait",
    Place = "Place"
}

export enum TurnAction {
    Redraw = "Redraw",
    EndTurn = "EndTurn"
}

export enum DeckArea {
    Line = "Line",
    General = "General",
    Reserves = "Reserves",
    Hand = "Hand",
    Grave = "Grave"
}

export enum CardDisplayState {
    Normal = "Normal",
    Tapped = "Tapped",
    Idle = "Idle",
    Dead = "Dead",
    Empty = "Empty"
}
