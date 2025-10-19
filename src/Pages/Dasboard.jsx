// Dasboard.jsx - Updated with unified styling
import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const DashBoard = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-pro" });

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const result = await model.generateContent(input);
            const reply = result.response.text();
            setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: "⚠️ Something went wrong!" },
            ]);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
            <div className="w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl shadow-cyan-500/20 border border-cyan-400/20 flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 bg-slate-850 border-b border-cyan-400/20">
                    <h1 className="text-2xl font-bold text-cyan-400 text-center">NeonChat AI</h1>
                    <p className="text-slate-400 text-center text-sm">Powered by Gemini</p>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[60vh]">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-xl max-w-[85%] ${msg.sender === "user"
                                ? "bg-fuchsia-600 self-end ml-auto shadow-lg shadow-fuchsia-500/30"
                                : "bg-slate-700 self-start shadow-lg shadow-cyan-500/20 border border-cyan-400/10"
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    {loading && (
                        <div className="text-cyan-400 italic flex items-center">
                            <div className="animate-pulse mr-2">✦</div>
                            Gemini is thinking...
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 bg-slate-850 border-t border-cyan-400/20 flex">
                    <input
                        type="text"
                        className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-slate-600"
                        placeholder="Ask Gemini anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className="ml-3 bg-fuchsia-600 hover:bg-fuchsia-700 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;