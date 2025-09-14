import { Hand } from "../classes/Hand";
import { CardView } from "./CardView";
import { HandClickHandler } from "./interfaces";

export function HandView({
    hand,
    onClick,
    selectedCardIndex
}: {
    hand: Hand;
    onClick?: HandClickHandler | undefined;
    selectedCardIndex?: number | undefined;
}) {
    return (
        <div className="flex flex-row gap-4 overflow-x-auto p-2">
            {hand.cards.map((card, index) => (
                <CardView
                    key={index}
                    isSelected={selectedCardIndex == index}
                    onClick={() => {
                        if (onClick) onClick(index);
                    }}
                    card={card}
                />
            ))}
        </div>
    );
}
