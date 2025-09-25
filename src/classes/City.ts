import { Quest } from "./Quest";
import { UnitCard } from "./UnitCard";

export class City {
    name: string;
    hirelings: UnitCard[];
    quests: Quest[];

    constructor({ name, hirelings, quests }: { name: string; hirelings: UnitCard[]; quests: Quest[] }) {
        this.name = name;
        this.hirelings = hirelings;
        this.quests = quests;
    }
}
