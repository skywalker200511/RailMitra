import React, { useRef, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble.jsx';
import TrainCard from './TrainCard.jsx';

const STATUS_MESSAGES = [
  '🔍 Searching for trains...',
  '🚂 Analyzing routes...',
  '📊 Checking seat availability...',
  '⏳ Fetching live data from Indian Railways...',
  '📋 Compiling results...',
  '🔄 Still working — checking more trains...',
  '⚡ Almost there...',
];

function LoadingProgress({ startTime }) {
  const [elapsed, setElapsed] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const ESTIMATED_TOTAL = 25; // seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setStatusIdx(prev => (prev + 1) % STATUS_MESSAGES.length);
    }, 5000);
    return () => clearInterval(msgTimer);
  }, []);

  const progress = Math.min((elapsed / ESTIMATED_TOTAL) * 100, 95);
  const remaining = Math.max(ESTIMATED_TOTAL - elapsed, 0);

  return (
    <div className="loading-progress">
      <div className="loading-status">{STATUS_MESSAGES[statusIdx]}</div>
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="loading-meta">
        <span>{elapsed}s elapsed</span>
        <span>~{remaining}s remaining</span>
      </div>
    </div>
  );
}

function ChatInterface({ messages, isLoading, loadingStartTime }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-interface">
      {messages.map((msg, idx) => (
        <div key={idx} className={`message-wrapper ${msg.role}`}>
          <MessageBubble role={msg.role} content={msg.content} />
          {msg.trainResults && msg.trainResults.length > 0 && (
            <div className="train-results-container">
              {msg.trainResults.map((train, i) => (
                <TrainCard key={i} {...train} />
              ))}
            </div>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="message-wrapper assistant">
          <LoadingProgress startTime={loadingStartTime || Date.now()} />
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}

export default ChatInterface;
