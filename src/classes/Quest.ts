import { Deck } from "./Deck";

export class Quest {
    enemyDeck: Deck;
    reward: number;
    name: string;

    constructor({ name, enemyDeck, reward }: { name: string; enemyDeck: Deck; reward: number }) {
        this.name = name;
        this.enemyDeck = enemyDeck;
        this.reward = reward;
    }
}
