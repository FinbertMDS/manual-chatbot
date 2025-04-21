import React, { useState } from 'react';

const ChatBox = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    const userMsg = { role: 'user', text: input };
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: input })
    });
    const data = await res.json();
    const botMsg = { role: 'bot', text: data.answer };
    setMessages([...messages, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div>
      <div className="border p-4 h-64 overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>{msg.text}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} className="border p-2 flex-grow" />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2">Send</button>
      </div>
    </div>
  );
};

export default ChatBox;