// AI-based data simulation service
// This service generates realistic data for energy, water, and agriculture metrics
// using time-series based predictions and environmental factors

// Basic time-series modeling using simple algorithms
// In a production environment, this would be replaced with proper ML models
// such as LSTM, Prophet, ARIMA, or XGBoost as mentioned in requirements

// Helper to generate a random value within a specified range
const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Generate a value that trends over time using simple sine wave + random noise
const generateTrendingValue = (
  baseValue: number,
  amplitude: number, 
  noiseLevel: number,
  timestamp: number
): number => {
  // Use timestamp to create a sine wave that cycles over a day
  const hourOfDay = new Date(timestamp).getHours();
  const dayFactor = Math.sin((hourOfDay / 24) * Math.PI * 2);
  
  // Add some random noise
  const noise = randomInRange(-noiseLevel, noiseLevel);
  
  // Combine base, trend and noise
  return baseValue + (amplitude * dayFactor) + noise;
};

// Simulate energy data based on time of day and simulated weather conditions
export const simulateEnergyData = (timestamp = Date.now()) => {
  const hourOfDay = new Date(timestamp).getHours();
  
  // Solar generation is higher during the day
  const solarFactor = hourOfDay >= 6 && hourOfDay <= 18 
    ? Math.sin(((hourOfDay - 6) / 12) * Math.PI) 
    : 0;
  
  // Define expected ranges and base values
  const solarValue = generateTrendingValue(2, 3, 0.5, timestamp);
  const batteryValue = generateTrendingValue(65, 15, 5, timestamp);
  const gridValue = generateTrendingValue(4, 2, 1, timestamp);
  
  // Create energy status based on current values
  let status = "optimal";
  if (batteryValue < 30) {
    status = "critical";
  } else if (batteryValue < 50) {
    status = "attention";
  }
  
  // Generate history data for charts (last 24h with 4h increments)
  const history = Array.from({ length: 7 }).map((_, i) => {
    const historyTimestamp = timestamp - (24 - i * 4) * 60 * 60 * 1000;
    const time = `${i * 4}:00`;
    const value = Math.round(generateTrendingValue(60, 30, 10, historyTimestamp));
    return { time, value };
  });
  
  return {
    solar: solarValue.toFixed(1),
    battery: Math.round(batteryValue).toString(),
    grid: gridValue.toFixed(1),
    status,
    history
  };
};

// Simulate water supply data based on time and simulated demand
export const simulateWaterData = (timestamp = Date.now()) => {
  const hourOfDay = new Date(timestamp).getHours();
  
  // Water usage is higher in mornings and evenings
  const usageFactor = (hourOfDay >= 6 && hourOfDay <= 9) || 
                       (hourOfDay >= 18 && hourOfDay <= 22)
                       ? 1.5 : 1;
  
  // Define expected ranges and base values
  const reservoirValue = generateTrendingValue(70, 8, 3, timestamp);
  const flowValue = generateTrendingValue(40, 10, 5, timestamp) * usageFactor;
  const qualityValue = generateTrendingValue(95, 5, 2, timestamp);
  
  // Create water status based on current values
  let status = "optimal";
  if (reservoirValue < 40) {
    status = "critical";
  } else if (reservoirValue < 60) {
    status = "attention";
  }
  
  // Generate history data for charts (last 24h with 4h increments)
  const history = Array.from({ length: 7 }).map((_, i) => {
    const historyTimestamp = timestamp - (24 - i * 4) * 60 * 60 * 1000;
    const historyHour = new Date(historyTimestamp).getHours();
    const historyUsageFactor = (historyHour >= 6 && historyHour <= 9) || 
                              (historyHour >= 18 && historyHour <= 22)
                              ? 1.5 : 1;
    const time = `${i * 4}:00`;
    const value = Math.round(generateTrendingValue(65, 15, 5, historyTimestamp) * historyUsageFactor);
    return { time, value };
  });
  
  return {
    reservoir: Math.round(reservoirValue).toString(),
    flow: Math.round(flowValue).toString(),
    quality: Math.round(qualityValue).toString(),
    status,
    history
  };
};

// Simulate agricultural data based on time, season and simulated soil conditions
export const simulateAgricultureData = (timestamp = Date.now()) => {
  const hourOfDay = new Date(timestamp).getHours();
  const date = new Date(timestamp);
  const month = date.getMonth(); // 0-11
  
  // Seasonal factor - soil moisture varies by season
  // Higher in winter/spring (months 0-4), lower in summer (months 5-8)
  const seasonalFactor = month >= 5 && month <= 8 ? 0.7 : 1.2;
  
  // Define expected ranges and base values
  const soilValue = generateTrendingValue(45, 10, 5, timestamp) * seasonalFactor;
  const tempValue = generateTrendingValue(24, 6, 2, timestamp);
  
  // Irrigation is ON when soil moisture is low during daytime
  const irrigation = soilValue < 38 && hourOfDay >= 6 && hourOfDay <= 18 ? "ON" : "OFF";
  
  // Create agriculture status based on current values
  let status = "optimal";
  if (soilValue < 30) {
    status = "critical";
  } else if (soilValue < 38) {
    status = "attention";
  }
  
  return {
    soil: Math.round(soilValue).toString(),
    temp: Math.round(tempValue).toString(),
    irrigation,
    status
  };
};

// Generate weather forecast for 5 days
export const simulateWeatherForecast = (timestamp = Date.now()) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weatherTypes = [
    { icon: "fa-sun", temp: [28, 35], probability: 0.3 },
    { icon: "fa-cloud", temp: [24, 30], probability: 0.3 },
    { icon: "fa-cloud-sun", temp: [26, 32], probability: 0.2 },
    { icon: "fa-cloud-rain", temp: [20, 28], probability: 0.15 },
    { icon: "fa-cloud-showers-heavy", temp: [18, 25], probability: 0.05 }
  ];
  
  // Generate forecast for 5 days starting from today
  return Array.from({ length: 5 }).map((_, i) => {
    const forecastDate = new Date(timestamp);
    forecastDate.setDate(forecastDate.getDate() + i);
    
    // Randomly select weather type based on probabilities
    const rand = Math.random();
    let cumProb = 0;
    let selectedWeather = weatherTypes[0];
    
    for (const weather of weatherTypes) {
      cumProb += weather.probability;
      if (rand <= cumProb) {
        selectedWeather = weather;
        break;
      }
    }
    
    const [minTemp, maxTemp] = selectedWeather.temp;
    const temperature = `${Math.round(randomInRange(minTemp, maxTemp))}°C`;
    
    return {
      day: days[forecastDate.getDay()],
      icon: selectedWeather.icon,
      temperature
    };
  });
};

// Generate alerts based on simulated conditions
export const simulateAlerts = (timestamp = Date.now()) => {
  // Fixed alerts for the demonstration
  const baseAlerts = [
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
  ];
  
  // Randomly add 1-2 dynamic alerts based on current time
  const dynamicAlerts = [];
  
  // Random alert generation based on time of day
  const hourOfDay = new Date(timestamp).getHours();
  const minuteStr = String(new Date(timestamp).getMinutes()).padStart(2, '0');
  
  // Morning peak alerts for energy
  if (hourOfDay >= 7 && hourOfDay <= 9 && Math.random() > 0.6) {
    dynamicAlerts.push({
      id: `${Date.now()}-1`,
      type: "warning",
      title: "Morning Peak Energy Usage",
      location: "All Sectors - Residential Areas",
      time: `${hourOfDay}:${minuteStr}`,
      icon: "fas fa-lightbulb",
      primaryAction: "Optimize",
      secondaryAction: "Ignore"
    });
  }
  
  // Evening irrigation alerts
  if (hourOfDay >= 17 && hourOfDay <= 19 && Math.random() > 0.6) {
    dynamicAlerts.push({
      id: `${Date.now()}-2`,
      type: "info",
      title: "Smart Irrigation Activated",
      location: "South Fields - Zones 3, 4, 7",
      time: `${hourOfDay}:${minuteStr}`,
      icon: "fas fa-tint",
      primaryAction: "View",
      secondaryAction: "Postpone"
    });
  }
  
  return [...baseAlerts, ...dynamicAlerts];
};

// Generate irrigation zone data
export const simulateIrrigationZones = (timestamp = Date.now()) => {
  const hourOfDay = new Date(timestamp).getHours();
  
  // Simulate irrigation needs based on time of day
  // Early morning and evening are optimal irrigation times
  const optimalIrrigationTime = (hourOfDay >= 5 && hourOfDay <= 8) || 
                               (hourOfDay >= 18 && hourOfDay <= 21);
  
  const zones = [
    { 
      id: "zone1", 
      name: "North Field Zone", 
      active: optimalIrrigationTime && Math.random() > 0.3, 
      duration: optimalIrrigationTime ? `${Math.floor(randomInRange(10, 20))} min` : "0 min" 
    },
    { 
      id: "zone2", 
      name: "East Field Zone", 
      active: optimalIrrigationTime && Math.random() > 0.5, 
      duration: optimalIrrigationTime && Math.random() > 0.5 ? `${Math.floor(randomInRange(5, 15))} min` : "0 min" 
    },
    { 
      id: "zone3", 
      name: "South Field Zone", 
      active: optimalIrrigationTime && Math.random() > 0.4, 
      duration: optimalIrrigationTime && Math.random() > 0.4 ? `${Math.floor(randomInRange(8, 18))} min` : "0 min" 
    }
  ];
  
  // AI recommendation based on current conditions
  const recommendations = [
    "Increase irrigation in northeast zones. Reduce water in central area to prevent overwatering.",
    "Soil moisture levels optimal. Consider reducing irrigation duration by 10% in all zones.",
    "Weather forecast indicates rain tomorrow. Consider postponing irrigation for water conservation.",
    "Soil sensors in South Field Zone indicate dryness. Consider extending irrigation duration.",
    "North Field Zone approaching optimal moisture levels. System will automatically stop irrigation in 5 minutes."
  ];
  
  return {
    zones,
    recommendation: recommendations[Math.floor(Math.random() * recommendations.length)]
  };
};

// Generate dashboard data combining multiple data sources
export const simulateDashboardData = (timestamp = Date.now()) => {
  const energy = simulateEnergyData(timestamp);
  const water = simulateWaterData(timestamp);
  const agriculture = simulateAgricultureData(timestamp);
  
  // AI insights based on simulated data
  const insights = {
    energy: generateEnergyInsight(energy, timestamp),
    water: generateWaterInsight(water, timestamp)
  };
  
  return {
    energy,
    water,
    agriculture,
    insights
  };
};

// Generate AI-powered energy insights
function generateEnergyInsight(energyData: any, timestamp = Date.now()) {
  const hourOfDay = new Date(timestamp).getHours();
  const energyInsights = [
    `Peak energy demand predicted at ${hourOfDay + 2 > 23 ? hourOfDay + 2 - 24 : hourOfDay + 2}:00 today. Consider optimizing load distribution.`,
    `Solar generation efficiency at ${parseInt(energyData.solar) + 10}% today. Battery predicted to reach full charge by ${hourOfDay + 4 > 23 ? hourOfDay + 4 - 24 : hourOfDay + 4}:00.`,
    `AI analysis indicates potential for ${Math.round(randomInRange(15, 30))}% energy savings by shifting irrigation to off-peak hours.`,
    `Grid demand expected to decrease by ${Math.round(randomInRange(10, 25))}% if forecasted sunshine materializes tomorrow.`,
    `Battery storage trending downward. AI recommends reducing non-essential consumption over next 3 hours.`
  ];
  
  return energyInsights[Math.floor(Math.random() * energyInsights.length)];
}

// Generate AI-powered water insights
function generateWaterInsight(waterData: any, timestamp = Date.now()) {
  const waterInsights = [
    `Water usage elevated in northern sector. Potential leak detected with ${Math.round(randomInRange(75, 95))}% confidence.`,
    `Reservoir levels will reach optimal capacity in approximately ${Math.round(randomInRange(2, 8))} hours based on current inflow.`,
    `Smart water allocation has reduced consumption by ${Math.round(randomInRange(10, 30))}% compared to last month.`,
    `Flow rate fluctuations detected in east pipeline. Preventative maintenance recommended within 48 hours.`,
    `AI predicts water demand spike in 3 hours based on historical patterns. Automated pressure adjustment scheduled.`
  ];
  
  return waterInsights[Math.floor(Math.random() * waterInsights.length)];
}

// AI chat response generation based on user query
export const generateAIResponse = (message: string, history?: any[]) => {
  const timestamp = Date.now();
  const lowerMessage = message.toLowerCase();
  
  // Simple keyword-based response system
  // In production, this would be replaced with a proper LLM
  let aiResponse = "I'm analyzing the data now. Is there anything specific you'd like to know about?";
  
  // Water-related queries
  if (lowerMessage.includes("water") || lowerMessage.includes("leak") || lowerMessage.includes("flow")) {
    const waterData = simulateWaterData(timestamp);
    aiResponse = `The water supply system is currently running at ${waterData.reservoir}% capacity with a flow rate of ${waterData.flow}L/m. Water quality is at ${waterData.quality}%. ${lowerMessage.includes("leak") ? "There's a potential leak detected in the northern sector that needs investigation. Would you like me to dispatch a maintenance alert?" : ""}`;
  } 
  // Energy-related queries
  else if (lowerMessage.includes("energy") || lowerMessage.includes("power") || lowerMessage.includes("solar") || lowerMessage.includes("battery")) {
    const energyData = simulateEnergyData(timestamp);
    aiResponse = `Energy consumption is currently ${energyData.status}. Solar panels are generating ${energyData.solar} kW and battery storage is at ${energyData.battery}%. Grid usage is ${parseFloat(energyData.grid) < 3 ? "minimal" : "moderate"} at this time.`;
  } 
  // Agriculture-related queries
  else if (lowerMessage.includes("agriculture") || lowerMessage.includes("irrigation") || lowerMessage.includes("farm") || lowerMessage.includes("soil")) {
    const agricultureData = simulateAgricultureData(timestamp);
    const irrigationData = simulateIrrigationZones(timestamp);
    aiResponse = `The smart irrigation system is ${irrigationData.zones.some(z => z.active) ? "active in " + irrigationData.zones.filter(z => z.active).map(z => z.name.split(" ")[0]).join(" and ") + " zones" : "currently inactive"}. Soil moisture levels are at ${agricultureData.soil}%, which is ${parseFloat(agricultureData.soil) > 40 ? "within optimal range" : "below optimal range"}. ${irrigationData.recommendation}`;
  } 
  // Weather-related queries
  else if (lowerMessage.includes("weather") || lowerMessage.includes("forecast") || lowerMessage.includes("temperature")) {
    const forecast = simulateWeatherForecast(timestamp);
    aiResponse = `The weather forecast shows ${forecast[0].icon.includes("sun") ? "sunny" : forecast[0].icon.includes("rain") ? "rainy" : "cloudy"} conditions today with a high of ${forecast[0].temperature}. ${forecast[2].icon.includes("rain") ? "There's a chance of rain on " + forecast[2].day + " which should help with water conservation. I've already adjusted irrigation schedules accordingly." : "The next few days look " + (forecast.every(f => f.icon.includes("sun")) ? "consistently sunny" : "mixed") + ". I'll optimize irrigation based on this forecast."}`;
  }
  // System-wide queries
  else if (lowerMessage.includes("system") || lowerMessage.includes("overall") || lowerMessage.includes("status")) {
    const dashboard = simulateDashboardData(timestamp);
    aiResponse = `Overall system status is ${dashboard.energy.status === "optimal" && dashboard.water.status === "optimal" && dashboard.agriculture.status === "optimal" ? "optimal" : "requiring attention"}. ${dashboard.energy.status !== "optimal" ? "Energy systems need attention. " : ""}${dashboard.water.status !== "optimal" ? "Water systems need monitoring. " : ""}${dashboard.agriculture.status !== "optimal" ? "Agricultural systems require adjustment. " : ""} Would you like detailed information about a specific subsystem?`;
  }
  
  return {
    response: aiResponse,
    timestamp
  };
};