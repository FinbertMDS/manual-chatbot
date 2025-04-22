import { useEffect, useRef, useState } from "react";

const ChatBox = () => {
  const [manuals, setManuals] = useState([]);
  const [selectedManual, setSelectedManual] = useState(null); // null = all
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchManuals = async () => {
      try {
        const res = await fetch("/api/manuals");
        const data = await res.json();
        setManuals(data);
        if (data.length > 0) setSelectedManual(data[0].id);
      } catch (error) {
        console.error("Failed to fetch manuals:", error);
        setSelectedManual(null); // fallback to search all
      }
    };
    fetchManuals();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, manualId: selectedManual }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.answer || "Không có câu trả lời." },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-blue-600 text-white text-xl font-bold px-4 py-2 shadow">
        Manual Chatbot
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-2xl ${
              msg.role === "user" ? "ml-auto text-right" : "text-left"
            }`}
            dangerouslySetInnerHTML={{ __html: msg.content }}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t p-3 bg-white flex flex-col sm:flex-row gap-2">
        {manuals.length > 0 && (
          <select
            className="border p-2 rounded w-full sm:w-1/4"
            value={selectedManual || ""}
            onChange={(e) => setSelectedManual(e.target.value)}
          >
            <option value="">🔍 Tất cả manuals</option>
            {manuals.map((m) => (
              <option key={m.id} value={m.id}>
                📄 {m.name || m.source || m.id}
              </option>
            ))}
          </select>
        )}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="border flex-1 rounded p-2"
          placeholder="Nhập câu hỏi..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
