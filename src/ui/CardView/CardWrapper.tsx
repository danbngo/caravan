import { JSX } from "react";
import { CardDisplayState } from "../../enums";

export function CardWrapper({
    onClick,
    children,
    isSelected,
    isTargeted,
    title,
    description,
    displayState,
    redTint,
    crown,
    borderColor
}: {
    onClick?: () => void | undefined;
    isSelected?: boolean | undefined;
    isTargeted?: boolean | undefined;
    children?: (JSX.Element | false | undefined)[];
    title?: string | undefined;
    description?: string | undefined;
    displayState?: CardDisplayState;
    redTint?: number | undefined;
    crown?: JSX.Element | undefined | null | string;
    borderColor?: "red" | "blue" | undefined;
}) {
    redTint = redTint ? Math.round(redTint * 50) / 100 : 0;

    const borderColorClass =
        borderColor == "red" ? "border-red-400" : borderColor == "blue" ? "border-blue-400" : "border-black-400";
    const redTintColor = `radial-gradient(
        circle,
        transparent 25%,
        rgba(${redTint >= 1 ? 0 : 255}, 0, 0, ${redTint}) 100%
    )`;

    const bgColorClass =
        displayState == CardDisplayState.Tapped || displayState == CardDisplayState.Idle
            ? "bg-gray-300"
            : displayState == CardDisplayState.Dead || displayState == CardDisplayState.Empty
              ? "bg-gray-400"
              : "bg-gray-100";

    const shadowColorClass = isSelected
        ? "shadow-md shadow-green-500"
        : isTargeted
          ? "shadow-md shadow-yellow-500"
          : "shadow-md shadow-gray-900";

    /*const titleIcon =
        displayState == CardDisplayState.Tapped
            ? "🛡️"
            : displayState == CardDisplayState.Idle
              ? "💤"
              : displayState == CardDisplayState.Dead
                ? "💀"
                : displayState == CardDisplayState.Empty
                  ? "⋯"
                  : "";*/

    return (
        <div className={`relative w-28 h-36`}>
            {crown ? <div className="z-50 absolute left-1/2 -translate-x-1/2 -top-[24px]">{crown}</div> : null}
            <div className={`z-10 absolute h-full w-full inset-0 rounded-xl ${bgColorClass}`}></div>
            <div className="z-20 absolute h-full w-full inset-0 rounded-xl" style={{ background: redTintColor }} />
            <div
                onClick={() => {
                    console.log("card wrapper clicked. onclick:", onClick);
                    if (onClick) onClick();
                }}
                className={`
        relative z-30 h-full w-full p-2 border rounded-xl ${borderColorClass} ${shadowColorClass}
    `}
            >
                {title ? <div className="text-xs cursor-pointer" title={description || ""}>{`${title}`}</div> : null}
                {children}
            </div>
        </div>
    );
}
