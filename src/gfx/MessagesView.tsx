import { useEffect, useRef, useState } from "react";

export function MessagesView({ messages }: { messages: string[] }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const logRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [messages.length]); // scroll every time messages change


    return (
        <div
            style={{
                maxHeight: '90vh', height: '90vh', overflowY: 'hidden', overflowX: 'hidden',
                maxWidth: isExpanded ? '100%' : '35px', width: isExpanded ? '100%' : '35px'
            }} className="flex flex-col" >
            <div className="w-[35px]">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 self-end text-gray-700 hover:text-gray-900"
                >
                    {isExpanded ? "🔽" : "🔼"} {/* down = expanded, up = collapsed */}
                </button>
            </div>
            <div ref={logRef} className="flex-1" style={{ maxHeight: '90vh', height: '90vh', overflowY: 'hidden', display: isExpanded ? 'block' : 'none' }}>{messages.map((msg, index) => (
                <div
                    key={index}
                    className="text-sm text-gray-800 mb-4 last:mb-0"
                >
                    {msg}
                </div>
            ))}</div>
        </div >
    );
}