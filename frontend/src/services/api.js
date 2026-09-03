const API_BASE = '/api';

export async function sendMessage(message, sessionId) {
  const response = await fetch(`${API_BASE}/agent/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId }),
  });
  if (!response.ok) {
    let errorMsg = `API error: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.error && errorData.error.message) {
        errorMsg = errorData.error.message;
      } else if (errorData.message) {
        errorMsg = errorData.message;
      }
    } catch (e) {
      // Ignore JSON parse errors and use default message
    }
    throw new Error(errorMsg);
  }
  return response.json();
}
