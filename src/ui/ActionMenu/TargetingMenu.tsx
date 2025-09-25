import { ActionButton } from "../Common/ActionButton";
import { useContext } from "react";
import { UIContext } from "../UIContext";

export function TargetingMenu() {
    const { targetingAction, setTargetingAction, setTargetCardLocations } = useContext(UIContext);

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
