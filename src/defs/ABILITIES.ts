import { Ability } from "../classes/Ability";

export const ABILITIES = {
    REND: new Ability("Rend", "🪚", "After slaying a foe, remove it from the board instead of burying it."),
    CLEAVE: new Ability("Cleave", "🪓", "After slaying a foe, do 1 damage to adjacent foes."),
    TERRORIZE: new Ability("Terrorize", "🎃", "After attacking a foe, force it to be immediately withdrawn."),
    //INSPIRE: new Ability("Inspire", "", `Adjacent units gain +1 melee attack.`),
    REACH: new Ability("Reach", "⚜️", `Can attack foes diagonally.`),
    RANGED: new Ability("Ranged", "🏹", `Can attack any foe in enemy hand.`),
    FORMATION: new Ability("Formation", "💂", `Take 1/2 damage when there are no adjacent empty spaces.`),
    MANEUVER: new Ability("Maneuver", "🏃", "Can swap with any empty space or other unit with 🏃 regardless of distance."),
    SKIRMISH: new Ability("Skirmish", "🪃", `Can withdraw after attacking.`),
    CHARGE: new Ability("Charge", "🐎", `Can attack after swapping.`),
    ASSASSINATE: new Ability("Assassinate", "🥷", `Do 2x damage vs wounded enemies.`),
    FRENZY: new Ability("Frenzy", "😡", "Immediately attack back in ⚔️ after being attacked in ⚔️."),
    //TACTICIAN: new Ability("Tactician", "", "When defending, disable the attacker's abilities."),
    MECHANIC: new Ability("Mechanic", "🛠️", "At round's end, heal adjacent 🛞 for 2 hp."),
    MEDIC: new Ability("Medic", "❤️‍🩹", "At round's end, heal adjacent ❤️ for 2 hp."),
    INFECT: new Ability("Infect", "🦠", "After slaying a ❤️ foe, convert it to a copy of this card (added to your reserves)."),
    CAPTIVATE: new Ability("Captivate", "🎻", "Foes directly opposite this one cannot withdraw or swap."),
    LEECH: new Ability("Leech", "🧛", "After slaying a ❤️ foe, recover the amount of damage dealt."),
    STEALTHY: new Ability("Stealthy", "🥷", "Can bypass 🗿/🏰.")
};
export const ALL_ABILITIES = Object.values(ABILITIES);
export type AbilityID = keyof typeof ABILITIES;
