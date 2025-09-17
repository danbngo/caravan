import { ABILITIES, AbilityID } from "../defs/ABILITIES";
import { TraitID, TRAITS } from "../defs/TRAITS";
import { CardPosition, Person } from "../enums";
import { Ability } from "./Ability";
import { Trait } from "./Trait";

export class UnitCard {
    owner: Person | undefined;
    name: string;
    description: string;
    hp: number;
    maxHp: number;
    attack: number;
    rangedAttack: number;
    abilityIDs: AbilityID[];
    traitIDs: TraitID[];
    position: CardPosition;
    tapped?: boolean;

    constructor(
        name: string,
        description: string,
        hp: number,
        attack: number,
        rangedAttack: number,
        abilityIDs: AbilityID[] = [],
        traitIDs: TraitID[] = [],
        owner?: Person | undefined
    ) {
        this.name = name;
        this.description = description;
        this.hp = hp;
        this.maxHp = hp;
        this.attack = attack;
        this.rangedAttack = rangedAttack;
        this.abilityIDs = abilityIDs;
        this.traitIDs = traitIDs;
        this.tapped = false;
        this.position = CardPosition.Reserve;
        this.owner = owner;
    }

    get abilities() {
        const result: Ability[] = [];
        for (const key in ABILITIES) {
            if (this.abilityIDs.includes(key as AbilityID)) {
                result.push(ABILITIES[key as AbilityID]);
            }
        }
        return result;
    }

    get traits() {
        const result: Trait[] = [];
        for (const key in TRAITS) {
            if (this.traitIDs.includes(key as TraitID)) {
                result.push(TRAITS[key as TraitID]);
            }
        }
        return result;
    }
    get wounded() {
        return this.hp < this.maxHp;
    }

    static copy(card: UnitCard, newOwner?: Person): UnitCard {
        return new UnitCard(
            card.name,
            card.description,
            card.maxHp,
            card.attack,
            card.rangedAttack,
            [...card.abilityIDs],
            [...card.traitIDs],
            newOwner || card.owner
        );
    }

    heal(forHp: number) {
        const oldHp = this.hp;
        this.hp = Math.min(this.maxHp, this.hp + forHp);
        return this.hp - oldHp;
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
