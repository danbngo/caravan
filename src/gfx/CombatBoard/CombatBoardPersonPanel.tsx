import { Deck } from "../../classes/Deck";
import { Person } from "../../classes/Person";

export function CombatBoardPersonPanel({ person, deck }: { person: Person; deck: Deck }) {
    const { name, gold, mp, maxMp } = person;
    const handCount = deck.hand.numCards;
    const reservesCount = deck.reserves.length;
    const graveCount = deck.grave.length;

    return (
        <div>
            <div className="text-lg font-bold text-gray-800">{name}</div>
            <div className="w-24 flex flex-col">
                <div title={`Mp: ${mp}/${maxMp}`}>{`🔷${mp}/${maxMp}`}</div>
                <div title={`Cards in Hand: ${handCount}`}>{`✋${handCount}`}</div>
                <div title={`Cards in Reserve: ${reservesCount}`}>{`🚩${reservesCount}`}</div>
                <div title={`Cards in Grave: ${graveCount}`}>{`🪦${graveCount}`}</div>
            </div>
        </div>
    );

    // <div title={`Gold: ${gold}`}>{`💰${gold}`}</div>
}
