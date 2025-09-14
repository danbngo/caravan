import "./index.css";
import { createRoot } from "react-dom/client";
import { CombatBoard } from "./gfx/CombatBoard";
import { UIStateContextProvider } from "./gfx/UIContext";
import { startTestGame } from "./test";

startTestGame();

function App() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-gray-200 to-teal-100">
            <UIStateContextProvider>
                <CombatBoard />
            </UIStateContextProvider>
        </div>
    );
}

const container = document.getElementById("app")!;
const root = createRoot(container);
root.render(<App />);
