import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';
import { 
  StatusCardData, 
  Weather,
  Alert,
  IrrigationZone,
  EnergyData,
  WaterData,
  AgricultureData 
} from '@/lib/types';

// Define the context type
interface RealTimeContextType {
  realTimeData: any;
  isConnected: boolean;
  lastUpdateTime: Date | null;
  alerts: Alert[];
  irrigationZones: IrrigationZone[];
  weatherForecast: Weather[];
  energyCardData: StatusCardData;
  waterCardData: StatusCardData;
  agricultureCardData: StatusCardData;
  refreshAlerts: () => void;
  refreshIrrigation: () => void;
  refreshWeather: () => void;
}

// Create the context with default values
const RealTimeContext = createContext<RealTimeContextType>({
  realTimeData: null,
  isConnected: false,
  lastUpdateTime: null,
  alerts: [],
  irrigationZones: [],
  weatherForecast: [],
  energyCardData: {
    title: "Energy Status",
    status: "optimal",
    metrics: [
      { label: "Solar", value: "0", unit: "kW" },
      { label: "Battery", value: "0", unit: "%" },
      { label: "Grid", value: "0", unit: "kW" }
    ],
    chartData: [0, 0, 0, 0, 0, 0, 0]
  },
  waterCardData: {
    title: "Water Supply",
    status: "optimal",
    metrics: [
      { label: "Reservoir", value: "0", unit: "%" },
      { label: "Flow Rate", value: "0", unit: "L/m" },
      { label: "Quality", value: "0", unit: "%" }
    ],
    chartData: [0, 0, 0, 0, 0, 0, 0]
  },
  agricultureCardData: {
    title: "Smart Agriculture",
    status: "optimal",
    metrics: [
      { label: "Soil Moisture", value: "0", unit: "%" },
      { label: "Temperature", value: "0", unit: "°C" },
      { label: "Irrigation", value: "OFF" }
    ],
    chartData: [0, 0, 0, 0, 0, 0, 0]
  },
  refreshAlerts: () => {},
  refreshIrrigation: () => {},
  refreshWeather: () => {}
});

// Provider component
export const RealTimeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // WebSocket connection
  const { 
    data: wsData, 
    isConnected,
    sendMessage 
  } = useWebSocket('/ws');

  // State for various data types
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  
  // State for specific data types
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "warning",
      title: "Potential Water Leak Detected",
      location: "Northern Sector - Pipeline Junction B7",
      time: "10 min ago",
      icon: "fas fa-exclamation-triangle",
      primaryAction: "Dispatch",
      secondaryAction: "Ignore"
    },
    {
      id: "2",
      type: "danger",
      title: "Power Outage Warning",
      location: "East Grid - Sector 4",
      time: "25 min ago",
      icon: "fas fa-bolt",
      primaryAction: "Fix Now",
      secondaryAction: "Ignore"
    },
    {
      id: "3",
      type: "info",
      title: "Scheduled Maintenance Alert",
      location: "Solar Panel Array - Module 12",
      time: "2 hours ago",
      icon: "fas fa-info-circle",
      primaryAction: "Schedule",
      secondaryAction: "Postpone"
    }
  ]);
  
  const [irrigationZones, setIrrigationZones] = useState<IrrigationZone[]>([
    { id: "zone1", name: "North Field Zone", active: true, duration: "15 min" },
    { id: "zone2", name: "East Field Zone", active: false, duration: "0 min" },
    { id: "zone3", name: "South Field Zone", active: true, duration: "8 min" }
  ]);
  
  const [weatherForecast, setWeatherForecast] = useState<Weather[]>([
    { day: "Mon", icon: "fa-sun", temperature: "32°C" },
    { day: "Tue", icon: "fa-cloud", temperature: "28°C" },
    { day: "Wed", icon: "fa-cloud-rain", temperature: "25°C" },
    { day: "Thu", icon: "fa-cloud-sun", temperature: "27°C" },
    { day: "Fri", icon: "fa-sun", temperature: "30°C" }
  ]);
  
  // Energy data state and derived status card
  const [energyData, setEnergyData] = useState<EnergyData>({
    solar: "3.4",
    battery: "78",
    grid: "5.2"
  });
  
  const [energyCardData, setEnergyCardData] = useState<StatusCardData>({
    title: "Energy Status",
    status: "optimal",
    metrics: [
      { label: "Solar", value: energyData.solar, unit: "kW" },
      { label: "Battery", value: energyData.battery, unit: "%" },
      { label: "Grid", value: energyData.grid, unit: "kW" }
    ],
    chartData: [87, 62, 75, 50, 100, 87, 62]
  });
  
  // Water data state and derived status card
  const [waterData, setWaterData] = useState<WaterData>({
    reservoir: "68",
    flow: "45",
    quality: "92"
  });
  
  const [waterCardData, setWaterCardData] = useState<StatusCardData>({
    title: "Water Supply",
    status: "attention",
    metrics: [
      { label: "Reservoir", value: waterData.reservoir, unit: "%" },
      { label: "Flow Rate", value: waterData.flow, unit: "L/m" },
      { label: "Quality", value: waterData.quality, unit: "%" }
    ],
    chartData: [62, 50, 87, 75, 44, 56, 69]
  });
  
  // Agriculture data state and derived status card
  const [agricultureData, setAgricultureData] = useState<AgricultureData>({
    soil: "42",
    temp: "27",
    irrigation: "ON"
  });
  
  const [agricultureCardData, setAgricultureCardData] = useState<StatusCardData>({
    title: "Smart Agriculture",
    status: "optimal",
    metrics: [
      { label: "Soil Moisture", value: agricultureData.soil, unit: "%" },
      { label: "Temperature", value: agricultureData.temp, unit: "°C" },
      { label: "Irrigation", value: agricultureData.irrigation }
    ],
    chartData: [50, 62, 44, 56, 75, 62, 50]
  });

  // Process WebSocket data
  useEffect(() => {
    if (wsData) {
      try {
        const parsedData = typeof wsData === 'string' ? JSON.parse(wsData) : wsData;
        setRealTimeData(parsedData);
        setLastUpdateTime(new Date());
        
        // Update specific data based on the message type
        if (parsedData.type === 'initial') {
          // Initial data contains all dashboard data
          const dashData = parsedData.data;
          if (dashData.energy) updateEnergyData(dashData.energy);
          if (dashData.water) updateWaterData(dashData.water);
          if (dashData.agriculture) updateAgricultureData(dashData.agriculture);
          if (dashData.alerts) setAlerts(dashData.alerts);
          if (dashData.irrigationZones) setIrrigationZones(dashData.irrigationZones);
          if (dashData.weatherForecast) setWeatherForecast(dashData.weatherForecast);
        } 
        else if (parsedData.type === 'update') {
          // Regular update contains subset of data
          const updateData = parsedData.data;
          if (updateData.energy) updateEnergyData(updateData.energy);
          if (updateData.water) updateWaterData(updateData.water);
          if (updateData.agriculture) updateAgricultureData(updateData.agriculture);
        }
        else if (parsedData.type === 'response') {
          // Response to a specific data request
          if (parsedData.dataType === 'alerts') {
            setAlerts(parsedData.data);
          } 
          else if (parsedData.dataType === 'irrigation') {
            setIrrigationZones(parsedData.data);
          } 
          else if (parsedData.dataType === 'weather') {
            setWeatherForecast(parsedData.data);
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket data:', error);
      }
    }
  }, [wsData]);

  // Update Energy data and card
  const updateEnergyData = (data: EnergyData) => {
    setEnergyData(data);
    
    // Determine status based on thresholds
    let status: 'optimal' | 'attention' | 'critical' = 'optimal';
    if (parseInt(data.battery) < 30) {
      status = 'critical';
    } else if (parseInt(data.battery) < 50) {
      status = 'attention';
    }
    
    setEnergyCardData({
      title: "Energy Status",
      status,
      metrics: [
        { label: "Solar", value: data.solar, unit: "kW" },
        { label: "Battery", value: data.battery, unit: "%" },
        { label: "Grid", value: data.grid, unit: "kW" }
      ],
      chartData: energyCardData.chartData
    });
  };

  // Update Water data and card
  const updateWaterData = (data: WaterData) => {
    setWaterData(data);
    
    // Determine status based on thresholds
    let status: 'optimal' | 'attention' | 'critical' = 'optimal';
    if (parseInt(data.reservoir) < 30) {
      status = 'critical';
    } else if (parseInt(data.reservoir) < 50 || parseInt(data.quality) < 80) {
      status = 'attention';
    }
    
    setWaterCardData({
      title: "Water Supply",
      status,
      metrics: [
        { label: "Reservoir", value: data.reservoir, unit: "%" },
        { label: "Flow Rate", value: data.flow, unit: "L/m" },
        { label: "Quality", value: data.quality, unit: "%" }
      ],
      chartData: waterCardData.chartData
    });
  };

  // Update Agriculture data and card
  const updateAgricultureData = (data: AgricultureData) => {
    setAgricultureData(data);
    
    // Determine status based on thresholds
    let status: 'optimal' | 'attention' | 'critical' = 'optimal';
    if (parseInt(data.soil) < 20) {
      status = 'critical';
    } else if (parseInt(data.soil) < 35 || parseInt(data.temp) > 35) {
      status = 'attention';
    }
    
    setAgricultureCardData({
      title: "Smart Agriculture",
      status,
      metrics: [
        { label: "Soil Moisture", value: data.soil, unit: "%" },
        { label: "Temperature", value: data.temp, unit: "°C" },
        { label: "Irrigation", value: data.irrigation }
      ],
      chartData: agricultureCardData.chartData
    });
  };

  // Refresh functions to request latest data from server
  const refreshAlerts = () => {
    if (isConnected) {
      sendMessage(JSON.stringify({ 
        type: 'request_data', 
        dataType: 'alerts',
        requestId: Date.now().toString()
      }));
    }
  };

  const refreshIrrigation = () => {
    if (isConnected) {
      sendMessage(JSON.stringify({ 
        type: 'request_data', 
        dataType: 'irrigation',
        requestId: Date.now().toString()
      }));
    }
  };

  const refreshWeather = () => {
    if (isConnected) {
      sendMessage(JSON.stringify({ 
        type: 'request_data', 
        dataType: 'weather',
        requestId: Date.now().toString()
      }));
    }
  };

  // Simulate small variations in energy data
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isConnected) {
        // Only update locally if WebSocket is not connected
        setEnergyData(prev => {
          const newData = {
            solar: (parseFloat(prev.solar) + (Math.random() * 0.4 - 0.2)).toFixed(1),
            battery: Math.min(100, Math.max(0, parseInt(prev.battery) + Math.floor(Math.random() * 3 - 1))).toString(),
            grid: (parseFloat(prev.grid) + (Math.random() * 0.2 - 0.1)).toFixed(1)
          };
          updateEnergyData(newData);
          return newData;
        });
        
        setWaterData(prev => {
          const newData = {
            reservoir: Math.min(100, Math.max(0, parseInt(prev.reservoir) + Math.floor(Math.random() * 3 - 1))).toString(),
            flow: Math.min(100, Math.max(20, parseInt(prev.flow) + Math.floor(Math.random() * 3 - 1))).toString(),
            quality: Math.min(100, Math.max(70, parseInt(prev.quality) + Math.floor(Math.random() * 3 - 1))).toString()
          };
          updateWaterData(newData);
          return newData;
        });
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isConnected]);

  // Update chart data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Update energy chart data
      setEnergyCardData(prev => ({
        ...prev,
        chartData: [...prev.chartData.slice(1), Math.floor(Math.random() * 50) + 50]
      }));
      
      // Update water chart data
      setWaterCardData(prev => ({
        ...prev,
        chartData: [...prev.chartData.slice(1), Math.floor(Math.random() * 50) + 30]
      }));
      
      // Update agriculture chart data
      setAgricultureCardData(prev => ({
        ...prev,
        chartData: [...prev.chartData.slice(1), Math.floor(Math.random() * 40) + 40]
      }));
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <RealTimeContext.Provider value={{
      realTimeData,
      isConnected,
      lastUpdateTime,
      alerts,
      irrigationZones,
      weatherForecast,
      energyCardData,
      waterCardData,
      agricultureCardData,
      refreshAlerts,
      refreshIrrigation,
      refreshWeather
    }}>
      {children}
    </RealTimeContext.Provider>
  );
};

// Custom hook to use the context
export const useRealTime = () => useContext(RealTimeContext);