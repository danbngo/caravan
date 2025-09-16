import { JSX } from "react";
import { CardDisplayState } from "../enums";

export function CardWrapper({
    onClick,
    children,
    isSelected,
    isTargeted,
    title,
    displayState,
    redTint
}: {
    onClick?: () => void | undefined;
    isSelected?: boolean | undefined;
    isTargeted?: boolean | undefined;
    children?: (JSX.Element | false | undefined)[];
    title?: string | undefined;
    displayState?: CardDisplayState;
    redTint?: number | undefined;
}) {
    redTint = redTint ? Math.round(redTint * 50) / 100 : 0;
    const redTintColor = `radial-gradient(
        circle,
        transparent 25%,
        rgba(${redTint >= 1 ? 0 : 255}, 0, 0, ${redTint}) 100%
    )`;

    const bgColorClass =
        displayState == CardDisplayState.Reserve || displayState == CardDisplayState.Tapped
            ? "bg-gray-300"
            : displayState == CardDisplayState.Dead || displayState == CardDisplayState.Empty
              ? "bg-gray-400"
              : "bg-gray-100";

    const shadowColorClass = isSelected
        ? "border-blue-500 shadow-lg shadow-blue-400"
        : isTargeted
          ? "border-yellow-500 shadow-lg shadow-yellow-400"
          : "border-gray-400";

    const titleIcon =
        displayState == CardDisplayState.Tapped
            ? "🛡️"
            : displayState == CardDisplayState.Reserve
              ? "💤"
              : displayState == CardDisplayState.Dead
                ? "💀"
                : displayState == CardDisplayState.Empty
                  ? "⋯"
                  : "";

    return (
        <div className={`relative w-32 h-48 ${shadowColorClass}`}>
            <div className={`z-10 absolute h-full w-full inset-0 rounded-xl ${bgColorClass}`}></div>
            <div className="z-20 absolute h-full w-full inset-0 rounded-xl" style={{ background: redTintColor }} />
            <div
                onClick={() => {
                    console.log("card wrapper clicked. onclick:", onClick);
                    if (onClick) onClick();
                }}
                className={`
        relative z-30 h-full w-full p-2 border rounded-xl
    `}
            >
                {title ? <div className="text-center">{`${title}${titleIcon}`}</div> : null}
                {children}
            </div>
        </div>
    );
}
