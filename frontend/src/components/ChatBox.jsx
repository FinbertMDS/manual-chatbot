import React, { useState } from 'react';

const ChatBox = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages([...messages, userMsg]);

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();
      const botMsg = { role: 'bot', text: data.answer };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'bot', text: '❌ Lỗi kết nối đến server' }]);
    }

    setInput('');
  };

  return (
    <div>
      <div className="border p-4 h-64 overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-right text-blue-600' : 'text-left text-gray-800'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 flex-grow"
          placeholder="Nhập câu hỏi..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2">Gửi</button>
      </div>
    </div>
  );
};

export default ChatBox;
