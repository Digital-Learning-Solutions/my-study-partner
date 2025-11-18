import React, { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { X, Send, Bot } from "lucide-react";
import { useStoredContext } from "../context/useStoredContext";
import { Copy } from "lucide-react";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const { saaraOpen, setSaaraOpen, saaraPrompt } = useStoredContext();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (saaraOpen) {
      setMessages([]);
      if (saaraPrompt) {
        setInput(saaraPrompt);
      }
    }
  }, [saaraOpen]);
  function cleanAnswer(text) {
    return text
      .replace(/[*_]{1,3}/g, "") // remove stray bold/italic
      .replace(/\n{2,}/g, "\n") // remove extra blank lines
      .replace(/^\s+|\s+$/g, "") // trim spaces
      .replace(/[*]{2,}/g, "") // remove double stars
      .replace(/州米/g, "") // remove random characters
      .replace(/([a-z])([A-Z])/g, "$1 $2"); // insert spaces if needed
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const prompt = input;
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostory: messages, prompt }),
      });

      const data = await res.json();

      const botMsg = {
        sender: "bot",
        text: data.answer || "Something went wrong.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("ChatBot error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Server error." },
      ]);
    }
  };

  return (
    <>
      {/* Floating AI BOT ICON */}
      {/* Floating AI BOT ICON */}
      {!saaraOpen && (
        <div className="fixed bottom-8 right-8 flex flex-col items-center gap-2 z-40">
          {/* Glowing AI Button (reduced size & glow) */}
          <button
            onClick={() => setSaaraOpen(true)}
            className="
        p-4 rounded-full shadow-xl relative
        bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600
        hover:scale-105 active:scale-95
        transition-all duration-300 ease-out
      "
            style={{
              boxShadow:
                "0 0 12px rgba(99,102,241,0.5), 0 0 20px rgba(139,92,246,0.45)",
            }}
          >
            <Bot
              size={26}
              className="
          text-white 
          drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]
        "
            />
          </button>

          {/* Text below the icon */}
          <div
            className="
        px-3 py-1 text-xs font-medium
        rounded-lg shadow-md 
        bg-white/90 dark:bg-slate-800/90 
        text-slate-800 dark:text-white
        backdrop-blur-md border border-gray-200 dark:border-slate-700
        animate-slide-up opacity-90
      "
          >
            Ask Saara 🤖
          </div>
        </div>
      )}

      {/* Expanded Chat Modal */}
      {saaraOpen && (
        <Rnd
          default={{
            x: window.innerWidth - 480, // slightly to the left of icon
            y: window.innerHeight - 500, // above the icon
            width: 400,
            height: 520,
          }}
          minWidth={320}
          minHeight={350}
          bounds="window"
          className="fixed z-50"
        >
          <div
            className="
              flex flex-col h-full rounded-2xl overflow-hidden
              backdrop-blur-3xl border border-white/20 
              bg-slate-300 dark:bg-slate-900/70
              shadow-2xl
            "
          >
            {/* Header */}
            {/* Header */}
            <div
              className="
    p-4 flex justify-between items-center
    bg-gradient-to-r from-indigo-600 to-purple-600
    text-white shadow-md cursor-move
  "
            >
              <h2 className="font-semibold tracking-wide flex items-center gap-2">
                <Bot size={20} className="opacity-90" /> Saara – Your Assistant
              </h2>
              <button
                onClick={() => setSaaraOpen(false)}
                className="hover:text-red-300 transition"
              >
                <X />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg, i) => {
                const isBot = msg.sender === "bot";
                const cleaned = isBot ? cleanAnswer(msg.text) : msg.text;

                return (
                  <div
                    key={i}
                    className={`relative p-3 rounded-xl shadow-sm max-w-[80%] ${
                      msg.sender === "user"
                        ? "ml-auto bg-indigo-600 text-white"
                        : "mr-auto bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white"
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {cleaned}
                    </div>

                    {/* COPY BUTTON HERE */}
                    {isBot && (
                      <button
                        onClick={() => navigator.clipboard.writeText(cleaned)}
                        className="absolute top-2 right-2 p-1 rounded-md hover:bg-white/20 dark:hover:bg-black/20 transition text-xs"
                      >
                        <Copy size={14} />
                      </button>
                    )}
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="p-3 border-t border-white/30 dark:border-slate-700/40 flex items-center gap-2 bg-white/40 dark:bg-slate-900/30 backdrop-blur-lg">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask something..."
                className="
                  flex-grow px-3 py-2 rounded-lg
                  bg-white/80 dark:bg-slate-800/70
                  border border-gray-300 dark:border-slate-600
                  outline-none dark:text-white
                "
              />

              <button
                onClick={handleSend}
                className="
                  p-2 rounded-lg text-white bg-indigo-600 
                  hover:bg-indigo-700 transition shadow-md
                "
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </Rnd>
      )}
    </>
  );
}
