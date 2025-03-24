import { EnergyData, WaterData, AgricultureData, Alert, ChatMessage, Weather } from './types';

// API configuration
const API_ENDPOINT = 'https://huggingface.co';
const API_KEY = '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'; // Replace with your actual OpenAI API key

// Helper function for making API requests
async function makeApiRequest<T>(path: string): Promise<T> {
  try {
    const response = await fetch(`${API_ENDPOINT}${path}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error (${response.status}): ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${path}:`, error);
    throw error;
  }
}

// API service with methods for different data types
export const apiService = {
  // Fetch dashboard overview data
  getDashboardData: async () => {
    try {
      return await makeApiRequest<{
        energy: EnergyData;
        water: WaterData;
        agriculture: AgricultureData;
      }>('/dashboard');
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Fallback to local data if API fails
      return {
        energy: { solar: "3.4", battery: "78", grid: "5.2" },
        water: { reservoir: "68", flow: "45", quality: "92" },
        agriculture: { soil: "42", temp: "27", irrigation: "ON" }
      };
    }
  },

  // Fetch energy management data
  getEnergyData: async () => {
    try {
      return await makeApiRequest<EnergyData>('/energy');
    } catch (error) {
      console.error("Error fetching energy data:", error);
      // Fallback data
      return { solar: "3.4", battery: "78", grid: "5.2" };
    }
  },

  // Fetch water supply data
  getWaterData: async () => {
    try {
      return await makeApiRequest<WaterData>('/water');
    } catch (error) {
      console.error("Error fetching water data:", error);
      // Fallback data
      return { reservoir: "68", flow: "45", quality: "92" };
    }
  },

  // Fetch agricultural data
  getAgricultureData: async () => {
    try {
      return await makeApiRequest<AgricultureData>('/agriculture');
    } catch (error) {
      console.error("Error fetching agriculture data:", error);
      // Fallback data
      return { soil: "42", temp: "27", irrigation: "ON" };
    }
  },

  // Fetch alerts and notifications
  getAlerts: async () => {
    try {
      return await makeApiRequest<Alert[]>('/alerts');
    } catch (error) {
      console.error("Error fetching alerts:", error);
      // Fallback empty array
      return [];
    }
  },

  // Fetch weather forecast
  getWeatherForecast: async () => {
    try {
      return await makeApiRequest<Weather[]>('/weather');
    } catch (error) {
      console.error("Error fetching weather data:", error);
      // Fallback empty array
      return [];
    }
  },

  // Send AI assistant message and get response
  sendAIMessage: async (message: string): Promise<ChatMessage> => {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        throw new Error(`API Error (${response.status}): ${response.statusText}`);
      }

      const data = await response.json();
      return {
        id: Math.random().toString(36).substring(2, 11),
        content: data.choices[0].message.content,
        sender: 'assistant',
        timestamp: Date.now()
      };
    } catch (error) {
      console.error("Error sending AI message:", error);
      throw error;
    }
  }
};