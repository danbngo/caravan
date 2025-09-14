import { GeneralCard } from "../classes/GeneralCard";
import { UnitCard } from "../classes/UnitCard";
import { CardDisplayState, CardPosition } from "../enums";
import { CardWrapper } from "./CardWrapper";
import { LineSeparator } from "./LineSeperator";

function calcDisplayState(card: UnitCard) {
  if (card.dead) return CardDisplayState.Dead
  if (card.position == CardPosition.Reserve) return CardDisplayState.Reserve
  if (card.tapped) return CardDisplayState.Tapped
  return CardDisplayState.Normal
}


export function UnitCardView({ card, onClick, isSelected, isTargeted }: { card: UnitCard | GeneralCard, onClick?: Function | undefined, isSelected?: boolean | undefined, isTargeted?: boolean | undefined, }) {
  const { tapped, name, attack, rangedAttack, hp, maxHp, abilities } = card
  const displayState = calcDisplayState(card)

  return <CardWrapper onClick={onClick} isSelected={isSelected} isTargeted={isTargeted} title={name} displayState={displayState}>
    <div className="text-sm space-y-1">
      <p>❤️ {hp}/{maxHp}</p>
      {card instanceof GeneralCard && card.maxMp ? <p>🪄 {card.mp}/{card.maxMp}</p> : null}
      <p>⚔️ {attack}</p>
      <p>🏹 {rangedAttack}</p>
    </div>
    {abilities.length > 0 && (
      <>
        <LineSeparator />
        <div className="text-xs">
          <ul className="list-disc pl-4">
            {abilities.map((a, i) => (
              <li key={i}>
                <strong>{a.name}</strong>
              </li>
            ))}
          </ul>
        </div>
      </>
    )}
  </CardWrapper>
}