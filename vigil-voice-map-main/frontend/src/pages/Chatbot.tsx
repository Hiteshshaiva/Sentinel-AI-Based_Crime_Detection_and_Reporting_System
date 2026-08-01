import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { analyzeCrime, addReport, type CrimeType } from "@/lib/crime-store";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

type ChatState = "idle" | "awaiting_location" | "awaiting_coords" | "awaiting_description" | "done";

interface PendingReport {
  crime_type: CrimeType;
  location: string;
  description: string;
  latitude: number;
  longitude: number;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: "SENTINEL AI active. Describe the incident you'd like to report. I'll classify it and guide you through filing.",
    },
  ]);
  const [input, setInput] = useState("");
  const [chatState, setChatState] = useState<ChatState>("idle");
  const [pending, setPending] = useState<Partial<PendingReport>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMsg = (role: "user" | "assistant", content: string) => {
  setMessages((prev) => [
    ...prev,
    {
      id: Date.now().toString() + Math.random(),
      role,
      content,
    },
  ]);
};

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    addMsg("user", text);

    setTimeout(async () => {
      if (chatState === "idle") {
        const crimeType = analyzeCrime(text);
        setPending({ crime_type: crimeType, description: text });
        addMsg(
          "assistant",
          `Incident classified as **${crimeType.toUpperCase()}**. Provide the location name (e.g., "Downtown Plaza, 5th Ave").`
        );
        setChatState("awaiting_location");
      } else if (chatState === "awaiting_location") {
        setPending((p) => ({ ...p, location: text }));
        addMsg(
          "assistant",
          `Location recorded: **${text}**. Enter approximate coordinates as "lat, lng" (e.g., "40.7128, -74.0060"), or type "skip" for defaults.`
        );
        setChatState("awaiting_coords");
      } else if (chatState === "awaiting_coords") {
        let lat = 40.7128 + (Math.random() - 0.5) * 0.02;
        let lng = -74.006 + (Math.random() - 0.5) * 0.02;
        if (text.toLowerCase() !== "skip") {
          const parts = text.split(",").map((s) => parseFloat(s.trim()));
          if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            lat = parts[0];
            lng = parts[1];
          }
        }
        setPending((p) => ({ ...p, latitude: lat, longitude: lng }));
        addMsg("assistant", "Any additional details to add? Type your description or 'none'.");
        setChatState("awaiting_description");
      } else if (chatState === "awaiting_description") {
        const desc = text.toLowerCase() === "none" ? pending.description || "" : text;
        const report = await addReport({
  crime_type: pending.crime_type || "other",
  location: pending.location || "Unknown",
  description: desc,
  latitude: pending.latitude || 40.7128,
  longitude: pending.longitude || -74.006,
});

if (!report) {
  addMsg(
    "assistant",
    "❌ Failed to submit the report. Please try again."
  );
  return;
}

addMsg(
  "assistant",
  `✓ Report filed successfully.

ID: ${report.id.substring(0, 8)}
Type: ${report.crime_type}
Location: ${report.location}
Time: ${new Date(report.timestamp).toLocaleString()}

Report another incident or close this session.`
);
        setChatState("idle");
        setPending({});
      }
    }, 200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <div className="border-b border-border px-6 py-3">
        <h1 className="text-sm font-semibold">AI Crime Report — Chat Interface</h1>
        <p className="text-xs text-muted-foreground">Automated incident classification and filing</p>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`max-w-lg ${msg.role === "user" ? "ml-auto" : ""}`}
            >
              <div
                className={`text-body px-4 py-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card shadow-card"
                }`}
              >
                {msg.content.split("\n").map((line, i) => (
                  <p key={i} className={i > 0 ? "mt-1" : ""}>
                    {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                      j % 2 === 1 ? (
                        <strong key={j}>{part}</strong>
                      ) : (
                        <span key={j}>{part}</span>
                      )
                    )}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border p-4">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe the incident..."
            className="flex-1 bg-input rounded-sm px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleSend}
            className="bg-primary text-primary-foreground rounded-sm px-4 py-2.5 hover:opacity-90 transition-opacity"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
