import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble.jsx';
import TrainCard from './TrainCard.jsx';

function ChatInterface({ messages, isLoading }) {
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
          <div className="typing-indicator">RailMitra is typing...</div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}

export default ChatInterface;
