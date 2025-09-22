import { Trait } from "../classes/Trait";

export const TRAITS = {
    //species, should be mutually exclusive (mostly)
    LIVING: new Trait("Living", "❤️", "If untapped at round's end, heal for 1 hp."),
    UNDEAD: new Trait("Undead", "💀", "When slain, add this card to reserves instead of burying it."),
    DEMONIC: new Trait("Demonic", "😈", "Take no damage from 🔥."),
    DIVINE: new Trait("Divine", "🙏", "Do 2x damage to 💀/😈. If slain, they are removed from the game."),
    FIERY: new Trait("Fiery", "🔥", "Do 2x damage to 💀/🛞."),
    BUILDING: new Trait("Building", "🏰", "Absorbs attacks at adjacent units. Cannot attack, withdraw, or swap."),
    CONTRAPTION: new Trait("Contraption", "🛞", "Do 2x damage to 🏰/🗿."),

    //physical traits
    FLYING: new Trait("Flying", "🪽", "Can bypass non-🪽/🗿."),
    GIANT: new Trait("Giant", "🗿", "Do 2x damage to 🏰."),

    //mental traits
    OATH: new Trait("Oath", "🎖️", "Cannot withdraw."),
    PACIFIST: new Trait("Pacifist", "☮️", "Cannot attack.")
    //CHANNEL: new Trait("Channel", "", "If this unit is untapped at the end of the round, g")
};

export const ALL_TRAITS = Object.values(TRAITS);
export type TraitID = keyof typeof TRAITS;
