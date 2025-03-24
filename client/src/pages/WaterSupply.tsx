import { motion } from "framer-motion";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  LineChart,
  Line,
  Legend,
  CartesianGrid
} from "recharts";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRealTime } from "@/context/RealTimeContext";

export default function WaterSupply() {
  const { waterCardData } = useRealTime();

  // Water quality metrics
  const qualityData = [
    { name: 'pH', value: 7.2, threshold: 8.0 },
    { name: 'Turbidity', value: 0.5, threshold: 1.0 },
    { name: 'Chlorine', value: 0.7, threshold: 2.0 },
    { name: 'Bacteria', value: 0, threshold: 1 },
    { name: 'Minerals', value: 185, threshold: 300 }
  ];
  
  // Water consumption data by sector
  const consumptionData = [
    { date: '01/03', residential: 45, agricultural: 75, industrial: 30 },
    { date: '02/03', residential: 50, agricultural: 70, industrial: 35 },
    { date: '03/03', residential: 52, agricultural: 82, industrial: 32 },
    { date: '04/03', residential: 48, agricultural: 89, industrial: 28 },
    { date: '05/03', residential: 51, agricultural: 85, industrial: 33 },
    { date: '06/03', residential: 46, agricultural: 79, industrial: 38 },
    { date: '07/03', residential: 54, agricultural: 76, industrial: 36 }
  ];
  
  // Flow rate data over time
  const flowRateData = [
    { time: '00:00', value: 42 },
    { time: '04:00', value: 38 },
    { time: '08:00', value: 55 },
    { time: '12:00', value: 62 },
    { time: '16:00', value: 58 },
    { time: '20:00', value: 45 },
    { time: '24:00', value: 40 }
  ];

  const actions = (
    <div className="flex space-x-2">
      <button className="px-3 py-1 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
        <i className="fas fa-download mr-2"></i>
        Export Data
      </button>
      <button className="px-3 py-1 rounded-lg bg-gray-700/40 text-gray-300 hover:bg-gray-700/70 hover:text-white transition-colors">
        <i className="fas fa-cog mr-2"></i>
        Settings
      </button>
    </div>
  );
  
  return (
    <DashboardLayout title="Water Supply Management" actions={actions}>
      {/* Water System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
        >
          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center mr-2">
                <i className="fas fa-database text-secondary"></i>
              </div>
              <h3 className="font-bold text-white">Reservoir Status</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative h-44 w-44 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-secondary/30"></div>
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondary/80 to-secondary/30 rounded-full overflow-hidden transition-all duration-1000"
                  style={{ height: `${waterCardData?.metrics[0].value || 0}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-white">{waterCardData?.metrics[0].value || 0}%</span>
                    <p className="text-sm text-gray-300">Capacity</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-gray-700/40 rounded-lg p-2 text-center">
                  <h4 className="text-xs text-gray-400">Volume</h4>
                  <p className="text-sm font-medium">{waterCardData?.metrics?.[1]?.value ?? 0} m³</p>
                </div>
                <div className="bg-gray-700/40 rounded-lg p-2 text-center">
                  <h4 className="text-xs text-gray-400">Max Capacity</h4>
                  <p className="text-sm font-medium">{waterCardData?.metrics?.[2]?.value ?? 0} m³</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
        >
          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center mr-2">
                <i className="fas fa-tint text-secondary"></i>
              </div>
              <h3 className="font-bold text-white">Flow Rate</h3>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={flowRateData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9d00ff" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#9d00ff" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#475569" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#475569" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                    labelStyle={{ color: '#e2e8f0' }}
                    formatter={(value) => [`${value} L/m`, 'Flow Rate']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#9d00ff" 
                    strokeWidth={2}
                    fill="url(#flowGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-2">
              <div className="text-center">
                <h4 className="text-xs text-gray-400">Current</h4>
                <p className="text-sm font-medium">{waterCardData?.metrics?.[3]?.value ?? 0} L/m</p>
              </div>
              <div className="text-center">
                <h4 className="text-xs text-gray-400">Average</h4>
                <p className="text-sm font-medium">{waterCardData?.metrics?.[4]?.value ?? 0} L/m</p>
              </div>
              <div className="text-center">
                <h4 className="text-xs text-gray-400">Peak</h4>
                <p className="text-sm font-medium">{waterCardData?.metrics?.[5]?.value ?? 0} L/m</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
        >
          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center mr-2">
                <i className="fas fa-flask text-secondary"></i>
              </div>
              <h3 className="font-bold text-white">Water Quality</h3>
            </div>
            <div className="space-y-3">
              {qualityData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{item.name}</span>
                    <span className="text-xs font-medium">
                      {item.value} / {item.threshold}
                    </span>
                  </div>
                  <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full ${
                        item.value < item.threshold * 0.5 
                          ? 'bg-accent' 
                          : item.value < item.threshold * 0.8 
                            ? 'bg-warning' 
                            : 'bg-danger'
                      }`}
                      style={{ width: `${(item.value / item.threshold) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-gray-700/40 rounded-lg p-2 text-center">
              <h4 className="text-xs text-gray-400">Overall Quality</h4>
              <p className="text-lg font-medium text-white">{waterCardData?.metrics?.[6]?.value ?? 0}<small>%</small></p>
              <span className="text-xs text-accent">Safe for consumption</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Water Consumption Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg mb-6"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white">Water Consumption by Sector</h3>
            <div className="flex space-x-2 text-sm">
              <button className="px-3 py-1 rounded-lg bg-gray-700/40 text-gray-300 hover:bg-gray-700/70 hover:text-white">
                Week
              </button>
              <button className="px-3 py-1 rounded-lg bg-secondary/20 text-secondary">
                Month
              </button>
              <button className="px-3 py-1 rounded-lg bg-gray-700/40 text-gray-300 hover:bg-gray-700/70 hover:text-white">
                Year
              </button>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={consumptionData}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#475569" />
                <YAxis tick={{ fontSize: 12 }} stroke="#475569" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                  labelStyle={{ color: '#e2e8f0' }}
                  formatter={(value) => [`${value} m³`, null]}
                />
                <Legend verticalAlign="bottom" />
                <Line 
                  type="monotone" 
                  dataKey="residential" 
                  name="Residential" 
                  stroke="#00a3ff" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="agricultural" 
                  name="Agricultural" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="industrial" 
                  name="Industrial" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
      
      {/* Water System Alerts & Network */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Distribution Network</h3>
              <button 
                className="text-secondary hover:text-secondary/80"
                title="Expand network view"
              >
                <i className="fas fa-expand-alt"></i>
              </button>
            </div>
            
            <div className="relative h-80 bg-gray-900/60 rounded-lg p-2 overflow-hidden">
              {/* This would be a map visualization in a real application */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <i className="fas fa-map-marked-alt text-6xl mb-4"></i>
                  <p>Interactive network map</p>
                  <p className="text-xs">Showing pipeline system and sensor locations</p>
                </div>
              </div>
              
              {/* Sample network node indicators */}
              <div className="absolute top-1/4 left-1/4 h-3 w-3 rounded-full bg-accent animate-ping"></div>
              <div className="absolute top-1/4 left-1/4 h-3 w-3 rounded-full bg-accent"></div>
              
              <div className="absolute top-1/3 right-1/3 h-3 w-3 rounded-full bg-warning animate-ping"></div>
              <div className="absolute top-1/3 right-1/3 h-3 w-3 rounded-full bg-warning"></div>
              
              <div className="absolute bottom-1/4 right-1/4 h-3 w-3 rounded-full bg-accent animate-ping"></div>
              <div className="absolute bottom-1/4 right-1/4 h-3 w-3 rounded-full bg-accent"></div>
              
              <div className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-danger animate-ping"></div>
              <div className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-danger"></div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-accent rounded-full mr-2"></span>
                <span className="text-xs">Normal</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-warning rounded-full mr-2"></span>
                <span className="text-xs">Attention</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-danger rounded-full mr-2"></span>
                <span className="text-xs">Alert</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">System Alerts</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/20 text-warning">
                2 new
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gray-700/40 rounded-lg p-3 border-l-4 border-warning">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center mr-3">
                      <i className="fas fa-exclamation-triangle text-warning"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Potential Water Leak</h4>
                      <p className="text-xs text-gray-400">Northern Sector - Pipeline Junction B7</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">10 min ago</span>
                </div>
                <div className="mt-2 flex space-x-2">
                  <button className="text-xs bg-warning/20 hover:bg-warning/30 text-warning rounded px-2 py-0.5">
                    Dispatch
                  </button>
                  <button className="text-xs bg-gray-600 hover:bg-gray-700 text-gray-300 rounded px-2 py-0.5">
                    Ignore
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-700/40 rounded-lg p-3 border-l-4 border-danger">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-danger/20 flex items-center justify-center mr-3">
                      <i className="fas fa-tint-slash text-danger"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Pressure Drop Detected</h4>
                      <p className="text-xs text-gray-400">Main Pipeline - Sector 4</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">25 min ago</span>
                </div>
                <div className="mt-2 flex space-x-2">
                  <button className="text-xs bg-danger/20 hover:bg-danger/30 text-danger rounded px-2 py-0.5">
                    Fix Now
                  </button>
                  <button className="text-xs bg-gray-600 hover:bg-gray-700 text-gray-300 rounded px-2 py-0.5">
                    Investigate
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-700/40 rounded-lg p-3 border-l-4 border-primary">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <i className="fas fa-info-circle text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Scheduled Maintenance</h4>
                      <p className="text-xs text-gray-400">Reservoir Pump - Station 12</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
                <div className="mt-2 flex space-x-2">
                  <button className="text-xs bg-primary/20 hover:bg-primary/30 text-primary rounded px-2 py-0.5">
                    Schedule
                  </button>
                  <button className="text-xs bg-gray-600 hover:bg-gray-700 text-gray-300 rounded px-2 py-0.5">
                    Postpone
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Alerts and Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gray-800 rounded-xl p-4 border border-gray-700"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-white">Alerts and Notifications</h3>
          <div className="flex items-center space-x-2">
            <button 
              className="px-3 py-1 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center"
              title="Refresh alerts"
            >
              <i className="fas fa-sync-alt mr-2"></i>
              Refresh
            </button>
            <button 
              className="px-3 py-1 rounded-lg bg-gray-700/40 text-gray-300 hover:bg-gray-700/70 hover:text-white transition-colors flex items-center"
              title="Configure alert settings"
            >
              <i className="fas fa-cog mr-2"></i>
              Settings
            </button>
          </div>
        </div>
        
        {/* Alert content */}
        <div className="space-y-3">
          <div className="bg-gray-700/40 rounded-lg p-3 border-l-4 border-warning">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center mr-3">
                  <i className="fas fa-exclamation-triangle text-warning"></i>
                </div>
                <div>
                  <h4 className="font-medium text-white">Potential Water Leak</h4>
                  <p className="text-xs text-gray-400">Northern Sector - Pipeline Junction B7</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">10 min ago</span>
            </div>
            <div className="mt-2 flex space-x-2">
              <button className="text-xs bg-warning/20 hover:bg-warning/30 text-warning rounded px-2 py-0.5">
                Dispatch
              </button>
              <button className="text-xs bg-gray-600 hover:bg-gray-700 text-gray-300 rounded px-2 py-0.5">
                Ignore
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}