"use client";
import { useState } from 'react';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // user message
    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      // prep call
      const conversation = [
        {
          role: "system",
          content:
            "You are an Inventory Management Virtual Assistant. Your role is to interpret user commands (via text or voice) to update an inventory system. You are provided with a JSON object containing current inventory details and have access to internal API blocks for making changes. Your response should extract the necessary actions from the user's request and return them as UI action blocks, formatted within curly braces {}.\n\nThe available API blocks are:\n\ncreate(name, amt, loc): Create a new inventory item with the specified name, amount, and location.\ndelete(itm): Remove an existing inventory item.\n\nmove(itm, loc1, loc2): Move an inventory item from one location to another.\n\nset(itm, amt): Set the inventory amount for an item to a specific value.\n\nchange(itm, increment): Increase or decrease an inventory item’s amount by the given increment.\n\nWhen a user issues a command, analyze the command, determine the required operations, and generate a response that:\n\n- Summarizes the intended changes.\n- Lists the corresponding API action blocks.\n- Asks the user to confirm the actions."
        },
        userMessage,
      ];

      // call api
      const resApi = await fetch('/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: conversation }),
      });
      const data = await resApi.json();

      // extract reply from api response
      const assistantContent = data.choices[0].message.content;
      const assistantMessage = { role: 'assistant', content: assistantContent };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  return (
    <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2>Chat</h2>
      <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          border: '1px solid #ccc',
          marginBottom: '1rem',
          padding: '0.5rem'
        }}>
        {messages.map((msg, index) => (
          <div key={index}
            style={{
              maxWidth: '70%',
              margin: '0.5rem 0',
              padding: '0.75rem',
              backgroundColor: msg.role === 'user' ? 'var(--user-bubble-bg)' : 'var(--assistant-bubble-bg)',
              borderRadius: '15px',
              marginLeft: msg.role === 'user' ? 'auto' : '0',
              textAlign: msg.role === 'user' ? 'right' : 'left'
            }}>
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex' }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flexGrow: 1, marginRight: '0.5rem' }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
