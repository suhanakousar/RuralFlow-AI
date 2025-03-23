import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from 'ws';
import { storage } from "./storage";
import { apiService } from "./services/apiService";
import * as simulationService from "./services/simulationService";
import fetch from 'node-fetch';

// Configuration for Python ML backend
const ML_API_BASE_URL = process.env.ML_API_URL || 'http://localhost:5001';

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard data route
  app.get('/api/dashboard', async (req, res) => {
    try {
      // Generate real-time simulated data using AI models
      const dashboardData = simulationService.simulateDashboardData();
      res.json(dashboardData);
    } catch (error) {
      console.error('Error generating dashboard data:', error);
      res.status(500).json({ error: 'Failed to generate dashboard data' });
    }
  });
  
  // Energy data route
  app.get('/api/energy', async (req, res) => {
    try {
      // Generate real-time simulated energy data using AI models
      const energyData = simulationService.simulateEnergyData();
      res.json(energyData);
    } catch (error) {
      console.error('Error generating energy data:', error);
      res.status(500).json({ error: 'Failed to generate energy data' });
    }
  });
  
  // Water data route
  app.get('/api/water', async (req, res) => {
    try {
      // Generate real-time simulated water data using AI models
      const waterData = simulationService.simulateWaterData();
      res.json(waterData);
    } catch (error) {
      console.error('Error generating water data:', error);
      res.status(500).json({ error: 'Failed to generate water data' });
    }
  });
  
  // Agriculture data route
  app.get('/api/agriculture', async (req, res) => {
    try {
      // Generate real-time simulated agriculture data using AI models
      const agricultureData = simulationService.simulateAgricultureData();
      res.json(agricultureData);
    } catch (error) {
      console.error('Error generating agriculture data:', error);
      res.status(500).json({ error: 'Failed to generate agriculture data' });
    }
  });
  
  // Alerts route
  app.get('/api/alerts', async (req, res) => {
    try {
      // Generate real-time simulated alerts using AI models
      const alerts = simulationService.simulateAlerts();
      res.json(alerts);
    } catch (error) {
      console.error('Error generating alerts:', error);
      res.status(500).json({ error: 'Failed to generate alerts' });
    }
  });
  
  // Irrigation zones route
  app.get('/api/irrigation', async (req, res) => {
    try {
      // Generate real-time simulated irrigation data using AI models
      const irrigationData = simulationService.simulateIrrigationZones();
      res.json(irrigationData);
    } catch (error) {
      console.error('Error generating irrigation data:', error);
      res.status(500).json({ error: 'Failed to generate irrigation data' });
    }
  });
  
  // Weather forecast route
  app.get('/api/weather', async (req, res) => {
    try {
      // Generate real-time simulated weather forecast using AI models
      const weatherData = simulationService.simulateWeatherForecast();
      res.json(weatherData);
    } catch (error) {
      console.error('Error generating weather data:', error);
      res.status(500).json({ error: 'Failed to generate weather data' });
    }
  });
  
  // AI chat route
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      // Generate AI response using our simulation service
      const aiResponse = simulationService.generateAIResponse(message, history);
      res.json(aiResponse);
    } catch (error) {
      console.error('Error generating AI response:', error);
      res.status(500).json({ error: 'Failed to generate AI response' });
    }
  });

  // ML API routes
  app.post('/api/ml/energy/predict', async (req, res) => {
    try {
      const { forecast, timestamp } = req.body;
      
      // Try to use ML API first, fall back to simulation if unavailable
      try {
        const response = await fetch(`${ML_API_BASE_URL}/api/energy/predict`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ forecast, timestamp }),
        });
        
        if (!response.ok) {
          throw new Error(`ML API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        return res.json(data);
      } catch (mlError) {
        console.warn('ML API unavailable, using simulation fallback:', mlError.message);
        // Use simulation as fallback
        const timestamp = Date.now();
        const energyData = simulationService.simulateEnergyData(timestamp);
        
        if (forecast) {
          // Generate 24-hour forecast
          const hourlyData = Array.from({ length: 24 }, (_, i) => {
            const hourTimestamp = timestamp + (i * 60 * 60 * 1000);
            const hourlyOutput = simulationService.simulateEnergyData(hourTimestamp);
            return {
              time: new Date(hourTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              output: parseFloat(hourlyOutput.solar),
              timestamp: hourTimestamp
            };
          });
          
          return res.json({ 
            success: true, 
            forecast: hourlyData,
            source: 'simulation'
          });
        }
        
        return res.json({
          success: true,
          prediction: {
            solar_output: parseFloat(energyData.solar),
            timestamp: new Date(timestamp).toISOString()
          },
          source: 'simulation'
        });
      }
    } catch (error) {
      console.error('Error in energy prediction:', error);
      res.status(500).json({ error: 'Failed to generate energy prediction' });
    }
  });
  
  app.post('/api/ml/water/detect-leak', async (req, res) => {
    try {
      const { water_usage, timestamp } = req.body;
      
      if (water_usage === undefined) {
        return res.status(400).json({ error: 'water_usage parameter is required' });
      }
      
      // Try to use ML API first, fall back to simulation if unavailable
      try {
        const response = await fetch(`${ML_API_BASE_URL}/api/water/detect-leak`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ water_usage, timestamp }),
        });
        
        if (!response.ok) {
          throw new Error(`ML API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        return res.json(data);
      } catch (mlError) {
        console.warn('ML API unavailable, using simulation fallback:', mlError.message);
        
        // Simple leak detection based on threshold
        const isAbnormal = water_usage > 90 || water_usage < 10;
        const confidence = isAbnormal ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 20);
        
        return res.json({
          success: true,
          result: {
            leak_detected: isAbnormal,
            confidence: isAbnormal ? confidence : 100 - confidence,
            severity: isAbnormal ? (confidence > 80 ? 'high' : 'medium') : 'none',
            recommendation: isAbnormal ? 'Investigate unusual water usage patterns' : 'No action needed',
            anomaly_details: {
              is_anomaly: isAbnormal,
              anomaly_score: isAbnormal ? -0.5 : 0.5,
              water_usage: water_usage
            }
          },
          source: 'simulation'
        });
      }
    } catch (error) {
      console.error('Error in water leak detection:', error);
      res.status(500).json({ error: 'Failed to detect water leaks' });
    }
  });
  
  app.post('/api/ml/agriculture/optimize-irrigation', async (req, res) => {
    try {
      const { soil_moisture, temperature, timestamp } = req.body;
      
      if (soil_moisture === undefined || temperature === undefined) {
        return res.status(400).json({
          error: 'soil_moisture and temperature parameters are required'
        });
      }
      
      // Try to use ML API first, fall back to simulation if unavailable
      try {
        const response = await fetch(`${ML_API_BASE_URL}/api/agriculture/optimize-irrigation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ soil_moisture, temperature, timestamp }),
        });
        
        if (!response.ok) {
          throw new Error(`ML API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        return res.json(data);
      } catch (mlError) {
        console.warn('ML API unavailable, using simulation fallback:', mlError.message);
        
        // Use simulation as fallback
        const irrigationData = simulationService.simulateIrrigationZones();
        const recommendations = [
          `Optimal irrigation time: ${Math.round(30 - soil_moisture/2)} minutes to reach target soil moisture.`,
          `Expected soil moisture after irrigation: ${Math.min(95, Math.round(soil_moisture + 30))}%.`
        ];
        
        if (temperature > 30) {
          recommendations.push("High temperature detected. Consider irrigating during early morning or evening for better efficiency.");
        }
        
        return res.json({
          success: true,
          result: {
            zones: irrigationData,
            recommendation: recommendations.join(' '),
            moisture_deficit: Math.round(50 - soil_moisture),
            current_moisture: soil_moisture,
            target_moisture: 50,
            expected_moisture: Math.min(95, Math.round(soil_moisture + 30))
          },
          source: 'simulation'
        });
      }
    } catch (error) {
      console.error('Error in irrigation optimization:', error);
      res.status(500).json({ error: 'Failed to optimize irrigation' });
    }
  });
  
  // Blockchain-related routes
  app.get('/api/blockchain/energy-market', async (req, res) => {
    try {
      // Try to use blockchain API first, fall back to simulation
      try {
        const response = await fetch(`${ML_API_BASE_URL}/api/blockchain/market-stats`);
        
        if (!response.ok) {
          throw new Error(`Blockchain API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        return res.json(data);
      } catch (blockchainError) {
        console.warn('Blockchain API unavailable, using simulation fallback:', blockchainError.message);
        
        // Simulate blockchain market data
        const marketData = {
          success: true,
          stats: {
            total_energy_traded: Math.round(Math.random() * 1000 + 500),
            total_value_traded: Math.round(Math.random() * 5000 + 1000) / 100,
            transaction_count: Math.floor(Math.random() * 50 + 10),
            average_price: (Math.random() * 0.2 + 0.1).toFixed(4),
            active_users: Math.floor(Math.random() * 10 + 5),
            pending_transactions: Math.floor(Math.random() * 3)
          },
          source: 'simulation'
        };
        
        return res.json(marketData);
      }
    } catch (error) {
      console.error('Error fetching energy market data:', error);
      res.status(500).json({ error: 'Failed to fetch energy market data' });
    }
  });
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Setup WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Handle WebSocket connections
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // Send initial data
    const initialData = {
      type: 'initial',
      data: simulationService.simulateDashboardData()
    };
    ws.send(JSON.stringify(initialData));
    
    // Setup periodic updates
    const interval = setInterval(() => {
      // Only send if connection is still open
      if (ws.readyState === ws.OPEN) {
        const realTimeData = {
          type: 'update',
          timestamp: Date.now(),
          data: {
            energy: simulationService.simulateEnergyData(),
            water: simulationService.simulateWaterData(),
            agriculture: simulationService.simulateAgricultureData()
          }
        };
        
        ws.send(JSON.stringify(realTimeData));
      }
    }, 5000); // Update every 5 seconds
    
    // Handle messages from clients
    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        console.log('Received message from client:', parsedMessage);
        
        // Handle different message types
        if (parsedMessage.type === 'request_data') {
          const dataType = parsedMessage.dataType;
          let responseData;
          
          switch (dataType) {
            case 'alerts':
              responseData = simulationService.simulateAlerts();
              break;
            case 'irrigation':
              responseData = simulationService.simulateIrrigationZones();
              break;
            case 'weather':
              responseData = simulationService.simulateWeatherForecast();
              break;
            default:
              responseData = simulationService.simulateDashboardData();
          }
          
          ws.send(JSON.stringify({
            type: 'response',
            requestId: parsedMessage.requestId,
            dataType,
            data: responseData
          }));
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      clearInterval(interval);
    });
  });
  
  return httpServer;
}
