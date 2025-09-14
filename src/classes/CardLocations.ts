import { DeckArea, Person } from "../enums";
import { CardLocation } from "../interfaces/CardLocation";
import { safeAddToArray, safeRemoveFromArray } from "../utils/arrUtils";

type CardLocationsMap = Record<Person, Record<DeckArea, number[]>>;

function createEmptyCardLocationsMap(): CardLocationsMap {
    const result = {} as Record<Person, Record<DeckArea, number[]>>;
    for (const person of Object.values(Person)) {
        result[person as Person] = {} as Record<DeckArea, number[]>;
        for (const deckArea of Object.values(DeckArea)) {
            result[person as Person][deckArea as DeckArea] = [];
        }
    }
    return result;
}

export class CardLocations {
    private locations: CardLocationsMap;

    constructor({
        locations = createEmptyCardLocationsMap()
    }: { locations?: CardLocationsMap } = {}) {
        this.locations = locations;
    }

    addLocations(person: Person, deckArea: DeckArea, indices: number[]) {
        safeAddToArray(this.locations[person][deckArea], ...indices);
    }

    removeLocations(person: Person, deckArea: DeckArea, indices: number[]) {
        safeRemoveFromArray(this.locations[person][deckArea], ...indices);
    }

    setLocations(person: Person, deckArea: DeckArea, indices: number[]) {
        this.locations = createEmptyCardLocationsMap();
        this.addLocations(person, deckArea, indices);
    }

    getLocationIndices(person: Person, deckArea: DeckArea) {
        return this.locations[person][deckArea];
    }

    getFirstLocation() {
        const locations = this.split();
        if (locations.length > 0) {
            throw new Error(
                "should not have been able to split into multiple locations"
            );
        }
        return locations[0];
    }

    /*getFirstLocationIndex(
        person: Person,
        deckArea: DeckArea
    ): number | undefined {
        const indices = this.locations[person][deckArea];
        if (indices.length == 0) return undefined;
        return Math.min(...indices);
    }*/

    hasIndex(person: Person, deckArea: DeckArea, index: number = 0): boolean {
        const indices = this.getLocationIndices(person, deckArea);
        return indices.includes(index);
    }

    split() {
        const result: CardLocation[] = [];
        for (const person of Object.values(Person)) {
            for (const deckArea of Object.values(DeckArea)) {
                const indices = this.getLocationIndices(person, deckArea);
                for (const i of indices) {
                    result.push({
                        person,
                        deckArea,
                        index: i
                    });
                }
            }
        }
        return result;
    }
}
