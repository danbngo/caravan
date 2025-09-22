import { UnitCard } from "../../classes/UnitCard";
import { CardDisplayState, DeckArea } from "../../enums";
import { CardWrapper } from "./CardWrapper";
import { CardClickHandler } from "../Common/types";
import { gs } from "../../classes/Game";

function calcDisplayState(card: UnitCard) {
    if (!card.location) return CardDisplayState.Normal;
    if (card.dead) return CardDisplayState.Dead;
    const { deckArea } = card.location;
    if ((deckArea == DeckArea.General || deckArea == DeckArea.Line) && card.tapped) return CardDisplayState.Tapped;
    if (card.waiting) return CardDisplayState.Idle;
    return CardDisplayState.Normal;
}

const levelIcons: Record<number, string> = {
    1: "1️⃣",
    2: "2️⃣",
    3: "3️⃣",
    4: "4️⃣",
    5: "5️⃣",
    6: "6️⃣",
    7: "7️⃣",
    8: "8️⃣"
};

export function UnitCardView({
    card,
    onClick,
    isSelected,
    isTargeted
}: {
    card: UnitCard;
    onClick?: CardClickHandler | undefined;
    isSelected?: boolean | undefined;
    isTargeted?: boolean | undefined;
}) {
    const { name, description, attack, hp, maxHp, abilities, traits, location, level } = card;
    const displayState = calcDisplayState(card);
    const hpRatio = hp / maxHp;
    const abilitiesAndTraits = [...abilities, ...traits];
    const hpColor = `rgb(${Math.floor(255 * (1 - hpRatio))}, 0, 0)`;
    const crown = !location
        ? null
        : location.deckArea == DeckArea.General
          ? "👑"
          : location.deckArea == DeckArea.Grave
            ? "🪦"
            : null;

    const borderColor = card.owner == gs.player ? "blue" : card.owner == gs.enemy ? "red" : undefined;

    const levelIcon = levelIcons[level] ?? "";

    return (
        <CardWrapper
            crown={crown}
            redTint={1 - hpRatio}
            onClick={() => {
                console.log("unit card onclick");
                if (onClick) onClick(location);
            }}
            isSelected={isSelected}
            isTargeted={isTargeted}
            title={`${levelIcon}${name}`}
            description={description}
            displayState={displayState}
            borderColor={borderColor}
        >
            <div className="text-sm space-y-1">
                <p className="cursor-pointer" title="Health" style={{ color: hpColor }}>
                    ❤️ {hp}/{maxHp}
                </p>
                <p className="cursor-pointer" title="Attack">
                    ⚔️ {attack}
                </p>
            </div>
            {abilitiesAndTraits.length > 0 && (
                <>
                    <hr className="p-1" />
                    <div className="flex flex-wrap gap-1">
                        {abilitiesAndTraits.map((a) => (
                            <div className="cursor-pointer" key={a.name} title={`${a.name}: ${a.description}`}>
                                {a.icon}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </CardWrapper>
    );
}
