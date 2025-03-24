const API_CONFIG = {
  baseURL: 'https://api.openai.com/v1/chat/completions',
  headers: {
    'Content-Type': 'application/json',
    // Add any other required headers
  },
  credentials: 'include' as RequestCredentials
};

export async function sendAIMessage(message: string, retries = 3) {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/ai/chat`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      credentials: API_CONFIG.credentials,
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying AI message (${retries} attempts left)`);
      return sendAIMessage(message, retries - 1);
    }
    throw error;
  }
}