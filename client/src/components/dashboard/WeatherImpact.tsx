import { useState, useEffect } from 'react';
import { apiService } from '@/lib/apiService';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  impact: string;
  nextUpdate: number;
}

export default function WeatherImpact() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await apiService.getWeatherForecast();
        setWeatherData(data);
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      }
    };

    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (!weatherData) return null;

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
      <h3 className="text-sm font-semibold mb-3 flex items-center">
        <i className="fas fa-cloud-sun mr-2 text-yellow-400"></i>
        Upcoming Weather Impact
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Temperature</span>
          <span className="font-medium">{weatherData.temperature}°C</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Humidity</span>
          <span className="font-medium">{weatherData.humidity}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Wind Speed</span>
          <span className="font-medium">{weatherData.windSpeed} km/h</span>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="text-sm mb-2">
            <span className="text-gray-400">Condition:</span>
            <span className="ml-2 font-medium">{weatherData.condition}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Impact:</span>
            <p className="mt-1 text-xs">{weatherData.impact}</p>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          <i className="fas fa-clock mr-1"></i>
          Next update in {weatherData.nextUpdate} minutes
        </div>
      </div>
    </div>
  );
}