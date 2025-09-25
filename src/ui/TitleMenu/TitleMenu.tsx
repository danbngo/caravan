import { useContext } from "react";
import { ActionButtonProps } from "../Common/ActionButton";
import { Container } from "../Common/Container";
import { UIContext } from "../UIContext";

export function TitleMenu() {
    const { setUIMode } = useContext(UIContext);

    function onAction(action: string) {
        if (action == "New Game") {
            console.log("new game");
            setUIMode("Create Character");
        }
        if (action == "Continue") {
            console.log("continue");
        }
    }

    const buttonProps: ActionButtonProps[] = [
        {
            label: "New Game",
            action: "New Game",
            onAction
        },
        {
            label: "Continue",
            action: "Continue",
            onAction,
            disabledReason: "[No saved game]"
        }
    ];

    return (
        <Container
            title="Caravan"
            headingLevel={1}
            content="Lead your caravan across hostile lands — gather resources, survive hazards, and build a legacy."
            buttonProps={buttonProps}
        />
    );
}
