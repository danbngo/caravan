import { Ability } from "./Ability";
import { UnitCard } from "./UnitCard";

export class GeneralCard extends UnitCard {
    mp: number;
    maxMp: number;

    constructor(
        name: string,
        hp: number,
        attack: number,
        rangedAttack: number,
        mp: number,
        abilityNames: string[] = [],
    ) {
        super(name, hp, attack, rangedAttack, abilityNames);
        this.mp = mp;
        this.maxMp = mp;
    }

    static copy(card: GeneralCard): GeneralCard {
        return new GeneralCard(
            card.name,
            card.hp,
            card.attack,
            card.rangedAttack,
            card.maxMp,
            [...card.abilityNames],
        );
    }
}
