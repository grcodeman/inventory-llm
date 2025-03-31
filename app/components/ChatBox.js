"use client";
import { useState } from 'react';
import { FiMic, FiCheck } from 'react-icons/fi';

// Render API blocks with checkmark
const ApiBlock = ({ content }) => {
  const [confirmed, setConfirmed] = useState(false);
  const handleConfirm = () => setConfirmed(true);

  return (
    <div
      style={{
        backgroundColor: confirmed ? 'grey' : 'var(--api-block-bg)',
        padding: '10px',
        margin: '8px 0',
        fontFamily: 'monospace',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background-color 0.3s ease',
      }}
    >
      <span>{content}</span>
      <button
        onClick={handleConfirm}
        style={{
          marginLeft: '8px',
          cursor: 'pointer',
          backgroundColor: confirmed ? 'grey' : 'green',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FiCheck />
      </button>
    </div>
  );
};

// Chatbox UI/logic
export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Function to extract API blocks
  const renderMessageContent = (content) => {
    // Split content on any {}
    const parts = content.split(/({[^}]+})/g);
    return parts.map((part, idx) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        // Remove {}
        const blockContent = part.slice(1, -1);
        return <ApiBlock content={blockContent} key={idx} />;
      }
      // Return as span
      return <span key={idx}>{part}</span>;
    });
  };

  // Speech-to-text using the Web Speech API
  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // User message
    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      // Prep call conversation
      const conversation = [
        {
          role: "system",
          content:
            "You are an Inventory Management Virtual Assistant. Your role is to interpret user commands (via text or voice) to update an inventory system. You are provided with a JSON object containing current inventory details and have access to internal API blocks for making changes. Your response should extract the necessary actions from the user's request and return them as UI action blocks, formatted within curly braces {}.\n\nThe available API blocks are:\n\ncreate(name, amt, loc): Create a new inventory item with the specified name, amount, and location.\ndelete(itm): Remove an existing inventory item.\n\nmove(itm, loc1, loc2): Move an inventory item from one location to another.\n\nset(itm, amt): Set the inventory amount for an item to a specific value.\n\nchange(itm, increment): Increase or decrease an inventory item’s amount by the given increment.\n\nWhen a user issues a command, analyze the command, determine the required operations, and generate a response that:\n\n- Summarizes the intended changes.\n- Lists the corresponding API action blocks.\n- Asks the user to confirm the actions.\nAlso make sure to place new line chars for more readability between api blocks and text."
        },
        {
          role: "user",
          content: [
              {
                  type: "text",
                  text: "hey can you add 10 sausages to my freezer and im increasing my waffles by 5"
              }
          ]
        },
        {
          role: "assistant",
          content: [
              {
                  type: "text",
                  text: "Got it, let me help you update your inventory.\n{create: \"sausage\", 10, \"freezer\"}\n{change: \"waffle\", 5}\nApprove those above changes if they look correct."
              }
          ]
        },
        userMessage,
      ];

      // Call API
      const resApi = await fetch('/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: conversation }),
      });
      const data = await resApi.json();

      // Extract reply from API response
      const assistantContent = data.choices[0].message.content;
      const assistantMessage = { role: 'assistant', content: assistantContent };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      padding: '1rem'
    }}>
      <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Assistant</h2>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '6px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '1rem',
          padding: '1rem'
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              maxWidth: '70%',
              margin: '0.5rem 0',
              padding: '0.75rem',
              backgroundColor: msg.role === 'user' ? 'var(--user-bubble-bg)' : 'var(--assistant-bubble-bg)',
              borderRadius: '15px',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              wordWrap: 'break-word'
            }}
          >
            {renderMessageContent(msg.content)}
          </div>
        ))}
      </div>

      {/* Form to submit new messages */}
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flexGrow: 1,
            fontSize: '1rem',
            padding: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            outline: 'none'
          }}
        />
        <button
          type="button"
          onClick={handleMicClick}
          style={{
            fontSize: '1rem',
            padding: '0.75rem',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FiMic />
        </button>
        <button
          type="submit"
          style={{
            fontSize: '1rem',
            padding: '0.75rem 1rem',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: 'green',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
