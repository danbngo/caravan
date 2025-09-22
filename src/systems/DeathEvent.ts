import { gs } from "../classes/Game";
import { UnitCard } from "../classes/UnitCard";

export class DeathEvent {
    killer?: UnitCard | undefined;
    card: UnitCard;

    constructor(card: UnitCard, killer?: UnitCard | undefined) {
        this.card = card;
        this.killer = killer;
        if (!card.location || (killer && !killer.location)) throw new Error("attacker and defender must have locations!");

        const [ctIDs] = [card.traitIDs];

        if (killer) {
            const [ktIDs, kaIDs] = [killer.traitIDs, killer.abilityIDs];
            if (kaIDs.includes("REND")) {
                this.handleRended();
            } else if (ktIDs.includes("DIVINE") && (ctIDs.includes("UNDEAD") || ctIDs.includes("DEMONIC"))) this.handleBanished();
            else if (kaIDs.includes("INFECT") && ctIDs.includes("LIVING")) this.handleInfected();
            else if (ctIDs.includes("UNDEAD") && card.location) this.handleResurrect();
            else this.handleNormalDeath();
        }
    }

    handleRended() {
        const { killer, card } = this;
        if (!killer || !card.location) throw new Error("must have slainby and a location!");
        card.location.deck.removeCard(killer);
        gs.addMessage(`${killer.name} rends ${killer.name} to pieces!`);
    }

    handleInfected() {
        const { killer, card } = this;
        if (!killer || !card.location || !killer.location) throw new Error("must have slainby location and a location!");
        gs.addMessage(`${killer.name} infects ${killer.name}! It becomes another ${killer.name}!`);
        killer.location.deck.removeCard(killer);
        const newCard = UnitCard.copy(killer, killer.owner);
        killer.location.deck.addCard(newCard);
    }

    handleBanished() {
        const { killer, card } = this;
        if (!killer || !card.location) throw new Error("must have slainby and a location!");
        const { deck } = card.location;
        gs.addMessage(`${card.name} is banished by ${killer.name}'s divine might!`);
        deck.line.removeCard(card);
    }

    handleResurrect() {
        const { card } = this;
        const { deck } = card.location!;
        deck.withdrawCard(card);
        gs.addMessage(`${card.name} stops moving... for now.`);
    }

    handleNormalDeath() {
        const { card } = this;
        const { deck } = card.location!;
        deck.buryCard(card);
        gs.addMessage(`${card.name} dies!`);
    }
}
