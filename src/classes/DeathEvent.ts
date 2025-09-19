import { Board } from "./Board";
import { UnitCard } from "./UnitCard";

export class DeathEvent {
    board: Board;
    killer?: UnitCard | undefined;
    card: UnitCard;

    constructor(board: Board, card: UnitCard, killer?: UnitCard | undefined) {
        this.board = board;
        this.card = card;
        this.killer = killer;
        if (!card.location || (killer && !killer.location)) throw new Error("attacker and defender must have locations!");

        const [ctIDs] = [card.traitIDs];

        if (killer) {
            const [ktIDs, kaIDs] = [killer.traitIDs, killer.abilityIDs];
            if (kaIDs.includes("REND")) {
                this.handleRended();
            } else {
                if (kaIDs.includes("INFECT")) this.handleInfected();
                else if (ktIDs.includes("DIVINE") && (ctIDs.includes("UNDEAD") || ctIDs.includes("DEMONIC")))
                    this.handleBanished();
                if (ctIDs.includes("UNDEAD") && card.location) this.handleResurrect();
            }
            if (card.location) this.handleNormalDeath();
        }
    }

    handleRended() {
        const { killer, board, card } = this;
        if (!killer || !card.location) throw new Error("must have slainby and a location!");
        card.location.deck.removeCard(killer);
        board.addMessage(`${killer.name} rends ${killer.name} to pieces!`);
    }

    handleInfected() {
        const { killer, board, card } = this;
        if (!killer || !card.location || !killer.location) throw new Error("must have slainby location and a location!");
        board.addMessage(`${killer.name} infects ${killer.name}! It becomes another ${killer.name}!`);
        killer.location.deck.removeCard(killer);
        const newCard = UnitCard.copy(killer, killer.owner);
        killer.location.deck.addCard(newCard);
    }

    handleBanished() {
        const { killer, board, card } = this;
        if (!killer || !card.location) throw new Error("must have slainby and a location!");
        const { deck } = card.location;
        board.addMessage(`${card.name} is banished by ${killer.name}'s divine might!`);
        deck.hand.removeCard(card);
    }

    handleResurrect() {
        const { card, board } = this;
        const { deck } = card.location!;
        deck.withdrawCard(card);
        board.addMessage(`${card.name} stops moving... for now.`);
    }

    handleNormalDeath() {
        const { card, board } = this;
        const { deck } = card.location!;
        deck.buryCard(card);
        board.addMessage(`${card.name} dies!`);
    }
}
