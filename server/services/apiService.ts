import fetch from 'node-fetch';

// API configuration
const API_ENDPOINT = <END_POINT>;
const API_KEY = <API_KEY>;

// Helper function for making POST API requests
async function makePostApiRequest<T>(body: any): Promise<T | null> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error(`API Error (${response.status}): ${response.statusText}`);
      return null;
    }

    return await response.json() as T;
  } catch (error) {
    console.error(`Error in API request:`, error);
    return null;
  }
}

// API service
export const apiService = {
  // Send chat message and get AI response
  sendChatMessage: async (message: string, history?: any[]) => {
    return await makePostApiRequest({
      model: "gpt-3.5-turbo",
      messages: [
        ...(history || []),
        { role: "user", content: message }
      ]
    });
  }
};
