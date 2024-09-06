import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../shadcn/components/card"
import { Button } from "../../../shadcn/components/button"
import { Textarea } from "../../../shadcn/components/textarea"
import { ScrollArea } from "../../../shadcn/components/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../../../shadcn/components/avatar"

type Message = {
  content: string;
  isUser: boolean;
}

function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for messages from the content script
    const handleMessage = (event: MessageEvent) => {
      if (event.source === window && event.data && event.data.type === 'FROM_CONTENT') {
        if (event.data.action === 'GUI_RESPONSE') {
          if (event.data.error) {
            setMessages(prev => [...prev, { content: `Error: ${event.data.error}`, isUser: false }]);
          } else {
            setMessages(prev => [...prev, { content: event.data.response, isUser: false }]);
          }
          setIsLoading(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages(prev => [...prev, { content: input, isUser: true }]);
      setIsLoading(true);
      
      // Send message to content script
      window.postMessage({ type: 'FROM_REACT', action: 'GET_GUI_RESPONSE', input }, '*');
      
      setInput('');
    }
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Juno Chat Interface</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <ScrollArea className="h-full pr-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`flex items-start ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.isUser ? "/user-avatar.png" : "/ai-avatar.png"} />
                  <AvatarFallback>{message.isUser ? 'U' : 'AI'}</AvatarFallback>
                </Avatar>
                <div className={`mx-2 p-3 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-shrink-0 mt-auto">
        <div className="flex w-full space-x-2">
          <Textarea 
            placeholder="Type your message here..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSend} disabled={isLoading} className="mt-2 ml-1">
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function renderApp() {
  const container = document.getElementById('ai-chat-interface-container');

  if (container) {
    ReactDOM.createRoot(container).render(
      <React.StrictMode>
        <ChatInterface />
      </React.StrictMode>
    );
  } else {
    console.error('Chat interface container not found');
  }
}

// Delay render
setTimeout(renderApp, 0);