import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useSidebar } from "@/context/SidebarContext";
import { 
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  Legend,
  CartesianGrid
} from "recharts";

// Components
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

export default function Analytics() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const { isCollapsed } = useSidebar();
  
  // Energy consumption data
  const energyData = [
    { date: 'Mar 15', solar: 45, battery: 20, grid: 35 },
    { date: 'Mar 16', solar: 50, battery: 25, grid: 30 },
    { date: 'Mar 17', solar: 35, battery: 40, grid: 25 },
    { date: 'Mar 18', solar: 40, battery: 35, grid: 25 },
    { date: 'Mar 19', solar: 55, battery: 20, grid: 25 },
    { date: 'Mar 20', solar: 60, battery: 25, grid: 15 },
    { date: 'Mar 21', solar: 48, battery: 22, grid: 30 }
  ];
  
  // Water usage data
  const waterData = [
    { date: 'Mar 15', usage: 320 },
    { date: 'Mar 16', usage: 350 },
    { date: 'Mar 17', usage: 310 },
    { date: 'Mar 18', usage: 340 },
    { date: 'Mar 19', usage: 360 },
    { date: 'Mar 20', usage: 320 },
    { date: 'Mar 21', usage: 290 }
  ];
  
  // Resource distribution data
  const resourceDistributionData = [
    { name: 'Energy', value: 40, color: '#00a3ff' },
    { name: 'Water', value: 30, color: '#9d00ff' },
    { name: 'Agriculture', value: 20, color: '#10b981' },
    { name: 'Maintenance', value: 10, color: '#f59e0b' }
  ];
  
  // Efficiency metrics
  const efficiencyData = [
    { metric: 'Energy Efficiency', value: 87 },
    { metric: 'Water Usage Efficiency', value: 92 },
    { metric: 'Irrigation Optimization', value: 78 },
    { metric: 'Solar Panel Output', value: 85 },
    { metric: 'Grid Independence', value: 70 }
  ];
  
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileMenuOpen} onCloseMobile={() => setIsMobileMenuOpen(false)} />
      
      {/* Main Content - Updated with transition and dynamic margin */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'md:ml-16' : 'md:ml-64'
      }`}>
        <TopBar onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        
        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto p-4">
          {/* Page header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Analytics Dashboard</h2>
              <p className="text-gray-400 text-sm">Comprehensive data visualization and insights</p>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
              <button 
                className={`px-3 py-1 rounded-lg text-sm ${timeRange === 'day' ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setTimeRange('day')}
              >
                Day
              </button>
              <button 
                className={`px-3 py-1 rounded-lg text-sm ${timeRange === 'week' ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setTimeRange('week')}
              >
                Week
              </button>
              <button 
                className={`px-3 py-1 rounded-lg text-sm ${timeRange === 'month' ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setTimeRange('month')}
              >
                Month
              </button>
              <button 
                className={`px-3 py-1 rounded-lg text-sm ${timeRange === 'year' ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setTimeRange('year')}
              >
                Year
              </button>
            </div>
          </div>
          
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-400">Energy Consumption</h3>
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <i className="fas fa-bolt text-primary"></i>
                </div>
              </div>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">8.6</p>
                <p className="text-sm text-gray-400 ml-1">kWh</p>
              </div>
              <div className="mt-2 flex items-center text-xs">
                <i className="fas fa-arrow-down text-accent mr-1"></i>
                <span className="text-accent">12% less than last week</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-400">Water Usage</h3>
                <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <i className="fas fa-water text-secondary"></i>
                </div>
              </div>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">1,240</p>
                <p className="text-sm text-gray-400 ml-1">liters</p>
              </div>
              <div className="mt-2 flex items-center text-xs">
                <i className="fas fa-arrow-up text-danger mr-1"></i>
                <span className="text-danger">8% more than last week</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-400">System Efficiency</h3>
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <i className="fas fa-chart-line text-accent"></i>
                </div>
              </div>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">92</p>
                <p className="text-sm text-gray-400 ml-1">%</p>
              </div>
              <div className="mt-2 flex items-center text-xs">
                <i className="fas fa-arrow-up text-accent mr-1"></i>
                <span className="text-accent">3% improvement</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-400">Active Alerts</h3>
                <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-warning"></i>
                </div>
              </div>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-400 ml-1">issues</p>
              </div>
              <div className="mt-2 flex items-center text-xs">
                <i className="fas fa-arrow-down text-accent mr-1"></i>
                <span className="text-accent">2 resolved since yesterday</span>
              </div>
            </motion.div>
          </div>
          
          {/* Energy & Water Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
            >
              <div className="p-4">
                <h3 className="font-bold text-white mb-4">Energy Consumption Breakdown</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={energyData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                      stackOffset="expand"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.2} />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#475569" />
                      <YAxis tickFormatter={(value) => `${value}%`} tick={{ fontSize: 12 }} stroke="#475569" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                        labelStyle={{ color: '#e2e8f0' }}
                        formatter={(value) => [`${value}%`, null]}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="solar" 
                        name="Solar" 
                        stackId="1"
                        stroke="#00a3ff" 
                        fill="#00a3ff"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="battery" 
                        name="Battery Storage" 
                        stackId="1"
                        stroke="#10b981" 
                        fill="#10b981"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="grid" 
                        name="Grid" 
                        stackId="1"
                        stroke="#f59e0b" 
                        fill="#f59e0b"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
            >
              <div className="p-4">
                <h3 className="font-bold text-white mb-4">Water Usage Trends</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={waterData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient id="waterUsageGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#9d00ff" stopOpacity={0.7} />
                          <stop offset="100%" stopColor="#9d00ff" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.2} />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#475569" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#475569" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                        labelStyle={{ color: '#e2e8f0' }}
                        formatter={(value) => [`${value} liters`, null]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="usage" 
                        name="Water Usage" 
                        stroke="#9d00ff" 
                        fillOpacity={1}
                        fill="url(#waterUsageGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Resource Distribution & Efficiency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
            >
              <div className="p-4">
                <h3 className="font-bold text-white mb-4">Resource Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={resourceDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {resourceDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                          labelStyle={{ color: '#e2e8f0' }}
                          formatter={(value) => [`${value}%`, null]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="p-4 flex flex-col justify-center">
                    <ul className="space-y-3">
                      {resourceDistributionData.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: item.color }}
                          ></span>
                          <span className="text-sm">{item.name}</span>
                          <span className="text-sm font-medium ml-auto">{item.value}%</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 p-2 bg-gray-700/40 rounded-lg text-xs text-center">
                      Total resources optimized by 15% compared to last month
                    </div>
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
                <h3 className="font-bold text-white mb-4">System Efficiency Metrics</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={efficiencyData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.2} />
                      <XAxis type="number" tick={{ fontSize: 12 }} stroke="#475569" domain={[0, 100]} />
                      <YAxis dataKey="metric" type="category" width={180} tick={{ fontSize: 11 }} stroke="#475569" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                        labelStyle={{ color: '#e2e8f0' }}
                        formatter={(value) => [`${value}%`, null]}
                      />
                      <Bar 
                        dataKey="value" 
                        name="Efficiency"
                        radius={[0, 4, 4, 0]}
                      >
                        {
                          efficiencyData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.value >= 90 ? '#10b981' : entry.value >= 80 ? '#3b82f6' : entry.value >= 70 ? '#f59e0b' : '#ef4444'} 
                            />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="bg-gray-700/40 rounded-lg p-2 text-center">
                    <h4 className="text-xs text-gray-400">Average</h4>
                    <p className="text-sm font-medium">82.4%</p>
                  </div>
                  <div className="bg-gray-700/40 rounded-lg p-2 text-center">
                    <h4 className="text-xs text-gray-400">Minimum</h4>
                    <p className="text-sm font-medium">70%</p>
                  </div>
                  <div className="bg-gray-700/40 rounded-lg p-2 text-center">
                    <h4 className="text-xs text-gray-400">Maximum</h4>
                    <p className="text-sm font-medium">92%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Predictive Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg mb-6"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white">AI-Powered Predictive Insights</h3>
                <button className="text-sm px-3 py-1 bg-primary/20 text-primary rounded-lg hover:bg-primary/30">
                  Export Report
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-gray-700/40 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <i className="fas fa-bolt text-primary"></i>
                    </div>
                    <h4 className="font-medium text-white">Energy Prediction</h4>
                  </div>
                  <p className="mt-3 text-sm">
                    Based on historical patterns and weather forecast, predicted energy consumption will 
                    <span className="text-accent font-medium"> decrease by 8%</span> next week.
                  </p>
                  <div className="mt-3">
                    <h5 className="text-xs text-gray-400 mb-1">Confidence Score</h5>
                    <div className="flex items-center">
                      <div className="relative flex-1 h-2 bg-gray-600 rounded-full overflow-hidden mr-2">
                        <div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <span className="text-xs font-medium">92%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700/40 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
                      <i className="fas fa-water text-secondary"></i>
                    </div>
                    <h4 className="font-medium text-white">Water Insight</h4>
                  </div>
                  <p className="mt-3 text-sm">
                    Water usage elevated in northern sector. Potential leak detected with 
                    <span className="text-warning font-medium"> 87% confidence</span>. Recommend infrastructure check.
                  </p>
                  <div className="mt-3">
                    <h5 className="text-xs text-gray-400 mb-1">Estimated Impact</h5>
                    <div className="flex items-center">
                      <div className="relative flex-1 h-2 bg-gray-600 rounded-full overflow-hidden mr-2">
                        <div className="absolute top-0 left-0 h-full bg-warning rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <span className="text-xs font-medium">Medium</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700/40 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                      <i className="fas fa-seedling text-accent"></i>
                    </div>
                    <h4 className="font-medium text-white">Agricultural Forecast</h4>
                  </div>
                  <p className="mt-3 text-sm">
                    Soil moisture levels predict an optimal harvest time in 
                    <span className="text-accent font-medium"> 18 days</span>. Current conditions suggest 5% yield increase over previous harvest.
                  </p>
                  <div className="mt-3">
                    <h5 className="text-xs text-gray-400 mb-1">Growth Progress</h5>
                    <div className="flex items-center">
                      <div className="relative flex-1 h-2 bg-gray-600 rounded-full overflow-hidden mr-2">
                        <div className="absolute top-0 left-0 h-full bg-accent rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <span className="text-xs font-medium">78%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-700/40 rounded-lg border border-gray-600">
                <h4 className="text-sm font-medium mb-2">System Optimization Recommendations</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-accent mt-0.5 mr-2"></i>
                    <span>Adjust irrigation schedule based on upcoming rainfall forecast to save approximately 120 liters per week.</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-accent mt-0.5 mr-2"></i>
                    <span>Optimal solar panel cleaning recommended within next 5 days to restore approximately 5% efficiency loss.</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-accent mt-0.5 mr-2"></i>
                    <span>Consider redistributing grid power usage to off-peak hours to reduce energy costs by an estimated 12%.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}