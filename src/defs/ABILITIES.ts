import { Ability } from "../classes/Ability";

export const ABILITIES = {
    REACH: new Ability(
        "Reach",
        "⚜️",
        `Hit first in melee (unless enemy also has reach). If the enemy is slain, this unit suffers no damage.`
    ),
    FORMATION: new Ability("Formation", "⚜️", `Suffer 1/2 melee damage from units with charge.`),
    RANGE: new Ability("Range", "🔭", `Hit first in ranged (unless enemy also has range). If foe is slain, take no damage.`),
    MANEUVER: new Ability("Maneuver", "", "Can swap with any empty space or any other unit with maneuver."),
    SKIRMISH: new Ability("Skirmish", "🪃", `When this unit attacks, if the enemy has any ⚔️, skip melee combat.`),
    CHARGE: new Ability("Charge", "🐎", `When this unit attacks, if the enemy has any 🏹, skip ranged combat.`),
    ASSASSINATE: new Ability(
        "Assassinate",
        "🥷",
        `When attacking wounded living enemies, hit first for 3x damage. If foe is slain, take no damage.`
    ),
    FRENZY: new Ability("Frenzy", "😡", "When attacking, melee combat is performed up to 2 times."),
    CLEAVE: new Ability("Cleave", "", "When attacking in melee, if the foe is slain, do 1 damage to adjacent foes."),
    //TACTICIAN: new Ability("Tactician", "", "When defending, disable the attacker's abilities."),
    TERRORIZE: new Ability("Terrorize", "", "When attacking, bypass living defenders."),
    REND: new Ability("Rend", "", "When slaying a foe, it's removed from the game instead of buried."),
    MECHANIC: new Ability(
        "Mechanic",
        "",
        "Do 2x melee damage to contraptions. At round's end, heal adjacent contraptions for 1 hp."
    ),
    MEDIC: new Ability("Medic", "", "At round's end, heal adjacent living for 1 hp.")
};
export const ALL_ABILITIES = Object.values(ABILITIES);
export type AbilityID = keyof typeof ABILITIES;
