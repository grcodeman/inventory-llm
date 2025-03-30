"use client";
import { useState } from 'react';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, input.trim()]);
      setInput('');
    }
  };

  return (
    <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2>Chat</h2>
      <div
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          border: '1px solid #ccc',
          marginBottom: '1rem',
          padding: '0.5rem'
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
            {msg}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex' }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flexGrow: 1 }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
