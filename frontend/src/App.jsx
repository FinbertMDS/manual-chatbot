import React, { useState } from 'react';
import ChatBox from './components/ChatBox';

function App() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manual Chatbot</h1>
      <ChatBox />
    </div>
  );
}

export default App;