export interface ActionButtonProps {
    label: string;
    action: string;
    disabledReason?: string | undefined;
    warningReason?: string | undefined;
    onAction: (action: string) => void;
}

export function ActionButton(props: ActionButtonProps) {
    const { label, action, disabledReason, warningReason, onAction } = props;
    return (
        <button
            className={
                disabledReason
                    ? "w-full px-4 py-2 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
                    : warningReason
                      ? "w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-500"
                      : "w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            }
            title={disabledReason || warningReason}
            key={action}
            disabled={!action || disabledReason !== undefined}
            onClick={() => action && onAction(action)}
        >
            {`${disabledReason ? disabledReason : label}`}
        </button>
    );
}
