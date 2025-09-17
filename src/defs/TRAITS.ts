import { Trait } from "../classes/Trait";

export const TRAITS = {
    //species, should be mutually exclusive (mostly)
    GHOSTLY: new Trait("Ghostly", "👻", "Can bypass non-👻 foes."),
    VAMPIRIC: new Trait("Vampiric", "🧛", "After attacking a ❤️ foe, recover the amount of damage dealt."),
    UNDEAD: new Trait("Undead", "💀", "After being slain, add this card to reserves instead of burying it."),
    ACCURSED: new Trait("Accursed", "", "If slain by 🙏/🔥, remove this unit from the game."),
    DEMONIC: new Trait("Demonic", "😈", "Take no damage from 🔥."),
    DIVINE: new Trait("Divine", "🙏", "Do 2x damage to 💀/😈."),
    FIERY: new Trait("Fiery", "🔥", "Do 2x damage to 🛞."),
    IMMOBILE: new Trait("Immobile", "🏰", "Cannot attack, withdraw, or swap. Take 1/2 damage from non-💣."),
    CONTRAPTION: new Trait("Contraption", "🛞", "Do 2x damage to 🏰/🗿. Take 1/2 damage from non-🔥."),
    LIVING: new Trait("Living", "❤️", "If untapped at round's end, heal for 1 hp."),

    //physical traits
    GIANT: new Trait("Giant", "🗿", "Non-🗿 can always bypass 🗿 when attacking."),
    FLYING: new Trait("Flying", "🪽", "Can bypass non-🪽 foes if they have no 🏹."),

    //mental traits
    OATH: new Trait("Oath", "🎖️", "Cannot withdraw."),
    PACIFIST: new Trait("Pacifist", "☮️", "Cannot attack.")
    //CHANNEL: new Trait("Channel", "", "If this unit is untapped at the end of the round, g")
};

export const ALL_TRAITS = Object.values(TRAITS);
export type TraitID = keyof typeof TRAITS;
