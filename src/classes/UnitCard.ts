import { ABILITIES, AbilityID } from "../defs/ABILITIES";
import { TraitID, TRAITS } from "../defs/TRAITS";
import { CardAction } from "../enums";
import { Ability } from "./Ability";
import { CardLocation } from "./CardLocation";
import { Person } from "./Person";
import { Trait } from "./Trait";

export class UnitCard {
    owner: Person | undefined;
    name: string;
    description: string;
    level: number;
    hp: number;
    maxHp: number;
    attack: number;
    abilityIDs: AbilityID[];
    traitIDs: TraitID[];
    tapped?: boolean;
    waiting?: boolean;
    location?: CardLocation | undefined;
    restrictedActions: CardAction[]; //cleared on next untap

    constructor(
        name: string,
        description: string,
        level: number,
        hp: number,
        attack: number,
        abilityIDs: AbilityID[] = [],
        traitIDs: TraitID[] = [],
        owner?: Person | undefined
    ) {
        this.name = name;
        this.description = description;
        this.level = level;
        this.hp = hp;
        this.maxHp = hp;
        this.attack = attack;
        this.abilityIDs = abilityIDs;
        this.traitIDs = traitIDs;
        this.tapped = false;
        this.owner = owner;
        this.restrictedActions = [];
        this.waiting = false;
    }

    get deckArea() {
        return this.location?.deckArea;
    }

    get index() {
        return this.location?.index;
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
            card.level,
            card.maxHp,
            card.attack,
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

    damage(forHp: number) {
        this.hp = Math.max(0, this.hp - forHp);
    }

    tap() {
        this.tapped = true;
    }
    untap() {
        this.tapped = false;
        this.waiting = false;
        this.restrictedActions = [];
    }

    get dead() {
        return this.hp <= 0;
    }
}
