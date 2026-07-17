import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './MessageBubble.css';

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const MessageBubble = ({ message, isUser }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'ai'}`}>
      <div className="message-avatar">
        {isUser ? (
          'U'
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
            <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
            <path d="M12 8v4l3 3" />
          </svg>
        )}
      </div>
      <div>
        <div className="message-content">
          {isUser ? (
            <div className="user-message">{message}</div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="code-block">
                      <div className="code-header">
                        <span className="code-language">{match[1]}</span>
                        <button
                          className="copy-button"
                          onClick={() => navigator.clipboard.writeText(String(children))}
                        >
                          Copy
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, borderRadius: 0, background: 'rgba(0,0,0,0.5)' }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={className} {...props}>{children}</code>
                  );
                },
              }}
            >
              {message}
            </ReactMarkdown>
          )}
        </div>
        {!isUser && (
          <div className="message-actions">
            <button className="copy-response-button" onClick={handleCopy} title="Copy">
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
