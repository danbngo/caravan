import { GeneralCard } from "../classes/GeneralCard";
import { UnitCard } from "../classes/UnitCard";

export const UNIT_CARDS = {
    DRAGON: new UnitCard("Dragon", "Extremely powerful.", 12, 3, 3, [], ["GIANT", "FLYING", "FIERY", "LIVING"]),
    ANGEL: new UnitCard("Angel", "Strongest holy unit.", 12, 3, 0, ["MEDIC"], ["DIVINE", "FLYING"]),
    AIRSHIP: new UnitCard("Airship", "Best contraption.", 12, 0, 4, ["BOMBARD"], ["GIANT", "FLYING", "CONTRAPTION"]),
    CLOCKWORK_GOLEM: new UnitCard("Clockwork Golem", "A big artificial golem.", 10, 3, 0, [], ["CONTRAPTION", "GIANT"]),
    ABOMINATION: new UnitCard("Abomination", "Giant flesh golem.", 10, 3, 0, ["REND", "CLEAVE"], ["UNDEAD", "ACCURSED", "GIANT"]),
    TOWER: new UnitCard("Tower", "Fires upon invaders.", 10, 0, 2, [], ["IMMOBILE"]),
    GIANT: new UnitCard("Giant", "Packs a punch and throws boulders.", 10, 3, 3, [], ["GIANT", "LIVING"]),
    BALROG: new UnitCard("Balrog", "Armed with a fiery whip.", 10, 2, 2, [], ["GIANT", "DEMONIC", "FIERY"]),
    BARRICADE: new UnitCard("Barricade", "Keeps out invaders.", 8, 0, 0, [], ["IMMOBILE"]),
    DEATH_KNIGHT: new UnitCard("Death Knight", "A scary knight.", 8, 3, 0, ["TERRORIZE"], ["UNDEAD", "ACCURSED", "OATH"]),
    PALADIN: new UnitCard("Paladin", "Holy cavalry.", 8, 3, 0, ["CHARGE"], ["DIVINE", "OATH"]),
    KNIGHT: new UnitCard("Knight", "Armed with a lance.", 8, 3, 0, ["CHARGE", "REACH", "MANEUVER"]),
    PIKEMAN: new UnitCard("Pikeman", "Very good vs cavalry.", 6, 3, 0, ["REACH", "FORMATION"], ["LIVING"]),
    DUELLIST: new UnitCard("Duellist", "Flashy fighter.", 6, 2, 2, ["CAPTIVATE"], ["LIVING"]),
    HORSE_ARCHER: new UnitCard("Horse Archer", "Fast and high range.", 6, 2, 2, ["SKIRMISH", "MANEUVER"], ["LIVING"]),
    BERSERKER: new UnitCard("Berserker", "Very aggro melee unit.", 6, 3, 0, ["FRENZY", "CLEAVE"], ["LIVING"]),
    SWORDSMAN: new UnitCard("Swordsman", "Durable all purpose melee unit.", 6, 2, 0, [], ["LIVING"]),
    VAMPIRE: new UnitCard("Vampire", "Good at harassing.", 6, 2, 0, [], ["FLYING", "VAMPIRIC", "ACCURSED", "UNDEAD"]),
    GHOUL: new UnitCard("Ghoul", "Eats fallen enemies.", 4, 2, 0, ["DEVOUR", "FRENZY"], ["UNDEAD"]),
    SPEARMAN: new UnitCard("Spearman", "Good vs cavalry.", 4, 2, 0, ["REACH", "FORMATION"], ["LIVING"]),
    ARCHER: new UnitCard("Archer", "Basic ranged unit.", 4, 0, 2, [], ["LIVING"]),
    JAVILENEER: new UnitCard("Javileneer", "Able to attack in melee or ranged.", 4, 1, 1, ["SKIRMISH"], ["LIVING"]),
    CATAPULT: new UnitCard("Catapult", "Basic siege unit.", 4, 0, 2, ["BOMBARD"], ["CONTRAPTION"]),
    BATTERING_RAM: new UnitCard("Battering Ram", "Melee siege unit", 4, 2, 0, [], ["CONTRAPTION"]),
    CLERIC: new UnitCard("Cleric", "Healer with a mace.", 4, 1, 0, ["MEDIC"], ["DIVINE", "LIVING"]),
    ENGINEER: new UnitCard("Engineer", "Can heal your contraptions.", 2, 1, 0, ["MECHANIC"], ["LIVING"]),
    SKIRMISHER: new UnitCard("Skirmisher", "Light harassment unit.", 2, 0, 1, ["SKIRMISH"], ["LIVING"]),
    ASSASSIN: new UnitCard("Assassin", "Deadly vs wounded living units.", 2, 2, 0, ["ASSASSINATE"], ["LIVING"]),
    FIRE_MAGE: new UnitCard("Fire Mage", "Good vs contraptions and undead.", 2, 0, 4, [], ["FIERY", "LIVING"]),
    ZOMBIE: new UnitCard("Zombie", "Slow but numerous.", 2, 1, 0, ["INFECT", "DEVOUR"], ["UNDEAD"]),
    HEALER: new UnitCard("Healer", "Heals nearby living units.", 2, 0, 0, ["MEDIC"], ["PACIFIST", "LIVING"]),
    BARD: new UnitCard("Bard", "Flamboyant music player.", 2, 1, 0, ["CAPTIVATE"], ["LIVING"]),
    IMP: new UnitCard("Imp", "Tiny annoying demon.", 2, 1, 1, [], ["FLYING", "DEMONIC"]),
    GHOST: new UnitCard("Ghost", "Mostly harmless undead scout.", 2, 1, 0, [], ["FLYING", "GHOSTLY"])
};
export const ALL_UNIT_CARDS = Object.values(UNIT_CARDS);

export const GENERAL_CARDS = {
    GENERAL: new GeneralCard("General", "Leader of the army.", 10, 1, 0, 3, [], ["LIVING"])
};

export const ALL_GENERAL_CARDS = Object.values(GENERAL_CARDS);
