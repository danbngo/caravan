import { City } from "../classes/City";

export class CityGenerator {
    level: number;
    constructor({ level }: { level: number }) {
        this.level = level;
    }

    generate(): City {
        const name = "Random City";
        const city = new City({ name, hirelings, quests });
    }
}
