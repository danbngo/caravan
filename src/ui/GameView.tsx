import { useContext } from "react";
import { CombatBoard } from "./CombatBoard/CombatBoard";
import { CreateCharacterMenu } from "./TitleMenu/CreateCharacterMenu";
import { TitleMenu } from "./TitleMenu/TitleMenu";
import { UIContext } from "./UIContext";

export function GameView() {
    const { uiMode } = useContext(UIContext);
    console.log("game view reloaded:", uiMode);

    return uiMode == "Title" ? (
        <TitleMenu />
    ) : uiMode == "Create Character" ? (
        <CreateCharacterMenu />
    ) : uiMode == "Combat" ? (
        <CombatBoard />
    ) : (
        <div>Unrecognized game mode.</div>
    );
}
