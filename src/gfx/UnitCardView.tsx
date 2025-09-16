import { CardLocation } from "../classes/CardLocation";
import { GeneralCard } from "../classes/GeneralCard";
import { UnitCard } from "../classes/UnitCard";
import { CardDisplayState, CardPosition } from "../enums";
import { CardWrapper } from "./CardWrapper";
import { CardClickHandler } from "./interfaces";

function calcDisplayState(card: UnitCard) {
    if (card.dead) return CardDisplayState.Dead;
    if (card.position == CardPosition.Reserve) return CardDisplayState.Reserve;
    if (card.tapped) return CardDisplayState.Tapped;
    return CardDisplayState.Normal;
}

export function UnitCardView({
    card,
    cardLocation,
    onClick,
    isSelected,
    isTargeted
}: {
    card: UnitCard | GeneralCard;
    cardLocation?: CardLocation | undefined;
    onClick?: CardClickHandler | undefined;
    isSelected?: boolean | undefined;
    isTargeted?: boolean | undefined;
}) {
    const { name, attack, rangedAttack, hp, maxHp, abilities, traits } = card;
    const displayState = calcDisplayState(card);
    const hpRatio = hp / maxHp;
    const abilitiesAndTraits = [...abilities, ...traits];
    console.log("abilities:", abilities, card.abilityIDs);

    return (
        <CardWrapper
            redTint={1 - hpRatio}
            onClick={() => {
                console.log("unit card onclick");
                if (onClick) onClick(cardLocation);
            }}
            isSelected={isSelected}
            isTargeted={isTargeted}
            title={name}
            displayState={displayState}
        >
            <div className="text-sm space-y-1">
                <p>
                    ❤️ {hp}/{maxHp}
                </p>
                {card instanceof GeneralCard && card.maxMp ? (
                    <p>
                        🪄 {card.mp}/{card.maxMp}
                    </p>
                ) : null}
                <p>⚔️ {attack}</p>
                <p>🏹 {rangedAttack}</p>
            </div>
            {abilitiesAndTraits.length > 0 && (
                <>
                    <hr className="p-1" />
                    <div className="flex flex-wrap gap-2">
                        {abilitiesAndTraits.map((a) => (
                            <div key={a.name} title={`${a.name}: ${a.description}`}>
                                {a.icon}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </CardWrapper>
    );
}
