import "./index.css";
import { createRoot } from "react-dom/client";
import { UIContextProvider } from "./ui/UIContext";
import { startTestGame } from "./test";
import { GameView } from "./ui/GameView";

startTestGame();

function App() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-gray-200 to-teal-100">
            <UIContextProvider>
                <GameView />
            </UIContextProvider>
        </div>
    );
}

const container = document.getElementById("app")!;
const root = createRoot(container);
root.render(<App />);
