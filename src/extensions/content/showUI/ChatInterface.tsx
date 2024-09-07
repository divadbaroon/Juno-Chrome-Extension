import { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom/client';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

function SimpleChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Send a message to your currently selected profile!", sender: 'ai' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileName, setProfileName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source === window && event.data && event.data.type === 'FROM_CONTENT') {
        if (event.data.action === 'GUI_RESPONSE') {
          if (event.data.error) {
            setMessages(prev => [...prev, { 
              id: prev.length + 1, 
              text: `Error: ${event.data.error}`, 
              sender: 'ai',
              profileName: event.data.profileName 
            }]);
          } else {
            setMessages(prev => [...prev, { 
              id: prev.length + 1, 
              text: event.data.response, 
              sender: 'ai',
              profileName: event.data.profileName 
            }]);
          }
          setProfileName(event.data.profileName || null);
          setIsLoading(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = { id: messages.length + 1, text: input, sender: 'user' };
      setMessages(prev => [...prev, newMessage]);
      setIsLoading(true);
      
      // Send message to content script
      window.postMessage({ type: 'FROM_REACT', action: 'GET_GUI_RESPONSE', input }, '*');
      
      setInput('');
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2>Chat Interface {profileName ? `- ${profileName}` : ''}</h2>
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message-container ${message.sender}`}>
            <div className={`message ${message.sender}`}>
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '10px' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
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