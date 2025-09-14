import { Ability } from "../classes/Ability";

export const ABILITIES: Record<string, Ability> = {
    REACH: new Ability(
        "Reach",
        `Attack first in melee. If enemy is KO'd, this unit suffers no damage.`
    )
};
export const ALL_ABILITIES = Object.values(ABILITIES);
