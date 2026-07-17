import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { sendMessageGet } from './services/api';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendMessage = async (message) => {
    setMessages((prev) => [...prev, { content: message, isUser: true }]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessageGet(message);
      setMessages((prev) => [...prev, { content: response.answer, isUser: false }]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        { content: `Error: ${err.message}. Please try again.`, isUser: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
  };

  const handleSuggestion = (text) => {
    handleSendMessage(text);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h1>AI Chat</h1>
            <span className="logo-badge">Llama 3.3</span>
          </div>
          <button className="clear-button" onClick={handleClearChat}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            Clear
          </button>
        </div>
      </header>

      <main className="app-main">
        <ChatWindow messages={messages} isLoading={isLoading} onSuggestion={handleSuggestion} />
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </main>

      {error && (
        <div className="error-toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}
    </div>
  );
}

export default App;
