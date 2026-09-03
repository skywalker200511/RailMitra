const API_BASE = '/api';

export async function sendMessage(message, sessionId) {
  const response = await fetch(`${API_BASE}/agent/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId }),
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}
