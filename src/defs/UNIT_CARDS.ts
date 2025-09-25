import { UnitCard } from "../classes/UnitCard";

export const UNIT_CARDS = {
    // DRAGON: new UnitCard("Dragon", "Extremely powerful.", 6, 12, 3, [], ["GIANT", "FLYING", "FIERY", "LIVING"]),
    // ANGEL: new UnitCard("Angel", "Strongest holy unit.", 6, 12, 2, ["MEDIC"], ["DIVINE", "FLYING"]),
    // AIRSHIP: new UnitCard("Airship", "Best contraption.", 6, 12, 3, ["RANGED"], ["GIANT", "FLYING", "CONTRAPTION"]),
    // METAL_GOLEM: new UnitCard("Metal Golem", "A big artificial golem.", 5, 10, 3, [], ["CONTRAPTION", "GIANT"]),
    // ABOMINATION: new UnitCard("Abomination", "Giant flesh golem.", 5, 10, 3, ["CLEAVE"], ["UNDEAD", "GIANT"]),
    // TOWER: new UnitCard("Tower", "Fires upon invaders.", 5, 10, 2, ["RANGED"], ["BUILDING"]),
    // GIANT: new UnitCard("Giant", "Packs a punch and throws boulders.", 5, 10, 3, ["RANGED"], ["GIANT", "LIVING"]),
    // BALROG: new UnitCard("Balrog", "Armed with a fiery whip.", 5, 10, 2, ["REACH"], ["GIANT", "DEMONIC", "FIERY"]),
    BARRICADE: new UnitCard("Barricade", "Keeps out invaders.", 4, 8 * 2, 0, [], ["BUILDING"]),
    // DEATH_KNIGHT: new UnitCard("Death Knight", "A knight dedicated to evil.", 4, 8, 3, ["TERRORIZE", "CHARGE"], ["OATH"]),
    PALADIN: new UnitCard("Paladin", "Holy cavalry.", 4, 8, 3, ["CHARGE"], ["DIVINE", "OATH"]),
    KNIGHT: new UnitCard("Knight", "Armed with a lance.", 4, 8, 3, ["CHARGE", "REACH", "MANEUVER"]),
    PIKEMAN: new UnitCard("Pikeman", "Very good vs cavalry.", 3, 6, 3, ["REACH", "FORMATION"], ["LIVING"]),
    // DUELLIST: new UnitCard("Duellist", "Flashy fighter.", 3, 6, 2, ["CAPTIVATE"], ["LIVING"]),
    HORSE_ARCHER: new UnitCard("Horse Archer", "Fast and high range.", 3, 6, 2, ["RANGED", "MANEUVER"], ["LIVING"]),
    BERSERKER: new UnitCard("Berserker", "Very aggro melee unit.", 3, 6, 3, ["FRENZY", "CLEAVE"], ["LIVING"]),
    SWORDSMAN: new UnitCard("Swordsman", "Durable all purpose melee unit.", 3, 6, 2, [], ["LIVING"]),
    // VAMPIRE: new UnitCard("Vampire", "Good at harassing.", 3, 6, 2, ["CAPTIVATE", "LEECH", "STEALTHY"], ["FLYING"]),
    // GHOUL: new UnitCard("Ghoul", "Eats fallen enemies.", 3, 6, 2, ["FRENZY", "LEECH"], ["UNDEAD"]),
    // SKELETON: new UnitCard("Skeleton", "Tough minion.", 2, 4, 2, ["FORMATION"], ["UNDEAD"]),
    SPEARMAN: new UnitCard("Spearman", "Good vs cavalry.", 2, 4, 2, ["REACH", "FORMATION"], ["LIVING"]),
    ARCHER: new UnitCard("Archer", "Basic ranged unit.", 2, 4, 2, ["RANGED"], ["LIVING"]),
    JAVILENEER: new UnitCard("Javileneer", "Hurls javelins.", 2, 4, 1, ["REACH", "SKIRMISH"], ["LIVING"]),
    CATAPULT: new UnitCard("Catapult", "Basic siege unit.", 2, 4, 3, ["RANGED"], ["CONTRAPTION"]),
    BATTERING_RAM: new UnitCard("Ram", "Melee siege unit", 2, 4, 2, [], ["CONTRAPTION"]),
    CLERIC: new UnitCard("Cleric", "Healer with a mace.", 2, 4, 1, ["MEDIC"], ["DIVINE", "LIVING"]),
    // ASSASSIN: new UnitCard("Assassin", "Deadly vs wounded living units.", 1, 2, 2, ["ASSASSINATE", "STEALTHY"], ["LIVING"]),
    //ENGINEER: new UnitCard("Engineer", "Can heal your contraptions.", 1, 2, 0, ["MECHANIC"], ["LIVING", "PACIFIST"]),
    SKIRMISHER: new UnitCard("Skirmisher", "Light harassment unit.", 1, 2, 1, ["REACH", "SKIRMISH"], ["LIVING"]),
    FIRE_MAGE: new UnitCard("Fire Mage", "Good vs contraptions and undead.", 1, 2, 4, ["RANGED"], ["FIERY", "LIVING"]),
    // ZOMBIE: new UnitCard("Zombie", "Slow but numerous.", 1, 2, 1, ["LEECH", "INFECT"], ["UNDEAD"]),
    HEALER: new UnitCard("Healer", "Heals nearby living units.", 1, 2, 0, ["MEDIC"], ["PACIFIST", "LIVING"])
    // BARD: new UnitCard("Bard", "Flamboyant music player.", 1, 2, 1, ["CAPTIVATE"], ["LIVING"]),
    // IMP: new UnitCard("Imp", "Tiny annoying demon that hurls fire.", 1, 2, 1, ["RANGED"], ["FLYING", "DEMONIC"])
};
export const ALL_UNIT_CARDS = Object.values(UNIT_CARDS);
