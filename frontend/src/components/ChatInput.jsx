import React, { useState, useRef, useEffect } from 'react';
import './ChatInput.css';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input-container">
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message AI..."
          disabled={disabled}
          rows={1}
        />
        <button
          type="button"
          className="send-button"
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          title="Send"
        >
          {disabled ? (
            <svg className="spinner" viewBox="0 0 24 24">
              <circle className="spinner-circle" cx="12" cy="12" r="10" fill="none" strokeWidth="2.5" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" stroke="none" />
            </svg>
          )}
        </button>
      </div>
      <p className="input-hint">Enter to send · Shift+Enter for new line</p>
    </div>
  );
};

export default ChatInput;
