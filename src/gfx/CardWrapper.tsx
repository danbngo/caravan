import { JSX } from "react";
import { CardDisplayState } from "../enums";



export function CardWrapper({ onClick, children, isSelected, isTargeted, title, displayState }: {
    onClick?: Function | undefined,
    isSelected?: boolean | undefined,
    isTargeted?: boolean | undefined,
    children?: (JSX.Element | false | undefined)[],
    title?: string | undefined,
    displayState?: CardDisplayState
}) {
    const shadeClass =
        displayState == CardDisplayState.Reserve || displayState == CardDisplayState.Tapped
            ? "bg-gray-300"
            : displayState == CardDisplayState.Dead || displayState == CardDisplayState.Empty ?
                "bg-gray-400"
                : "bg-gray-100";

    const titleIcon =
        displayState == CardDisplayState.Tapped
            ? '🛡️'
            : displayState == CardDisplayState.Reserve
                ? '💤'
                : displayState == CardDisplayState.Dead
                    ? '💀'
                    : displayState == CardDisplayState.Empty
                        ? '⋯'
                        : ''

    return <div
        onClick={() => {
            if (onClick) onClick()
        }}
        style={{ width: '8rem', height: '12rem', padding: '4px' }}
        className={`
        w-40 p-3 border rounded-xl shadow-md transition-transform
         ${shadeClass}
         ${isSelected ? "border-blue-500 shadow-lg shadow-blue-400"
                : isTargeted ? "border-yellow-500 shadow-lg shadow-yellow-400"
                    : "border-gray-400"
            }
    `}
    >
        {title ? <div className="text-center">{`${title}${titleIcon}`}</div> : null}
        {children}
    </div>
}
