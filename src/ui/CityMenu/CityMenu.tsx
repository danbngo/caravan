import { useContext, useRef } from "react";
import { ActionButtonProps } from "../Common/ActionButton";
import { Container } from "../Common/Container";
import { UIContext } from "../UIContext";
import { HandView } from "../CardView/HandView";
import { ALL_GENERAL_CARDS } from "../../defs/GENERAL_CARDS";
import { UnitCard } from "../../classes/UnitCard";
import { gs } from "../../classes/Game";
import { Deck } from "../../classes/Deck";
import { Person } from "../../classes/Person";

export function CreateCharacterMenu() {
    const { setUIMode, selectedCard, setSelectedCard } = useContext(UIContext);
    const selectableCardsRef = useRef(ALL_GENERAL_CARDS.map((c) => UnitCard.copy(c)));

    function onAction(action: string) {
        if (action == "Back") {
            setUIMode("Title");
        }
        if (action == "Continue") {
            if (!selectedCard) throw new Error("card shouldve been selected!");
            gs.player = new Person({ name: "Player", gold: 10, maxMp: 10 });
            gs.player.deck = new Deck({ owner: gs.player, general: UnitCard.copy(selectedCard) });
            console.log("continue");
        }
    }

    const buttonProps: ActionButtonProps[] = [
        {
            label: "Back",
            action: "Back",
            onAction
        },
        {
            label: "Continue",
            action: "Continue",
            onAction,
            disabledReason: !selectedCard ? "[Must select a card]" : undefined
        }
    ];

    function onClickCard(card: UnitCard) {
        console.log("card clicked:", card);
        setSelectedCard(card);
    }

    console.log("selected card:", selectedCard, selectedCard ? selectableCardsRef.current.indexOf(selectedCard) : undefined);

    const content = (
        <div>
            <div>Choose one of the following:</div>
            <br></br>
            <HandView
                cards={selectableCardsRef.current}
                onClickCard={onClickCard}
                selectedCardIndex={selectedCard ? selectableCardsRef.current.indexOf(selectedCard) : undefined}
            />
        </div>
    );

    return <Container title="Create Character" headingLevel={1} content={content} buttonProps={buttonProps} />;
}
