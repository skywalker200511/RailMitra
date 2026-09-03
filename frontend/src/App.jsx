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
    setSessionId(generateSessionId());
    setMessages([
      { role: 'assistant', content: 'Hello! I am RailMitra. How can I help you with your train journey today?' }
    ]);
  }, []);

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
        <DataSourceBadge source={dataSource} />
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
