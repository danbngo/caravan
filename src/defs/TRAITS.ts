import { Trait } from "../classes/Trait";

export const TRAITS = {
    FLYING: new Trait(
        "Flying",
        "🪽",
        "Skip melee combat vs non-flying units. When attacking, bypass defenders that cannot hit you."
    ),
    INSUBSTANTIAL: new Trait(
        "Insubstantial",
        "👻",
        "Skip ranged combat vs non-insubstantial units. When attacking, bypass defenders that cannot hit you."
    ),
    VAMPIRIC: new Trait("Vampiric", "🧛", "After surviving melee combat vs. a living foe, recover the amount of damage dealt."),
    CANNIBAL: new Trait("Cannibal", "", "After slaying a living foe in melee, recover all HP."),
    UNDEAD: new Trait(
        "Undead",
        "",
        "After killing a living foe in melee, convert it to a copy of this card and place it in your reserves."
    ),
    DEMONIC: new Trait("Demonic", "", "Take no damage from fiery units."),
    DIVINE: new Trait("Divine", "", "Do 2x melee damage to undead and demons."),
    PACIFIST: new Trait("Pacifist", "", "Cannot attack."),
    FIERY: new Trait("Fiery", "", "Do 2x ranged damage to undead and contraptions."),
    SIEGE: new Trait("Siege", "", "Do 2x damage to immobile units and giants"),
    IMMOBILE: new Trait("Immobile", "", "Cannot attack, swap or be swapped."),
    CONTRAPTION: new Trait("Contraption", "", "Take half damage during ranged combat."),
    GIANT: new Trait("Giant", "", "Cannot defend vs. non-giants. Attacker always bypasses."),
    LIVING: new Trait("Living", "", "If untapped at round's end, heal for 1 hp.")
    //CHANNEL: new Trait("Channel", "", "If this unit is untapped at the end of the round, g")
};

export const ALL_TRAITS = Object.values(TRAITS);
export type TraitID = keyof typeof TRAITS;
