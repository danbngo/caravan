import { Board } from "../classes/Board";
import { CardLocations } from "../classes/CardLocations";
import { Move } from "../classes/Move";
import { UnitCard } from "../classes/UnitCard";
import { DeckArea, Person } from "../enums";
import { CombatProps } from "../interfaces/CombatProps";
import { TargetingProps } from "../interfaces/TargetingProps";
import { rollDie } from "../utils/rndUtils";

export function calcAttackableLocations(targetingProps: TargetingProps): CardLocations {
    const { opposingDeck, index, deck, card } = targetingProps;
    const validLocations: CardLocations = new CardLocations([deck, opposingDeck]);
    const targetCard = opposingDeck.hand.cards[index];
    const [caIDs, ctIDs] = [card.abilityIDs, card.traitIDs];

    let bypass: boolean = targetCard == undefined;
    const skip: boolean = ctIDs.includes("PACIFIST") || ctIDs.includes("IMMOBILE");

    if (!bypass && targetCard) {
        const [taIDs, ttIDs] = [targetCard.abilityIDs, targetCard.traitIDs];
        console.log(taIDs);
        if (caIDs.includes("TERRORIZE")) {
            if (ttIDs.includes("LIVING") && !ttIDs.includes("DIVINE") && !ttIDs.includes("OATH")) {
                bypass = true;
            }
        }
        if (ctIDs.includes("FLYING")) {
            if (!ttIDs.includes("FLYING") && targetCard.rangedAttack <= 0) {
                bypass = true;
            }
        }
        if (ctIDs.includes("GHOSTLY")) {
            if (!ttIDs.includes("GHOSTLY") && targetCard.attack <= 0) {
                bypass = true;
            }
        }
        if (!ctIDs.includes("GIANT")) {
            if (ttIDs.includes("GIANT")) {
                bypass = true;
            }
        }
    }
    if (!skip) {
        if (targetCard) validLocations.addLocations(opposingDeck, DeckArea.Hand, [index]);
        if (bypass || !targetCard) validLocations.addLocations(opposingDeck, DeckArea.General, [0]);
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
    const [caIDs, taIDs, ctIDs, ttIDs] = [card.abilityIDs, targetCard.abilityIDs, card.traitIDs, targetCard.traitIDs];
    console.log(taIDs);
    let rangedCombatRounds: number = 1;
    if (caIDs.includes("CHARGE")) {
        rangedCombatRounds *= 0;
    }
    if (caIDs.includes("SKIRMISH") && targetCard.attack > 0) {
        meleeCombatRounds *= 0;
    }
    if (ctIDs.includes("FLYING") && !ctIDs.includes("FLYING")) {
        meleeCombatRounds *= 0;
    }
    if (ctIDs.includes("GHOSTLY") && !ttIDs.includes("GHOSTLY")) {
        rangedCombatRounds *= 0;
    }
    if (caIDs.includes("FRENZY")) {
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
        selectedCardLocation: combatProps.targetCardLocation,
        targetCard: combatProps.card,
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
    const [caIDs, taIDs, ctIDs, ttIDs] = [card.abilityIDs, targetCard.abilityIDs, card.traitIDs, targetCard.traitIDs];
    if (caIDs.includes("FORMATION") && taIDs.includes("CHARGE")) targetDamageMod *= 0.5;
    if (taIDs.includes("FORMATION") && caIDs.includes("CHARGE")) damageMod *= 0.5;
    if (ttIDs.includes("IMMOBILE") && !caIDs.includes("SIEGE")) damageMod *= 0.5;
    if (ctIDs.includes("IMMOBILE") && !taIDs.includes("SIEGE")) targetDamageMod *= 0.5;
    if (ttIDs.includes("CONTRAPTION") && caIDs.includes("MECHANIC")) damageMod *= 2;
    if (ctIDs.includes("CONTRAPTION") && taIDs.includes("MECHANIC")) damageMod *= 2;
    if ((ttIDs.includes("DEMONIC") || ttIDs.includes("UNDEAD")) && ctIDs.includes("DIVINE")) targetDamageMod *= 0.5;
    if ((ctIDs.includes("DEMONIC") || ctIDs.includes("UNDEAD")) && ttIDs.includes("DIVINE")) targetDamageMod *= 0.5;
    if ((ttIDs.includes("GIANT") || ttIDs.includes("IMMOBILE")) && caIDs.includes("SIEGE")) damageMod *= 2;
    if ((ctIDs.includes("GIANT") || ctIDs.includes("IMMOBILE")) && taIDs.includes("SIEGE")) targetDamageMod *= 2;

    if (caIDs.includes("REACH") && !taIDs.includes("REACH")) firstStrike = true;
    if (caIDs.includes("ASSASSINATE") && targetCard.wounded && ttIDs.includes("LIVING")) {
        firstStrike = true;
        damageMod *= 3;
    }

    const damage = handleMeleeAttack(combatProps, damageMod);
    let counterDamage = 0;
    if (firstStrike) {
        combatOver = checkOpposingCardDead(combatProps);
    }
    if (!combatOver) {
        counterDamage = handleMeleeAttack(enemyCombatProps, targetDamageMod);
        combatOver = checkOpposingCardDead(combatProps);
        combatOver = checkOpposingCardDead(enemyCombatProps);
    }
    if (targetCard.dead) {
        if (caIDs.includes("CLEAVE")) {
            handleCleave(combatProps);
        }
        if (caIDs.includes("REND")) {
            handleRend(combatProps);
        } else {
            if (caIDs.includes("DEVOUR") && ttIDs.includes("LIVING")) {
                handleDevour(combatProps);
            }
            if (caIDs.includes("INFECT") && ttIDs.includes("LIVING")) {
                handleInfect(combatProps);
            }
        }
        if (ctIDs.includes("UNDEAD")) handleUndeath(combatProps);
    }
    if (ctIDs.includes("VAMPIRIC") && damage > 0) {
        const healAmount = card.heal(damage);
        if (healAmount) board.addMessage(`${card.name} siphons ${healAmount} HP.`);
    }
    if (ttIDs.includes("VAMPIRIC") && counterDamage > 0) {
        const healAmount = targetCard.heal(counterDamage);
        if (healAmount) board.addMessage(`${targetCard.name} siphons ${healAmount} HP.`);
    }
    return combatOver;
}

function handleRangedCombat(combatProps: CombatProps) {
    const { card, targetCard } = combatProps;
    const enemyCombatProps = calcEnemyCombatProps(combatProps);
    let combatOver = false;
    let firstStrike = false;
    let damageMod = 1;
    let targetDamageMod = 1;
    const [caIDs, taIDs, ctIDs, ttIDs] = [card.abilityIDs, targetCard.abilityIDs, card.traitIDs, targetCard.traitIDs];

    if (ttIDs.includes("DEMONIC") && ctIDs.includes("FIERY")) damageMod *= 0;
    if (ctIDs.includes("DEMONIC") && ttIDs.includes("FIERY")) targetDamageMod *= 0;
    if (ctIDs.includes("CONTRAPTION") && !ttIDs.includes("FIERY")) targetDamageMod *= 0.5;
    if (ttIDs.includes("CONTRAPTION") && !ctIDs.includes("FIERY")) damageMod *= 0.5;
    if (ttIDs.includes("IMMOBILE") && !caIDs.includes("SIEGE")) damageMod *= 0.5;
    if (ctIDs.includes("IMMOBILE") && !taIDs.includes("SIEGE")) targetDamageMod *= 0.5;
    if ((ttIDs.includes("CONTRAPTION") || ttIDs.includes("UNDEAD")) && ctIDs.includes("FIERY")) damageMod *= 2;
    if ((ctIDs.includes("CONTRAPTION") || ctIDs.includes("UNDEAD")) && ttIDs.includes("FIERY")) targetDamageMod *= 2;
    if ((ttIDs.includes("GIANT") || ttIDs.includes("IMMOBILE")) && caIDs.includes("SIEGE")) damageMod *= 2;
    if ((ctIDs.includes("GIANT") || ctIDs.includes("IMMOBILE")) && taIDs.includes("SIEGE")) targetDamageMod *= 2;

    if (caIDs.includes("BOMBARD") && !taIDs.includes("BOMBARD")) firstStrike = true;
    if (caIDs.includes("ASSASSINATE") && targetCard.wounded) {
        firstStrike = true;
        damageMod = 3;
    }

    handleRangedAttack(combatProps, damageMod);
    if (firstStrike) {
        combatOver = checkOpposingCardDead(combatProps);
    }
    if (!combatOver) {
        handleRangedAttack(enemyCombatProps, targetDamageMod);
        combatOver = checkOpposingCardDead(combatProps);
        combatOver = checkOpposingCardDead(enemyCombatProps);
    }
    return combatOver;
}

function handleRangedAttack(combatProps: CombatProps, damageMod: number = 1) {
    if (damageMod) damageMod = Math.max(0.5, Math.min(2, damageMod));
    const { card, targetCard, board } = combatProps;
    if (card.rangedAttack && damageMod) {
        const baseDmg = rollDie(card.rangedAttack);
        const dmg = Math.ceil(baseDmg * damageMod);
        if (dmg) {
            targetCard.hp -= dmg;
            board.addMessage(`${card.name} shoots ${targetCard.name}! -${baseDmg}${damageMod !== 1 ? `x${damageMod}` : ""} HP`);
        } else {
            board.addMessage(`${card.name} misses ${targetCard.name}!`);
        }
        return dmg;
    }
    return 0;
}

function handleMeleeAttack(combatProps: CombatProps, damageMod: number = 1) {
    if (damageMod) damageMod = Math.max(0.5, Math.min(2, damageMod));
    const { card, targetCard, board } = combatProps;
    if (card.attack && damageMod) {
        const baseDmg = rollDie(card.attack);
        const dmg = Math.ceil(baseDmg * damageMod);
        if (dmg) {
            targetCard.hp -= dmg;
            board.addMessage(`${card.name} hits ${targetCard.name}! -${baseDmg}${damageMod !== 1 ? `x${damageMod}` : ""} HP`);
        } else {
            board.addMessage(`${card.name} is blocked by ${targetCard.name}!`);
        }
        return dmg;
    }
    return 0;
}

function handleCleave(combatProps: CombatProps) {
    const { card, board, targetCardLocation, opposingDeck } = combatProps;
    const cleavedLocations = opposingDeck.getAdjacentCardLocations(targetCardLocation);
    const dmg = 1;
    for (const cleavedLocation of cleavedLocations) {
        if (!cleavedLocation.card) continue;
        cleavedLocation.card.hp -= dmg;
        board.addMessage(`${card.name} cleaves ${cleavedLocation.card.name}! (${dmg} dmg)`);
        checkOpposingCardDead(combatProps);
    }
}

function handleRend(combatProps: CombatProps) {
    const { card, opposingDeck, targetCardLocation, board } = combatProps;
    if (!targetCardLocation.card) throw new Error("rended card must exist!");
    opposingDeck.graveStack.removeCard(targetCardLocation.card);
    board.addMessage(`${card.name} rends ${targetCardLocation.card.name} to pieces!`);
}

function handleDevour(combatProps: CombatProps) {
    const { card, board, targetCardLocation } = combatProps;
    const healAmount = card.heal(card.maxHp);
    if (healAmount) board.addMessage(`${card.name} cannibalizes ${targetCardLocation.card!.name} for ${healAmount} HP!`);
}

function handleInfect(combatProps: CombatProps) {
    const { card, board, targetCardLocation, opposingDeck, deck, person } = combatProps;
    if (!targetCardLocation.card) throw new Error("enemy card must exist!");
    board.addMessage(`${card.name} infects ${targetCardLocation.card.name}! It becomes another ${card.name}!`);
    opposingDeck.graveStack.removeCard(targetCardLocation.card);
    const newCard = UnitCard.copy(card, person);
    deck.reserveStack.addCard(newCard, "bottom");
}

function handleUndeath(combatProps: CombatProps) {
    const { card, board, targetCardLocation, opposingDeck, deck } = combatProps;
    if (!targetCardLocation.card) throw new Error("enemy card must exist!");
    let destroy: boolean = false;
    if (card.traitIDs.includes("DIVINE")) {
        board.addMessage(`${targetCardLocation.card.name} is destroyed by ${card.name}'s divine might!`);
        destroy = true;
    } else if (card.traitIDs.includes("FIERY")) {
        board.addMessage(`${targetCardLocation.card.name} is destroyed by ${card.name}'s fire!`);
        destroy = true;
    }
    opposingDeck.graveStack.removeCard(targetCardLocation.card);
    if (destroy) return;
    deck.reserveStack.addCard(targetCardLocation.card, "bottom");
}

function checkOpposingCardDead(combatProps: CombatProps): boolean {
    const { targetCard, deck, board, targetCardLocation } = combatProps;
    if (targetCard.dead) {
        board.addMessage(`${targetCard.name} dies!`);
        if (targetCardLocation.deckArea == DeckArea.Hand) deck.buryCard(targetCardLocation.index);
        return true;
    }
    return false;
}
