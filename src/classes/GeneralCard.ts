import { AbilityID } from "../defs/ABILITIES";
import { TraitID } from "../defs/TRAITS";
import { UnitCard } from "./UnitCard";

export class GeneralCard extends UnitCard {
    mp: number;
    maxMp: number;

    constructor(
        name: string,
        description: string,
        level: number,
        hp: number,
        attack: number,
        mp: number,
        abilityIDs: AbilityID[] = [],
        traitIDs: TraitID[] = []
    ) {
        super(name, description, level, hp, attack, abilityIDs, traitIDs);
        this.mp = mp;
        this.maxMp = mp;
    }

    static copy(card: GeneralCard): GeneralCard {
        return new GeneralCard(
            card.name,
            card.description,
            card.level,
            card.hp,
            card.attack,
            card.maxMp,
            [...card.abilityIDs],
            [...card.traitIDs]
        );
    }

    healMp(forMp: number) {
        const oldMp = this.mp;
        this.mp = Math.min(this.maxMp, this.mp + forMp);
        return this.mp - oldMp;
    }

    damageMp(forMp: number) {
        this.mp = Math.max(0, this.mp - forMp);
    }
}
