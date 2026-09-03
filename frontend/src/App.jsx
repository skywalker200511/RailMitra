import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface.jsx';
import DataSourceBadge from './components/DataSourceBadge.jsx';
import { sendMessage } from './services/api.js';
import './App.css';

function generateSessionId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState('live'); // 'live' or 'mock'
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const savedMessages = localStorage.getItem('railmitra_messages');
    const savedSessionId = localStorage.getItem('railmitra_session');
    
    if (savedSessionId) {
      setSessionId(savedSessionId);
    } else {
      setSessionId(generateSessionId());
    }

    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        setMessages([{ role: 'assistant', content: 'Hello! I am RailMitra. How can I help you with your train journey today?' }]);
      }
    } else {
      setMessages([{ role: 'assistant', content: 'Hello! I am RailMitra. How can I help you with your train journey today?' }]);
    }
  }, []);

  // Save to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('railmitra_messages', JSON.stringify(messages));
    }
    if (sessionId) {
      localStorage.setItem('railmitra_session', sessionId);
    }
  }, [messages, sessionId]);

  const clearChat = () => {
    localStorage.removeItem('railmitra_messages');
    localStorage.removeItem('railmitra_session');
    setSessionId(generateSessionId());
    setMessages([{ role: 'assistant', content: 'Hello! I am RailMitra. How can I help you with your train journey today?' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const data = await sendMessage(userMessage.content, sessionId);
      const assistantMessage = { 
        role: 'assistant', 
        content: data.reply,
        trainResults: data.trainResults 
      };
      if (data.dataSource) {
        setDataSource(data.dataSource);
      }
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🚂 RailMitra</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={clearChat} style={{ background: 'none', border: '1px solid #fff', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>🗑️ Clear Chat</button>
          <DataSourceBadge source={dataSource} />
        </div>
      </header>
      
      <main className="app-main">
        <ChatInterface messages={messages} isLoading={isLoading} />
      </main>

      <footer className="app-footer">
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question..."
            disabled={isLoading}
            className="chat-input"
          />
          <button type="submit" disabled={isLoading || !inputValue.trim()} className="send-btn">
            →
          </button>
        </form>
      </footer>
    </div>
  );
}

export default App;
