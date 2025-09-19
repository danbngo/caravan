import { Person } from "../classes/Person";

export const PEOPLE = {
    PLAYER: new Person({ name: "Player", gold: 0, maxMp: 10 }),
    ENEMY: new Person({ name: "Enemy", gold: 0, maxMp: 10 })
};
export const ALL_PEOPLE = Object.values(PEOPLE);
