export interface ActionButtonProps {
    label: string;
    action: string;
    disabledReason?: string | undefined;
    warningReason?: string | undefined;
    onAction: (action: string) => void;
}

export function ActionButton(props: ActionButtonProps) {
    const { label, action, disabledReason, warningReason, onAction } = props;
    const className = `w-64 md:w-48 py-3 px-6 rounded-xl font-semibold shadow-lg transform transition focus:outline-none focus:ring-4
${
    disabledReason && disabledReason.length > 0
        ? "bg-white/10 text-amber-100 pointer-events-none opacity-60"
        : "bg-amber-400/95 text-slate-900 hover:-translate-y-0.5 hover:scale-[1.02] focus:ring-amber-300/30"
}`;
    return (
        <button
            className={className}
            title={disabledReason || warningReason}
            key={action}
            disabled={!action || disabledReason !== undefined}
            onClick={() => {
                if (action) onAction(action);
            }}
        >
            {`${disabledReason ? disabledReason : label}`}
        </button>
    );
}
