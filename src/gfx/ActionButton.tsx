export function ActionButton({
    label,
    disabledReason,
    action,
    onAction,
}: {
    label: string;
    disabledReason?: string | undefined;
    action: string;
    onAction: (action: string) => void;
}) {
    return (
        <button
            className={
                disabledReason
                    ? "w-full px-4 py-2 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            }
            title={disabledReason}
            key={action}
            disabled={!action || disabledReason !== undefined}
            onClick={() => action && onAction(action)}
        >
            {`${disabledReason ? disabledReason : label}`}
        </button>
    );
}
