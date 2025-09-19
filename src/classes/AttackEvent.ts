import { PEOPLE } from "../defs/PEOPLE";
import { CardAction } from "../enums";
import { rollDie } from "../utils/rndUtils";
import { Board } from "./Board";
import { CardLocation } from "./CardLocation";
import { DeathEvent } from "./DeathEvent";
import { UnitCard } from "./UnitCard";

export class AttackEvent {
    board: Board;
    attacker: UnitCard;
    defender: UnitCard;
    defenderAdjacentLocations: CardLocation[];
    damageMod: number;
    damage: number;

    constructor(board: Board, attacker: UnitCard, defender: UnitCard) {
        this.board = board;
        this.attacker = attacker;
        this.defender = defender;
        if (!defender.location || !attacker.location) throw new Error("attacker and defender must have locations!");
        this.defenderAdjacentLocations = defender.location.deck.calcAdjacentHandLocations(defender.location.index);

        const [aaIDs, daIDs] = [attacker.abilityIDs, defender.abilityIDs];

        if (aaIDs.includes("SKIRMISH")) attacker.restrictedActions.push(CardAction.Attack, CardAction.Swap);
        else attacker.tap();
        //defender.tap();

        if (attacker.owner == PEOPLE.PLAYER) {
            board.addMessage(`You attack: ${attacker.name} vs ${defender.name}.`);
        } else if (attacker.owner == PEOPLE.ENEMY) {
            board.addMessage(`Enemy attacks: ${attacker.name} vs ${defender.name}.`);
        } else throw new Error("unrecognized deck owner!");

        this.damageMod = this.calcDamageMod();
        this.damage = this.handleAttack();

        if (defender.dead) {
            new DeathEvent(board, attacker, defender);
            if (aaIDs.includes("CLEAVE")) {
                this.handleCleave();
            }
            if (aaIDs.includes("LEECH") && !daIDs.includes("LEECH") && this.damage > 0) {
                this.handleVampirism();
            }
        } else {
            if (aaIDs.includes("TERRORIZE")) {
                defender.location.deck.withdrawCard(defender);
                board.addMessage(`${defender.name} is struck with terror and flees!`);
            }
            if (daIDs.includes("FRENZY")) {
                new AttackEvent(board, defender, attacker);
            }
        }
    }

    calcDamageMod() {
        const { attacker, defenderAdjacentLocations, defender } = this;
        let damageMod = 1;
        const [caIDs, taIDs, ctIDs, ttIDs] = [attacker.abilityIDs, defender.abilityIDs, attacker.traitIDs, defender.traitIDs];
        //damage mods from abilities
        if (taIDs.includes("FORMATION")) {
            const numEmptyAdjacents = defenderAdjacentLocations.filter((al) => al.card == undefined).length;
            if (numEmptyAdjacents == 0) damageMod *= 0.5;
        }
        if (caIDs.includes("ASSASSINATE") && defender.wounded && ttIDs.includes("LIVING")) {
            damageMod *= 2;
        }
        //damage mods from traits
        if (ttIDs.includes("DEMONIC") && ctIDs.includes("FIERY")) damageMod *= 0;
        if (ttIDs.includes("BUILDING") && !ctIDs.includes("CONTRAPTION") && !ctIDs.includes("GIANT")) damageMod *= 0.5;
        if ((ttIDs.includes("GIANT") || ttIDs.includes("BUILDING")) && ctIDs.includes("CONTRAPTION")) damageMod *= 2;
        if ((ttIDs.includes("UNDEAD") || ttIDs.includes("DEMONIC")) && ctIDs.includes("DIVINE")) damageMod *= 2;
        if (ttIDs.includes("BUILDING") && ctIDs.includes("GIANT")) damageMod *= 2;
        if ((ttIDs.includes("CONTRAPTION") || ttIDs.includes("UNDEAD")) && ctIDs.includes("FIERY")) damageMod *= 2;
        console.log("damage mod pre cap:", damageMod);
        damageMod = Math.max(0.5, Math.min(2, damageMod));
        console.log("final damage mod:", damageMod);
        return damageMod;
    }

    handleAttack() {
        const { damageMod, attacker, defender, board } = this;
        if (!attacker.attack) throw new Error("attackers with 0 attack should always be pacifist!");
        const baseDmg = rollDie(attacker.attack);
        const dmg = Math.ceil(baseDmg * damageMod);
        defender.damage(dmg);
        board.addMessage(`${attacker.name} hits ${defender.name}! -${baseDmg}${damageMod !== 1 ? `x${damageMod}` : ""} HP`);
        return dmg;
    }

    handleCleave() {
        const { attacker, defenderAdjacentLocations, board } = this;
        const dmg = 1;
        for (const cleavedLocation of defenderAdjacentLocations) {
            if (!cleavedLocation.card) continue;
            cleavedLocation.card.hp -= dmg;
            board.addMessage(`${attacker.name} cleaves ${cleavedLocation.card.name}! (${dmg} dmg)`);
            if (cleavedLocation.card.dead) {
                new DeathEvent(board, cleavedLocation.card, attacker);
            }
        }
    }

    handleVampirism() {
        const { attacker, board } = this;
        const healAmount = attacker.heal(this.damage);
        if (healAmount) board.addMessage(`${attacker.name} siphons ${healAmount} HP.`);
    }
}
