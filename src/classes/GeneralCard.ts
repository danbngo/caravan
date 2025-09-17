import { AbilityID } from "../defs/ABILITIES";
import { TraitID } from "../defs/TRAITS";
import { UnitCard } from "./UnitCard";

export class GeneralCard extends UnitCard {
    mp: number;
    maxMp: number;

    constructor(
        name: string,
        description: string,
        hp: number,
        attack: number,
        rangedAttack: number,
        mp: number,
        abilityIDs: AbilityID[] = [],
        traitIDs: TraitID[] = []
    ) {
        super(name, description, hp, attack, rangedAttack, abilityIDs, traitIDs);
        this.mp = mp;
        this.maxMp = mp;
    }

    static copy(card: GeneralCard): GeneralCard {
        return new GeneralCard(
            card.name,
            card.description,
            card.hp,
            card.attack,
            card.rangedAttack,
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
}
