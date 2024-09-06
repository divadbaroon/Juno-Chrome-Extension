import { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom/client';
import { Input } from "../../../shadcn/components/input"
import { Button } from "../../../shadcn/components/button"
import { Send } from "lucide-react"

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

function SimpleChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I assist you today?", sender: 'ai' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = { id: messages.length + 1, text: input, sender: 'user' };
      setMessages([...messages, newMessage]);
      setInput('');
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = { id: messages.length + 2, text: "I'm an AI assistant. How can I help you?", sender: 'ai' };
        setMessages(prevMessages => [...prevMessages, aiResponse]);
      }, 1000);
    }
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{padding: '20px', borderBottom: '1px solid #eee'}}>
        <h2>Chat Interface</h2>
      </div>
      <div style={{flex: 1, overflowY: 'auto', padding: '20px'}}>
        {messages.map((message) => (
          <div 
            key={message.id} 
            style={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '10px'
            }}
          >
            <div 
              style={{
                maxWidth: '70%',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: message.sender === 'user' ? '#007bff' : '#f0f0f0',
                color: message.sender === 'user' ? 'white' : 'black'
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{padding: '20px', borderTop: '1px solid #eee'}}>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

function renderApp() {
  const container = document.getElementById('ai-chat-interface-container');
  if (container) {
    ReactDOM.createRoot(container).render(<SimpleChat />);
  } else {
    console.error('Chat interface container not found');
  }
}

setTimeout(renderApp, 0);