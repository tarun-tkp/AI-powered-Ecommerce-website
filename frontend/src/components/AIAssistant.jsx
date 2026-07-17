import React, { useRef, useEffect, useState } from 'react';
import { FiX, FiSend, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChat } from '../contexts/ChatContext';
import './AIAssistant.css';

export default function AIAssistant() {
  const { isOpen, toggleChat, messages, loading, sendMessage, clearMessages } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const suggestions = ['Recommend a gaming laptop under ₹70000', 'Best phone for photography', 'Compare iPhone 15 and Samsung S24'];

  return (
    <>
      {/* Floating button */}
      <button className={`ai-fab ${isOpen ? 'open' : ''}`} onClick={toggleChat} title="AI Shopping Assistant">
        {isOpen ? <FiX size={22} /> : <span className="fab-emoji">🤖</span>}
        {!isOpen && <span className="fab-pulse" />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="ai-window">
          <div className="ai-header">
            <div className="ai-header-info">
              <div className="ai-avatar">🛍️</div>
              <div>
                <p className="ai-name">ShopAI Assistant</p>
                <p className="ai-status"><span className="status-dot" />Online</p>
              </div>
            </div>
            <div className="ai-header-actions">
              <button onClick={clearMessages} title="Clear chat"><FiTrash2 size={15} /></button>
              <button onClick={toggleChat}><FiX size={16} /></button>
            </div>
          </div>

          <div className="ai-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-msg ${msg.isUser ? 'user' : 'bot'}`}>
                {!msg.isUser && <div className="bot-avatar">🤖</div>}
                <div className="ai-bubble">
                  {msg.isUser
                    ? <p>{msg.content}</p>
                    : <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  }
                </div>
              </div>
            ))}

            {loading && (
              <div className="ai-msg bot">
                <div className="bot-avatar">🤖</div>
                <div className="ai-bubble typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className="ai-suggestions">
                {suggestions.map(s => (
                  <button key={s} className="ai-suggestion" onClick={() => sendMessage(s)}>{s}</button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="ai-input-area">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything about products..."
              rows={1}
              disabled={loading}
            />
            <button className="ai-send-btn" onClick={handleSend} disabled={!input.trim() || loading}>
              <FiSend size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
