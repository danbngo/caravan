import { ReactNode } from "react";
import { ActionButton, ActionButtonProps } from "./ActionButton";

// Generalized props
export type TitleButton = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
};

export type TitleScreenProps = {
    title: string;
    headingLevel?: 1 | 2 | 3 | 4;
    content?: ReactNode;
    buttonProps: ActionButtonProps[];
};

export function Container({ title, headingLevel = 1, content, buttonProps }: TitleScreenProps) {
    const HeadingTag = headingLevel == 1 ? "h1" : "h2";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900 to-amber-900 p-6">
            <div className="w-full max-w-3xl backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 md:p-12">
                <header className="flex flex-col items-center text-center gap-4">
                    <HeadingTag
                        className="select-none font-extrabold tracking-tight leading-tight text-amber-50 drop-shadow-lg"
                        style={{ fontFamily: "Cinzel, serif" }}
                    >
                        {title}
                    </HeadingTag>
                    {content && <div className="text-sm md:text-base text-amber-100/80 max-w-xl">{content}</div>}
                </header>

                <div className="my-8 flex items-center justify-center">
                    <span className="h-0.5 w-32 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 opacity-80 rounded-full" />
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    {buttonProps.map((props, i) => (
                        <ActionButton {...props} key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
