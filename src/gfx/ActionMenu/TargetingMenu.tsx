import { ActionButton } from "../Common/ActionButton";
import { useContext } from "react";
import { UIStateContext } from "../Common/UIContext";

export function TargetingMenu() {
    const { targetingAction, setTargetingAction, setTargetCardLocations } = useContext(UIStateContext);

    return (
        <div className="flex w-full items-center justify-between p-4">
            <div className="text-lg font-bold text-gray-800">{`${targetingAction}: Choose target`}</div>
            <div className="w-[200px]">
                <ActionButton
                    label="Cancel"
                    action="Cancel"
                    onAction={() => {
                        setTargetingAction(undefined);
                        setTargetCardLocations(undefined);
                    }}
                />
            </div>
        </div>
    );
}
