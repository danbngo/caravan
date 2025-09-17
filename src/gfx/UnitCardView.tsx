import { Board } from "../classes/Board";
import { CardLocation } from "../classes/CardLocation";
import { GeneralCard } from "../classes/GeneralCard";
import { UnitCard } from "../classes/UnitCard";
import { CardDisplayState, CardPosition } from "../enums";
import { CardWrapper } from "./CardWrapper";
import { CardClickHandler } from "./interfaces";

function calcDisplayState(board: Board, card: UnitCard) {
    const { owner } = card;
    const personMetadata = owner ? board.calcPersonMetadata(owner) : undefined;
    if (card.dead) return CardDisplayState.Dead;
    if (card.position == CardPosition.Reserve && personMetadata && personMetadata.cardDrawn) return CardDisplayState.Reserve;
    if ((card.position == CardPosition.General || card.position == CardPosition.Hand) && card.tapped)
        return CardDisplayState.Tapped;
    return CardDisplayState.Normal;
}

export function UnitCardView({
    board,
    card,
    cardLocation,
    onClick,
    isSelected,
    isTargeted
}: {
    board: Board;
    card: UnitCard | GeneralCard;
    cardLocation?: CardLocation | undefined;
    onClick?: CardClickHandler | undefined;
    isSelected?: boolean | undefined;
    isTargeted?: boolean | undefined;
}) {
    const { name, description, attack, rangedAttack, hp, maxHp, abilities, traits } = card;
    const displayState = calcDisplayState(board, card);
    const hpRatio = hp / maxHp;
    const abilitiesAndTraits = [...abilities, ...traits];

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
            description={description}
            displayState={displayState}
        >
            <div className="text-sm space-y-1">
                <p className="cursor-pointer" title="Health">
                    ❤️ {hp}/{maxHp}
                </p>
                {card instanceof GeneralCard && card.maxMp ? (
                    <p className="cursor-pointer" title="Magic">
                        🪄 {card.mp}/{card.maxMp}
                    </p>
                ) : null}
                <p className="cursor-pointer" title="Melee Attack">
                    ⚔️ {attack}
                </p>
                <p className="cursor-pointer" title="Ranged Attack">
                    🏹 {rangedAttack}
                </p>
            </div>
            {abilitiesAndTraits.length > 0 && (
                <>
                    <hr className="p-1" />
                    <div className="flex flex-wrap gap-2">
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
