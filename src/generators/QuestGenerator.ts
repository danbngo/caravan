import { Quest } from "../classes/Quest";

export class QuestGenerator {
    level: number;
    constructor({ level }: { level: number }) {
        this.level = level;
    }

    generate() {
        return new Quest()
    }
}
