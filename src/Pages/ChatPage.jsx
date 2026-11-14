import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ThemeToggle from '../Components/ThemeToggle';

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('userToken');
      const name = localStorage.getItem('userName');
      
      if (!token) {
        // Not logged in, redirect to auth page
        navigate('/auth');
        return;
      }
      
      setUserName(name || 'User');
      
      // Add welcome message only if messages array is empty
      if (messages.length === 0) {
        setMessages([
          {
            role: 'assistant',
            content: `Hello ${name || 'there'}! 👋 I'm your AI health assistant. How can I help you today?`,
            timestamp: new Date()
          }
        ]);
      }
    };

    checkAuth();

    // Listen for auth changes (logout from other tabs)
    const handleAuthChange = () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/auth');
      }
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [navigate]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send to backend with conversation history
      const response = await axios.post(`${BACKEND_URL}/chat-with-history`, {
        message: inputMessage,
        history: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });

      if (response.data.success) {
        const botMessage = {
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const handleNewChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Hello ${userName}! 👋 I'm ready for a new conversation. What would you like to discuss?`,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate('/')}>
              ← Back
            </button>
            <div className="chat-title">
              <span className="chat-icon">💬</span>
              <span>Health Chat</span>
            </div>
          </div>
          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ThemeToggle />
            <button className="new-chat-btn" onClick={handleNewChat}>
              ✨ New Chat
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        <div className="messages-wrapper">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-avatar">
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your health..."
            className="message-input"
            rows="1"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage} 
            className="send-btn"
            disabled={!inputMessage.trim() || isLoading}
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .chat-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
          background: #f5f7fa;
          overflow: hidden;
          padding-top: 0; /* No navbar on chat page */
        }

        .chat-header {
          background: white;
          padding: 1rem 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          z-index: 999;
          flex-shrink: 0;
          border-bottom: 2px solid #f0f0f0;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
          min-width: 0;
        }

        .back-btn {
          background: #f0f0f0;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          font-size: 0.9rem;
          color: #333;

        }

        .back-btn:hover {
          background: #8f8e8eff;
        }

        .chat-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.2rem;
          font-weight: 700;
          color: #2196f3;
        }

        .chat-icon {
          font-size: 1.5rem;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .new-chat-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          white-space: nowrap;
          font-size: 0.9rem;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .new-chat-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
        }

        .messages-wrapper {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .message {
          display: flex;
          gap: 1rem;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .message-content {
          max-width: 70%;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .message.user .message-content {
          align-items: flex-end;
        }

        .message-text {
          background: white;
          padding: 1rem 1.25rem;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          line-height: 1.5;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .message.user .message-text {
          background: #2196f3;
          color: white;
        }

        .message-time {
          font-size: 0.75rem;
          color: #999;
          padding: 0 0.5rem;
        }

        .typing-indicator {
          background: white;
          padding: 1rem 1.5rem;
          border-radius: 1rem;
          display: flex;
          gap: 0.4rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #999;
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .input-container {
          background: white;
          padding: 1.5rem 2rem;
          box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
        }

        .input-wrapper {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          gap: 1rem;
          align-items: flex-end;
        }

        .message-input {
          flex: 1;
          padding: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 1.5rem;
          font-size: 1rem;
          font-family: inherit;
          resize: none;
          max-height: 150px;
          transition: all 0.3s;
        }

        .message-input:focus {
          outline: none;
          border-color: #2196f3;
        }

        .message-input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .send-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          background: #2196f3;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .send-btn:hover:not(:disabled) {
          background: #1976d2;
          transform: scale(1.1);
        }

        .send-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: scale(1);
        }

        @media (max-width: 768px) {
          .chat-page {
            padding-top: 0; /* No navbar */
          }

          .chat-header {
            padding: 0.75rem 1rem;
          }

          .header-left {
            gap: 0.5rem;
          }

          .back-btn {
            padding: 0.4rem 0.7rem;
            font-size: 0.85rem;
          }

          .chat-title {
            font-size: 1rem;
          }

          .chat-icon {
            font-size: 1.2rem;
          }

          .new-chat-btn {
            padding: 0.5rem 0.9rem;
            font-size: 0.85rem;
          }

          .messages-container {
            padding: 1rem;
          }

          .message-content {
            max-width: 85%;
          }

          .input-container {
            padding: 1rem;
          }

          .message-input {
            font-size: 0.95rem;
          }
        }

        @media (max-width: 480px) {
          .chat-header {
            padding: 0.5rem 0.75rem;
          }

          .back-btn {
            padding: 0.35rem 0.6rem;
            font-size: 0.8rem;
          }

          .chat-title span:last-child {
            display: none;
          }

          .new-chat-btn {
            padding: 0.4rem 0.7rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatPage;