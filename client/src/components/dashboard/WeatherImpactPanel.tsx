import { motion } from "framer-motion";

interface WeatherImpactPanelProps {
  weatherData: any[];
  infrastructureImpact: {
    solarPanels: { status: string; impact: string };
    waterSystem: { status: string; impact: string };
    irrigation: { status: string; impact: string };
  };
  alerts: any[];
  onAlertDismiss: (alertId: string) => void;
  timePeriod: 'today' | 'week' | 'month';
  onRefresh: () => void;
}

export default function WeatherImpactPanel({
  weatherData,
  infrastructureImpact,
  alerts,
  onAlertDismiss,
  timePeriod,
  onRefresh
}: WeatherImpactPanelProps) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Weather Impact Analysis</h3>
        <button 
          onClick={onRefresh}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>

      {/* Current Weather */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="text-4xl text-white">
            <i className={`fas ${weatherData[0]?.icon || 'fa-sun'}`}></i>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {weatherData[0]?.temperature || 'N/A'}
            </div>
            <div className="text-sm text-gray-400">
              Humidity: {weatherData[0]?.humidity || 'N/A'}%
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure Impact */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-semibold text-gray-400">Infrastructure Impact</h4>
        
        {Object.entries(infrastructureImpact).map(([system, data]) => (
          <div key={system} className="flex items-center justify-between">
            <div className="flex items-center">
              <i className={`fas fa-${getSystemIcon(system)} text-${getStatusColor(data.status)}`}></i>
              <span className="ml-2 capitalize">{formatSystemName(system)}</span>
            </div>
            <span className={`text-${getStatusColor(data.status)}`}>
              {data.impact}
            </span>
          </div>
        ))}
      </div>

      {/* Weather Alerts */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-400">Active Alerts</h4>
        {alerts.length === 0 ? (
          <p className="text-sm text-gray-500">No active weather alerts</p>
        ) : (
          alerts.map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center justify-between bg-red-500/20 p-2 rounded"
            >
              <span className="text-sm text-red-400">{alert.message}</span>
              <button
                onClick={() => onAlertDismiss(alert.id)}
                className="text-gray-400 hover:text-white"
              >
                <i className="fas fa-times"></i>
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// Helper functions
function getSystemIcon(system: string): string {
  const icons = {
    solarPanels: 'solar-panel',
    waterSystem: 'water',
    irrigation: 'seedling'
  };
  return icons[system as keyof typeof icons] || 'question';
}

function getStatusColor(status: string): string {
  const colors = {
    optimal: 'green-400',
    caution: 'yellow-400',
    warning: 'red-400'
  };
  return colors[status as keyof typeof colors] || 'gray-400';
}

function formatSystemName(name: string): string {
  return name.replace(/([A-Z])/g, ' $1').trim();
}