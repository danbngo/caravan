import { ALL_ABILITIES } from "../defs/ABILITIES";
import { CardPosition } from "../enums";

export class UnitCard {
    name: string;
    hp: number;
    maxHp: number;
    attack: number;
    rangedAttack: number;
    abilityNames: string[];
    position: CardPosition;
    tapped?: boolean;

    constructor(
        name: string,
        hp: number,
        attack: number,
        rangedAttack: number,
        abilityNames: string[] = []
    ) {
        this.name = name;
        this.hp = hp;
        this.maxHp = hp;
        this.attack = attack;
        this.rangedAttack = rangedAttack;
        this.abilityNames = abilityNames;
        this.tapped = false;
        this.position = CardPosition.Reserve;
    }

    get abilities() {
        return ALL_ABILITIES.filter((a) => this.abilityNames.includes(a.name));
    }

    static copy(card: UnitCard): UnitCard {
        return new UnitCard(
            card.name,
            card.maxHp,
            card.attack,
            card.rangedAttack,
            [...card.abilityNames]
        );
    }

    tap() {
        this.tapped = true;
    }
    untap() {
        this.tapped = false;
    }

    get dead() {
        return this.hp <= 0 || this.position == CardPosition.Grave;
    }
}
