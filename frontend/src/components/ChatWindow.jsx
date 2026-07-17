import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import Loading from './Loading';
import './ChatWindow.css';

const SUGGESTIONS = [
  'What is Spring AI?',
  'Explain React hooks',
  'Write a Java function',
  'How does async/await work?',
];

const ChatWindow = ({ messages, isLoading, onSuggestion }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <div className="empty-state-glow">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
            <h2 className="empty-state-title">How can I help you?</h2>
            <p className="empty-state-description">
              Ask me anything — code, concepts, writing, or just a quick question.
            </p>
            <div className="suggestion-chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="suggestion-chip" onClick={() => onSuggestion?.(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={index} message={msg.content} isUser={msg.isUser} />
          ))
        )}
        {isLoading && <Loading />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
