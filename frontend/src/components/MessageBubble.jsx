import React from 'react';

function MessageBubble({ role, content }) {
  const formatContent = (text) => {
    return text.split('\n').map((line, i) => {
      // Basic markdown bold support: **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <React.Fragment key={i}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
          <br />
        </React.Fragment>
      );
    });
  };

  return (
    <div className={`message-bubble ${role}`}>
      {formatContent(content || '')}
    </div>
  );
}

export default MessageBubble;
