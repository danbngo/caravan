import { DeckArea, Person } from "../enums";
import { safeAddToArray, safeRemoveFromArray } from "../utils/arrUtils";

type CardIndicesMap = Record<Person, Record<DeckArea, number[]>>;

function createEmptyCardIndicesMap(): CardIndicesMap {
    const result = {} as Record<Person, Record<DeckArea, number[]>>;
    for (const person of Object.values(Person)) {
        result[person as Person] = {} as Record<DeckArea, number[]>;
        for (const deckArea of Object.values(DeckArea)) {
            result[person as Person][deckArea as DeckArea] = [];
        }
    }
    return result;
}

export class CardIndices {
    private indices: CardIndicesMap;

    constructor({
        indices = createEmptyCardIndicesMap(),
    }: { indices?: CardIndicesMap } = {}) {
        this.indices = indices;
    }

    addIndices(person: Person, deckArea: DeckArea, indices: number[]) {
        safeAddToArray(this.indices[person][deckArea], ...indices);
    }

    removeIndices(person: Person, deckArea: DeckArea, indices: number[]) {
        safeRemoveFromArray(this.indices[person][deckArea], ...indices);
    }

    setIndices(person: Person, deckArea: DeckArea, indices: number[]) {
        this.indices = createEmptyCardIndicesMap();
        this.addIndices(person, deckArea, indices);
    }

    getIndices(person: Person, deckArea: DeckArea) {
        return this.indices[person][deckArea];
    }

    getFirstIndex(person: Person, deckArea: DeckArea) {
        return this.indices[person][deckArea][0];
    }

    hasIndex(person: Person, deckArea: DeckArea, index: number) {
        const indices = this.getIndices(person, deckArea);
        return indices.includes(index);
    }

    hasAnyIndices(person: Person, deckArea: DeckArea) {
        return this.getFirstIndex(person, deckArea) !== undefined;
    }

    //turns card indices into a set of card indices, where each contains only one index
    split() {
        const result: CardIndices[] = [];
        for (const p of Object.values(Person)) {
            for (const d of Object.values(DeckArea)) {
                const indices = this.getIndices(p, d);
                for (const i of indices) {
                    const ci = new CardIndices();
                    ci.setIndices(p, d, [i]);
                    result.push(ci);
                }
            }
        }
        return result;
    }
}
