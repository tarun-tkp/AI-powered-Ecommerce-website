import React from 'react';
import './Loading.css';

const Loading = () => (
  <div className="loading-bubble">
    <div className="loading-avatar">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
        <path d="M12 8v4l3 3" />
      </svg>
    </div>
    <div className="loading-content">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </div>
  </div>
);

export default Loading;
