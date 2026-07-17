import React, { createContext, useContext, useState } from 'react';
import { chatAPI } from '../services/api';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, content: "Hi! I'm ShopAI Assistant 🛍️ How can I help you shop today?", isUser: false }
  ]);
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(prev => !prev);

  const sendMessage = async (message) => {
    const userMsg = { id: Date.now(), content: message, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await chatAPI.sendMessage(message);
      setMessages(prev => [...prev, { id: Date.now() + 1, content: res.answer, isUser: false }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 1, content: "Sorry, I'm having trouble connecting. Please try again.", isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => setMessages([
    { id: 1, content: "Hi! I'm ShopAI Assistant 🛍️ How can I help you shop today?", isUser: false }
  ]);

  return (
    <ChatContext.Provider value={{ isOpen, toggleChat, messages, loading, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
