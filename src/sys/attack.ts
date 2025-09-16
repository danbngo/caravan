import { Board } from "../classes/Board";
import { CardLocations } from "../classes/CardLocations";
import { Move } from "../classes/Move";
import { DeckArea, Person } from "../enums";
import { CombatProps } from "../interfaces/CombatProps";
import { TargetingProps } from "../interfaces/TargetingProps";
import { rollDie } from "../utils/rndUtils";

export function calcAttackableLocations(targetingProps: TargetingProps) {
    const { opposingDeck, index, deck, card } = targetingProps;
    const validLocations: CardLocations = new CardLocations([deck, opposingDeck]);
    const targetCard = opposingDeck.hand.cards[index];
    let bypass: boolean = targetCard == undefined;

    if (!bypass && targetCard) {
        if (card.abilityIDs.includes("TERRORIZE")) {
            if (targetCard.traitIDs.includes("LIVING")) {
                bypass = true;
            }
        }
    }

    if (!bypass && targetCard) {
        validLocations.addLocations(opposingDeck, DeckArea.Hand, [index]);
    } else {
        validLocations.addLocations(opposingDeck, DeckArea.General, [0]);
    }
    return validLocations;
}

export function attackCard(board: Board, move: Move) {
    const { selectedCardLocation, targetCardLocation } = move;
    if (!selectedCardLocation || !targetCardLocation) throw new Error("selected/target card location must be specified");
    const { person, card } = selectedCardLocation;
    if (!card) throw new Error("selected card must exist at location!");
    const targetCard = targetCardLocation.card;
    if (!targetCard) throw new Error("target card must exist at location!");
    const { deck, opponent, opposingDeck } = board.calcPersonMetadata(person);
    const combatProps: CombatProps = {
        board,
        person,
        opponent,
        deck,
        opposingDeck,
        card,
        targetCard,
        selectedCardLocation,
        targetCardLocation
    };
    if (person == Person.Player) {
        board.addMessage(`You attack: ${card.name} vs ${targetCard.name}.`);
    } else if (person == Person.Enemy) {
        board.addMessage(`Enemy attacks: ${card.name} vs ${targetCard.name}.`);
    } else throw new Error("unrecognized deck owner!");
    card.tap();
    targetCard.tap();
    let combatOver: boolean = false;
    let meleeCombatRounds: number = 1;
    let rangedCombatRounds: number = 1;
    if (card.abilityIDs.includes("CHARGE")) {
        rangedCombatRounds *= 0;
    }
    if (card.abilityIDs.includes("SKIRMISH") && targetCard.attack > 0) {
        meleeCombatRounds *= 0;
    }
    if (card.traitIDs.includes("FLYING") && !card.traitIDs.includes("FLYING")) {
        meleeCombatRounds *= 0;
    }
    if (card.traitIDs.includes("INSUBSTANTIAL") && !targetCard.traitIDs.includes("INSUBSTANTIAL")) {
        rangedCombatRounds *= 0;
    }
    if (card.abilityIDs.includes("FRENZY")) {
        meleeCombatRounds *= 2;
    }
    while (rangedCombatRounds-- > 0 && !combatOver) combatOver = handleRangedCombat(combatProps);
    while (meleeCombatRounds-- > 0 && !combatOver) combatOver = handleMeleeCombat(combatProps);
    if (combatOver) return;
}

function calcEnemyCombatProps(combatProps: CombatProps) {
    const enemyCombatProps: CombatProps = {
        board: combatProps.board,
        person: combatProps.opponent,
        opponent: combatProps.person,
        deck: combatProps.opposingDeck,
        opposingDeck: combatProps.deck,
        card: combatProps.targetCard,
        targetCard: combatProps.card,
        selectedCardLocation: combatProps.targetCardLocation,
        targetCardLocation: combatProps.selectedCardLocation
    };
    return enemyCombatProps;
}

function handleMeleeCombat(combatProps: CombatProps) {
    const { board, card, targetCard } = combatProps;
    const enemyCombatProps = calcEnemyCombatProps(combatProps);
    let combatOver = false;
    let firstStrike = false;
    let damageMod = 1;
    let targetDamageMod = 1;
    if (card.abilityIDs.includes("FORMATION") && targetCard.abilityIDs.includes("CHARGE")) targetDamageMod *= 0.5;
    if (targetCard.abilityIDs.includes("FORMATION") && card.abilityIDs.includes("CHARGE")) damageMod *= 0.5;
    if (card.abilityIDs.includes("REACH") && !targetCard.abilityIDs.includes("REACH")) firstStrike = true;
    if (card.abilityIDs.includes("ASSASSINATE") && targetCard.wounded && targetCard.traitIDs.includes("LIVING")) {
        firstStrike = true;
        damageMod *= 3;
    }
    const damage = handleMeleeAttack(combatProps, damageMod);
    let counterDamage = 0;
    if (firstStrike) {
        combatOver = checkCardDead(combatProps);
    }
    if (!combatOver) {
        counterDamage = handleMeleeAttack(enemyCombatProps, targetDamageMod);
        combatOver = checkCardDead(combatProps);
        combatOver = checkCardDead(enemyCombatProps);
    }
    if (card.traitIDs.includes("VAMPIRIC") && damage > 0) {
        const healAmount = card.heal(damage);
        if (healAmount) board.addMessage(`${card.name} is healed (${healAmount}) [vampirism].`);
    }
    if (targetCard.traitIDs.includes("VAMPIRIC") && counterDamage > 0) {
        const healAmount = targetCard.heal(counterDamage);
        if (healAmount) board.addMessage(`${targetCard.name} is healed (${healAmount}) [vampirism].`);
    }
    return combatOver;
}

function handleRangedCombat(combatProps: CombatProps) {
    const { card, targetCard } = combatProps;
    const enemyCombatProps = calcEnemyCombatProps(combatProps);
    let combatOver = false;
    let firstStrike = false;
    let damageMod = 1;
    if (card.abilityIDs.includes("RANGE") && !targetCard.abilityIDs.includes("RANGE")) firstStrike = true;
    if (card.abilityIDs.includes("ASSASSINATE") && targetCard.wounded) {
        firstStrike = true;
        damageMod = 3;
    }
    handleRangedAttack(combatProps, damageMod);
    if (firstStrike) {
        combatOver = checkCardDead(combatProps);
    }
    if (!combatOver) {
        handleRangedAttack(enemyCombatProps);
        combatOver = checkCardDead(combatProps);
        combatOver = checkCardDead(enemyCombatProps);
    }
    return combatOver;
}

function handleRangedAttack(combatProps: CombatProps, damageMod: number = 1) {
    const { card, targetCard, board } = combatProps;
    if (card.rangedAttack) {
        const dmg = rollDie(card.rangedAttack) * damageMod;
        targetCard.hp -= dmg;
        if (dmg) {
            board.addMessage(`${card.name} shoots ${targetCard.name}! (${dmg} dmg)`);
        } else {
            board.addMessage(`${card.name} misses ${targetCard.name}! (0 dmg)`);
        }
        return dmg;
    }
    return 0;
}

function handleMeleeAttack(combatProps: CombatProps, damageMod: number = 1) {
    const { card, targetCard, board } = combatProps;
    if (card.attack) {
        const dmg = rollDie(card.attack);
        targetCard.hp -= dmg * damageMod;
        if (dmg) {
            board.addMessage(`${card.name} hits ${targetCard.name}! (${dmg} dmg)`);
        } else {
            board.addMessage(`${card.name} misses ${targetCard.name}! (0 dmg)`);
        }
        return dmg;
    }
    return 0;
}

function checkCardDead(combatProps: CombatProps): boolean {
    const { card, deck, board, selectedCardLocation } = combatProps;
    if (card.dead) {
        board.addMessage(`${card.name} dies!`);
        if (selectedCardLocation.deckArea == DeckArea.Hand) deck.buryCard(selectedCardLocation.index);
        return true;
    }
    return false;
}
