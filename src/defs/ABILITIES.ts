import { Ability } from "../classes/Ability";

export const ABILITIES = {
    REND: new Ability("Rend", "🪚", "After slaying a foe, remove it from the game instead of burying."),
    CLEAVE: new Ability("Cleave", "🪓", "After slaying a foe, do 1 damage to adjacent foes."),
    TERRORIZE: new Ability("Terrorize", "🎃", "After attacking a foe, force it to withdraw"),
    //INSPIRE: new Ability("Inspire", "", `Adjacent units gain +1 melee attack.`),
    REACH: new Ability("Reach", "⚜️", `Can attack foes diagonally.`),
    FORMATION: new Ability("Formation", "⚜️", `Take 1/2 damage when there are no adjacent empty spaces.`),
    BOMBARD: new Ability("Bombard", "🎯", `Can attack any foe in 🏹.`),
    MANEUVER: new Ability("Maneuver", "🏃", "Can swap with any empty space or other units with 🏃."),
    SKIRMISH: new Ability("Skirmish", "🪃", `Withdraw immediately after attacking.`),
    CHARGE: new Ability("Charge", "🐎", `Can attack after swapping.`),
    DEVOUR: new Ability("Devour", "👄", "After slaying a living foe, recover all HP."),
    ASSASSINATE: new Ability("Assassinate", "🥷", `Do 3x damage vs wounded living enemies.`),
    FRENZY: new Ability("Frenzy", "😡", "Immediately attack back in ⚔️ after being attacked in ⚔️."),
    //TACTICIAN: new Ability("Tactician", "", "When defending, disable the attacker's abilities."),
    MECHANIC: new Ability("Mechanic", "🛠️", "At round's end, heal adjacent contraptions for 1 hp."),
    MEDIC: new Ability("Medic", "❤️‍🩹", "At round's end, heal adjacent living for 1 hp."),
    INFECT: new Ability(
        "Infect",
        "🦠",
        "After slaying a living foe in ⚔️, replace it with a copy of this card, then add to bottom of your reserves."
    ),
    CAPTIVATE: new Ability("Captivate", "🎻", "Foes directly opposite this one cannot withdraw or swap.")
};
export const ALL_ABILITIES = Object.values(ABILITIES);
export type AbilityID = keyof typeof ABILITIES;
