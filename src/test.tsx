import { Deck } from "./classes/Deck";
import { ALL_UNIT_CARDS } from "./defs/UNIT_CARDS";
import { randomMemberOfArray } from "./utils/rndUtils";
import { UnitCard } from "./classes/UnitCard";
import { gs } from "./classes/Game";
import { Board } from "./classes/Board";
import { Person } from "./classes/Person";
import { TurnSystem } from "./systems/TurnSystem";
import { GENERAL_CARDS } from "./defs/GENERAL_CARDS";

export function startTestGame() {
    gs.player = new Person({ name: "Player", gold: 0, maxMp: 10 }) 
    gs.player.deck = makeRandomDeck(gs.player);

    gs.board = new Board({
        enemy: new Person({ name: "Enemy", gold: 0, maxMp: 10 }),
        player: gs.player
    });

    gs.enemy.deck = makeRandomDeck(gs.enemy);

    TurnSystem.startTurn(gs.player);
}
