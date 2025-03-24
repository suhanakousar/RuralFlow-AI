import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusCard from "@/components/dashboard/StatusCard";
import PredictiveInsights from "@/components/dashboard/PredictiveInsights";
import AIAssistant from "@/components/dashboard/AIAssistant";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import SmartIrrigationPanel from "@/components/dashboard/SmartIrrigationPanel";
import { useRealTime } from "@/context/RealTimeContext";
import { useState, useEffect } from "react";

export default function Dashboard() {
  // Use real-time data from context
  const {
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
  } = useRealTime();
  
  // State for time period selection
  const [timePeriod, setTimePeriod] = useState<'today' | 'week' | 'month'>('today');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
  const [dataRefreshInterval, setDataRefreshInterval] = useState(30000); // 30 seconds default
  
  // AI insights (these would come from ML API in production)
  const energyInsight = "Peak energy demand predicted at 7PM today. Consider optimizing load distribution.";
  const waterInsight = "Water usage elevated in northern sector. Potential leak detected with 87% confidence.";
  const irrigationRecommendation = "Increase irrigation in northeast zones. Reduce water in central area to prevent overwatering.";
  
  // Handler for export report
  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      // Simulate API call to generate report
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In production, this would trigger a download or open a modal with report options
      alert('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handler for card selection
  const handleCardSelect = (cardId: string) => {
    setSelectedCard(selectedCard === cardId ? null : cardId);
    setViewMode('detailed');
  };

  // Handler for view mode toggle
  const handleViewModeToggle = () => {
    setViewMode(viewMode === 'overview' ? 'detailed' : 'overview');
    if (viewMode === 'detailed') {
      setSelectedCard(null);
    }
  };

  // Handler for refresh interval change
  const handleRefreshIntervalChange = (interval: number) => {
    setDataRefreshInterval(interval);
    // In production, this would update the WebSocket connection interval
  };
  
  const actions = (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex space-x-2 text-sm">
        <button 
          onClick={() => setTimePeriod('today')}
          className={`px-3 py-1 rounded-lg transition-all ${
            timePeriod === 'today' 
              ? 'bg-primary/20 text-primary ring-2 ring-primary/50' 
              : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/70 hover:text-white'
          }`}
        >
          Today
        </button>
        <button 
          onClick={() => setTimePeriod('week')}
          className={`px-3 py-1 rounded-lg transition-all ${
            timePeriod === 'week' 
              ? 'bg-primary/20 text-primary ring-2 ring-primary/50' 
              : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/70 hover:text-white'
          }`}
        >
          Week
        </button>
        <button 
          onClick={() => setTimePeriod('month')}
          className={`px-3 py-1 rounded-lg transition-all ${
            timePeriod === 'month' 
              ? 'bg-primary/20 text-primary ring-2 ring-primary/50' 
              : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/70 hover:text-white'
          }`}
        >
          Month
        </button>
      </div>

      <div className="flex space-x-2 text-sm">
        <button
          onClick={handleViewModeToggle}
          className={`px-3 py-1 rounded-lg transition-all ${
            viewMode === 'detailed'
              ? 'bg-accent/20 text-accent ring-2 ring-accent/50'
              : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/70 hover:text-white'
          }`}
        >
          <i className={`fas ${viewMode === 'detailed' ? 'fa-compress' : 'fa-expand'} mr-1`}></i>
          {viewMode === 'detailed' ? 'Overview' : 'Detailed'}
        </button>
      </div>

      <div className="flex space-x-2 text-sm">
        <button
          onClick={() => handleRefreshIntervalChange(15000)}
          className={`px-3 py-1 rounded-lg transition-all ${
            dataRefreshInterval === 15000
              ? 'bg-success/20 text-success ring-2 ring-success/50'
              : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/70 hover:text-white'
          }`}
        >
          15s
        </button>
        <button
          onClick={() => handleRefreshIntervalChange(30000)}
          className={`px-3 py-1 rounded-lg transition-all ${
            dataRefreshInterval === 30000
              ? 'bg-success/20 text-success ring-2 ring-success/50'
              : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/70 hover:text-white'
          }`}
        >
          30s
        </button>
        <button
          onClick={() => handleRefreshIntervalChange(60000)}
          className={`px-3 py-1 rounded-lg transition-all ${
            dataRefreshInterval === 60000
              ? 'bg-success/20 text-success ring-2 ring-success/50'
              : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/70 hover:text-white'
          }`}
        >
          1m
        </button>
      </div>

      <button 
        onClick={handleExportReport}
        disabled={isExporting}
        className={`flex items-center space-x-2 px-4 py-2 bg-primary bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all ${
          isExporting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <i className={`fas ${isExporting ? 'fa-spinner fa-spin' : 'fa-file-export'}`}></i>
        <span>{isExporting ? 'Generating...' : 'Export Report'}</span>
      </button>
    </div>
  );
  
  return (
    <DashboardLayout title="Smart Infrastructure Overview" actions={actions}>
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={selectedCard && selectedCard !== 'energy' ? 'opacity-50' : ''}
        >
          <StatusCard 
            data={energyCardData || {
              title: "Energy Status",
              status: "optimal",
              metrics: [
                { label: "Solar", value: "0", unit: "kW" },
                { label: "Battery", value: "0", unit: "%" },
                { label: "Grid", value: "0", unit: "kW" }
              ],
              chartData: [0, 0, 0, 0, 0, 0, 0]
            }} 
            color="primary" 
            glowClass="dashboard-card shadow-lg shadow-primary/25"
            selected={selectedCard === 'energy'}
            onSelect={() => handleCardSelect('energy')}
            actions={[
              {
                label: "Optimize",
                icon: "fa-bolt",
                onClick: () => alert('Optimizing energy usage...')
              },
              {
                label: "Details",
                icon: "fa-chart-line",
                onClick: () => alert('Showing detailed energy metrics...')
              }
            ]}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={selectedCard && selectedCard !== 'water' ? 'opacity-50' : ''}
        >
          <StatusCard 
            data={waterCardData || {
              title: "Water Supply",
              status: "optimal",
              metrics: [
                { label: "Reservoir", value: "0", unit: "%" },
                { label: "Flow Rate", value: "0", unit: "L/m" },
                { label: "Quality", value: "0", unit: "%" }
              ],
              chartData: [0, 0, 0, 0, 0, 0, 0]
            }} 
            color="secondary" 
            glowClass="dashboard-card shadow-lg shadow-secondary/25"
            isSelected={selectedCard === 'water'}
            onSelect={() => handleCardSelect('water')}
            actions={[
              {
                label: "Analyze",
                icon: "fa-tint",
                onClick: () => alert('Analyzing water usage...')
              },
              {
                label: "Details",
                icon: "fa-chart-line",
                onClick: () => alert('Showing detailed water metrics...')
              }
            ]}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={selectedCard && selectedCard !== 'agriculture' ? 'opacity-50' : ''}
        >
          <StatusCard 
            data={agricultureCardData || {
              title: "Smart Agriculture",
              status: "optimal",
              metrics: [
                { label: "Soil Moisture", value: "0", unit: "%" },
                { label: "Temperature", value: "0", unit: "°C" },
                { label: "Irrigation", value: "OFF" }
              ],
              chartData: [0, 0, 0, 0, 0, 0, 0]
            }} 
            color="accent" 
            glowClass="dashboard-card shadow-lg shadow-accent/25"
            isSelected={selectedCard === 'agriculture'}
            onSelect={() => handleCardSelect('agriculture')}
            actions={[
              {
                label: "Monitor",
                icon: "fa-leaf",
                onClick: () => alert('Monitoring agriculture metrics...')
              },
              {
                label: "Details",
                icon: "fa-chart-line",
                onClick: () => alert('Showing detailed agriculture metrics...')
              }
            ]}
          />
        </motion.div>
      </div>
      
      {/* Analytics and AI Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <PredictiveInsights 
            energyInsight={energyInsight}
            waterInsight={waterInsight}
            weatherForecast={weatherForecast || [
              { day: "Mon", icon: "fa-sun", temperature: "32°C" },
              { day: "Tue", icon: "fa-cloud", temperature: "28°C" },
              { day: "Wed", icon: "fa-cloud-rain", temperature: "25°C" },
              { day: "Thu", icon: "fa-cloud-sun", temperature: "27°C" },
              { day: "Fri", icon: "fa-sun", temperature: "30°C" }
            ]}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AIAssistant />
        </motion.div>
      </div>
      
      {/* Alerts and Irrigation */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3"
        >
          <AlertsPanel alerts={alerts || []} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-3"
        >
          <SmartIrrigationPanel 
            zones={irrigationZones || []}
            aiRecommendation={irrigationRecommendation}
          />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
