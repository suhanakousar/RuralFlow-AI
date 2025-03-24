import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRealTime } from "@/context/RealTimeContext";

// Components
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { Switch } from "@/components/ui/switch";
import { IrrigationZone } from "@/lib/types";

// Environmental thresholds
const environmentalThresholds = {
  temperature: {
    min: 15,
    max: 30,
    optimal: 25,
    unit: '°C'
  },
  humidity: {
    min: 40,
    max: 80,
    optimal: 60,
    unit: '%'
  },
  soilMoisture: {
    min: 30,
    max: 70,
    optimal: 50,
    unit: '%'
  },
  lightIntensity: {
    min: 2000,
    max: 10000,
    optimal: 6000,
    unit: 'lux'
  },
  windSpeed: {
    min: 0,
    max: 20,
    optimal: 5,
    unit: 'km/h'
  }
};

// Environmental monitoring data
const environmentalData = [
  {
    name: 'Temperature',
    current: 25,
    min: 15,
    max: 30,
    optimal: 25,
    unit: '°C',
    status: 'optimal',
    trend: 'stable',
    icon: 'thermometer-half'
  },
  {
    name: 'Humidity',
    current: 65,
    min: 40,
    max: 80,
    optimal: 60,
    unit: '%',
    status: 'warning',
    trend: 'up',
    icon: 'tint'
  },
  {
    name: 'Soil Moisture',
    current: 45,
    min: 30,
    max: 70,
    optimal: 50,
    unit: '%',
    status: 'alert',
    trend: 'down',
    icon: 'water'
  },
  {
    name: 'Light Intensity',
    current: 5500,
    min: 2000,
    max: 10000,
    optimal: 6000,
    unit: 'lux',
    status: 'optimal',
    trend: 'stable',
    icon: 'sun'
  },
  {
    name: 'Wind Speed',
    current: 8,
    min: 0,
    max: 20,
    optimal: 5,
    unit: 'km/h',
    status: 'warning',
    trend: 'up',
    icon: 'wind'
  }
];

export default function SmartAgriculture() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  
  // Fetch agriculture data
  const { data: agricultureData, isLoading } = useQuery({
    queryKey: ['/api/agriculture'],
    staleTime: 60000, // 1 minute
    refetchInterval: 60000, // Refetch every minute
  });

  // Initial irrigation zones
  const [zones, setZones] = useState<IrrigationZone[]>([
    { id: "zone1", name: "North Field Zone", active: true, duration: "15 min" },
    { id: "zone2", name: "East Field Zone", active: false, duration: "0 min" },
    { id: "zone3", name: "South Field Zone", active: true, duration: "8 min" }
  ]);
  
  const handleToggleZone = (zoneId: string) => {
    setZones(zones.map(zone => 
      zone.id === zoneId ? { ...zone, active: !zone.active } : zone
    ));
  };

  // Soil data by depth
  const soilData = [
    { depth: '10cm', moisture: 52, temperature: 24, nutrients: 78 },
    { depth: '20cm', moisture: 58, temperature: 23, nutrients: 72 },
    { depth: '30cm', moisture: 45, temperature: 22, nutrients: 65 },
    { depth: '40cm', moisture: 38, temperature: 21, nutrients: 60 },
    { depth: '50cm', moisture: 32, temperature: 20, nutrients: 55 }
  ];
  
  // Crop performance metrics
  const cropPerformanceData = [
    { month: 'Jan', growth: 10, predicted: 12 },
    { month: 'Feb', growth: 25, predicted: 28 },
    { month: 'Mar', growth: 42, predicted: 45 },
    { month: 'Apr', growth: 65, predicted: 70 },
    { month: 'May', growth: 85, predicted: 90 },
    { month: 'Jun', growth: 98, predicted: 100 }
  ];

  // Available crops
  const crops = ["Wheat", "Rice", "Corn", "Cotton", "Vegetables"];
  
  const { agricultureCardData } = useRealTime();

  // Soil health metrics
  const soilHealthData = [
    { name: 'Moisture', value: 65, threshold: 80 },
    { name: 'pH', value: 6.8, threshold: 7.5 },
    { name: 'Nitrogen', value: 45, threshold: 60 },
    { name: 'Phosphorus', value: 35, threshold: 50 },
    { name: 'Potassium', value: 55, threshold: 70 }
  ];
  
  // Crop growth data
  const growthData = [
    { date: '01/03', height: 45, health: 92, yield: 85 },
    { date: '02/03', height: 48, health: 90, yield: 87 },
    { date: '03/03', height: 52, health: 88, yield: 89 },
    { date: '04/03', height: 55, health: 95, yield: 91 },
    { date: '05/03', height: 58, health: 93, yield: 93 },
    { date: '06/03', height: 62, health: 94, yield: 95 },
    { date: '07/03', height: 65, health: 96, yield: 97 }
  ];
  
  // Weather data
  const weatherData = [
    { time: '00:00', temperature: 22, humidity: 65, rainfall: 0 },
    { time: '04:00', temperature: 20, humidity: 70, rainfall: 0 },
    { time: '08:00', temperature: 25, humidity: 60, rainfall: 0 },
    { time: '12:00', temperature: 28, humidity: 55, rainfall: 0 },
    { time: '16:00', temperature: 26, humidity: 58, rainfall: 2 },
    { time: '20:00', temperature: 23, humidity: 68, rainfall: 0 },
    { time: '24:00', temperature: 21, humidity: 72, rainfall: 0 }
  ];

  // Additional crop-specific metrics
  const cropMetrics = [
    { name: 'Growth Rate', value: 2.5, unit: 'cm/day', trend: 'up' },
    { name: 'Leaf Area Index', value: 3.8, unit: 'm²/m²', trend: 'up' },
    { name: 'Biomass', value: 450, unit: 'g/m²', trend: 'up' },
    { name: 'Water Use Efficiency', value: 85, unit: '%', trend: 'down' }
  ];

  // Enhanced field zones with more details
  const fieldZones = [
    { id: 'zone1', name: 'North Field', status: 'healthy', moisture: 65, temperature: 24, area: '2.5 acres' },
    { id: 'zone2', name: 'East Field', status: 'warning', moisture: 45, temperature: 26, area: '3.2 acres' },
    { id: 'zone3', name: 'South Field', status: 'alert', moisture: 35, temperature: 28, area: '2.8 acres' },
    { id: 'zone4', name: 'West Field', status: 'healthy', moisture: 70, temperature: 23, area: '3.0 acres' }
  ];

  // Additional alert types with more specific data
  const alerts = [
    // Critical Alerts
    {
      id: '1',
      type: 'pest',
      severity: 'danger',
      title: 'Severe Pest Infestation',
      location: 'Field B - North Section',
      time: '30 minutes ago',
      value: 'Critical',
      threshold: 'Low',
      action: 'treatment',
      description: 'Large-scale pest infestation detected with rapid population growth. Immediate action required.'
    },
    {
      id: '2',
      type: 'disease',
      severity: 'danger',
      title: 'Disease Outbreak',
      location: 'Field A - South Section',
      time: '1 hour ago',
      value: 'High',
      threshold: 'Low',
      action: 'treat',
      description: 'Fungal infection spreading rapidly across multiple plants. Quarantine measures needed.'
    },
    {
      id: '3',
      type: 'moisture',
      severity: 'danger',
      title: 'Critical Water Shortage',
      location: 'Field C - Entire Field',
      time: '2 hours ago',
      value: '15%',
      threshold: '30%',
      action: 'irrigation',
      description: 'Severe water deficiency detected. Crops at risk of permanent damage.'
    },
    {
      id: '4',
      type: 'nutrient',
      severity: 'danger',
      title: 'Severe Nutrient Deficiency',
      location: 'Field D - East Section',
      time: '3 hours ago',
      value: '1.2 mg/kg',
      threshold: '3.5 mg/kg',
      action: 'fertilize',
      description: 'Critical nitrogen deficiency detected. Immediate fertilization required.'
    },

    // Warning Alerts
    {
      id: '5',
      type: 'pest',
      severity: 'warning',
      title: 'Pest Activity Increasing',
      location: 'Field C - West Section',
      time: '2 hours ago',
      value: 'Medium',
      threshold: 'Low',
      action: 'monitor',
      description: 'Growing pest population detected. Regular monitoring recommended.'
    },
    {
      id: '6',
      type: 'moisture',
      severity: 'warning',
      title: 'Low Soil Moisture',
      location: 'Field A - Central Section',
      time: '3 hours ago',
      value: '35%',
      threshold: '45%',
      action: 'irrigation',
      description: 'Soil moisture levels below optimal range. Irrigation recommended.'
    },
    {
      id: '7',
      type: 'harvest',
      severity: 'warning',
      title: 'Harvest Window Closing',
      location: 'Field B - South Section',
      time: '4 hours ago',
      value: '95%',
      threshold: '90%',
      action: 'schedule',
      description: 'Crops reaching peak maturity. Harvest scheduling recommended.'
    },
    {
      id: '8',
      type: 'disease',
      severity: 'warning',
      title: 'Disease Risk High',
      location: 'Field D - North Section',
      time: '5 hours ago',
      value: 'Medium',
      threshold: 'Low',
      action: 'prevent',
      description: 'Environmental conditions favorable for disease development.'
    },

    // Info Alerts
    {
      id: '9',
      type: 'moisture',
      severity: 'info',
      title: 'Optimal Moisture Level',
      location: 'Field C - East Section',
      time: '1 hour ago',
      value: '55%',
      threshold: '50%',
      action: 'monitor',
      description: 'Soil moisture levels within optimal range. Continue regular monitoring.'
    },
    {
      id: '10',
      type: 'nutrient',
      severity: 'info',
      title: 'Nutrient Levels Stable',
      location: 'Field A - North Section',
      time: '2 hours ago',
      value: '4.2 mg/kg',
      threshold: '4.0 mg/kg',
      action: 'monitor',
      description: 'Soil nutrient levels maintaining optimal range.'
    },
    {
      id: '11',
      type: 'harvest',
      severity: 'info',
      title: 'Harvest Readiness',
      location: 'Field B - Central Section',
      time: '3 hours ago',
      value: '85%',
      threshold: '90%',
      action: 'schedule',
      description: 'Crops approaching optimal harvest maturity.'
    },
    {
      id: '12',
      type: 'pest',
      severity: 'info',
      title: 'Pest Activity Low',
      location: 'Field D - South Section',
      time: '4 hours ago',
      value: 'Low',
      threshold: 'Low',
      action: 'monitor',
      description: 'Pest activity within normal range. Regular monitoring continuing.'
    }
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

  const [activeAlerts, setActiveAlerts] = useState(alerts);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  // Add alert action handlers
  const handleAlertAction = (alertId: string, action: string) => {
    setSelectedAlert(alertId);
    // Simulate action processing
    setTimeout(() => {
      setSelectedAlert(null);
      // Update alert status based on action
      setActiveAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: 'processing' }
            : alert
        )
      );
    }, 2000);
  };

  const handleAlertSecondaryAction = (alertId: string, action: string) => {
    setSelectedAlert(alertId);
    // Simulate secondary action processing
    setTimeout(() => {
      setSelectedAlert(null);
      // Update alert status based on action
      setActiveAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: 'processing' }
            : alert
        )
      );
    }, 2000);
  };
  
  return (
    <DashboardLayout title="Smart Agriculture Management" actions={actions}>
      {/* Environmental Monitoring */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg mb-6"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center mr-2">
                <i className="fas fa-leaf text-accent"></i>
              </div>
              <h3 className="font-bold text-white">Environmental Monitoring</h3>
            </div>
            <div className="flex space-x-2">
              <button 
                className="text-xs px-2 py-1 rounded-lg bg-gray-700/40 text-gray-300 hover:bg-gray-700/70 hover:text-white"
                title="View historical data"
              >
                <i className="fas fa-history mr-1"></i>
                History
              </button>
              <button 
                className="text-xs px-2 py-1 rounded-lg bg-gray-700/40 text-gray-300 hover:bg-gray-700/70 hover:text-white"
                title="Configure thresholds"
              >
                <i className="fas fa-sliders-h mr-1"></i>
                Thresholds
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {environmentalData.map((metric, index) => (
              <div 
                key={index}
                className={`bg-gray-700/40 rounded-lg p-4 border-l-4 border-${
                  metric.status === 'optimal' ? 'accent' :
                  metric.status === 'warning' ? 'warning' :
                  'danger'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <i className={`fas fa-${metric.icon} mr-2 text-${
                      metric.status === 'optimal' ? 'accent' :
                      metric.status === 'warning' ? 'warning' :
                      'danger'
                    }`}></i>
                    <span className="text-sm font-medium">{metric.name}</span>
                  </div>
                  <span className={`text-xs ${
                    metric.trend === 'up' ? 'text-accent' :
                    metric.trend === 'down' ? 'text-danger' :
                    'text-gray-400'
                  }`}>
                    <i className={`fas fa-arrow-${metric.trend} mr-1`}></i>
                    {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
                
                <div className="flex items-baseline mb-2">
                  <span className="text-2xl font-bold">{metric.current}</span>
                  <span className="text-xs text-gray-400 ml-1">{metric.unit}</span>
                </div>

                <div className="relative h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full ${
                      metric.status === 'optimal' ? 'bg-accent' :
                      metric.status === 'warning' ? 'bg-warning' :
                      'bg-danger'
                    }`}
                    style={{ 
                      width: `${((metric.current - metric.min) / (metric.max - metric.min)) * 100}%`
                    }}
                  ></div>
                  <div 
                    className="absolute top-0 left-0 h-full border-l-2 border-white/50"
                    style={{ 
                      left: `${((metric.optimal - metric.min) / (metric.max - metric.min)) * 100}%`
                    }}
                  ></div>
                </div>

                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>{metric.min}{metric.unit}</span>
                  <span>Optimal: {metric.optimal}{metric.unit}</span>
                  <span>{metric.max}{metric.unit}</span>
                </div>

                {metric.status !== 'optimal' && (
                  <div className="mt-2 text-xs text-warning">
                    {metric.status === 'warning' ? (
                      <span>
                        <i className="fas fa-exclamation-triangle mr-1"></i>
                        {metric.current > metric.optimal ? 'Above optimal range' : 'Below optimal range'}
                      </span>
                    ) : (
                      <span>
                        <i className="fas fa-exclamation-circle mr-1"></i>
                        {metric.current > metric.max ? 'Exceeding maximum threshold' : 'Below minimum threshold'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/40 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">Environmental Health Score</h4>
              <div className="flex items-center">
                <div className="relative h-16 w-16 mr-4">
                  <div className="absolute inset-0 rounded-full border-4 border-accent/30"></div>
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-accent/80 to-accent/30 rounded-full overflow-hidden"
                    style={{ height: '85%' }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">85%</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400 mb-1">Overall environmental conditions</div>
                  <div className="text-xs text-accent">
                    <i className="fas fa-check-circle mr-1"></i>
                    4 metrics within optimal range
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/40 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">Recommendations</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start">
                  <i className="fas fa-tint text-accent mt-0.5 mr-2"></i>
                  <span>Increase irrigation in South Field due to low soil moisture</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-wind text-warning mt-0.5 mr-2"></i>
                  <span>Consider deploying wind barriers as wind speed is increasing</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-cloud-sun text-primary mt-0.5 mr-2"></i>
                  <span>Adjust greenhouse ventilation to maintain optimal humidity</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Agriculture Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
            >
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center mr-2">
                <i className="fas fa-seedling text-accent"></i>
              </div>
              <h3 className="font-bold text-white">Crop Status</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative h-44 w-44 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-accent/30"></div>
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-accent/80 to-accent/30 rounded-full overflow-hidden transition-all duration-1000"
                  style={{ height: `${agricultureCardData?.metrics?.[0]?.value ?? 0}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-white">{agricultureCardData?.metrics?.[0]?.value ?? 0}%</span>
                    <p className="text-sm text-gray-300">Growth</p>
                  </div>
                </div>
                    </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-gray-700/40 rounded-lg p-2 text-center">
                  <h4 className="text-xs text-gray-400">Health</h4>
                  <p className="text-sm font-medium">{agricultureCardData?.metrics?.[1]?.value ?? 0}%</p>
                  </div>
                <div className="bg-gray-700/40 rounded-lg p-2 text-center">
                  <h4 className="text-xs text-gray-400">Yield</h4>
                  <p className="text-sm font-medium">{agricultureCardData?.metrics?.[2]?.value ?? 0}%</p>
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
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center mr-2">
                <i className="fas fa-cloud-sun text-accent"></i>
                  </div>
              <h3 className="font-bold text-white">Weather Conditions</h3>
                </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weatherData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#475569" />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} stroke="#475569" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} stroke="#475569" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                    labelStyle={{ color: '#e2e8f0' }}
                    formatter={(value, name) => [`${value}${name === 'temperature' ? '°C' : name === 'humidity' ? '%' : 'mm'}`, name]}
                  />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="temperature" 
                    name="Temperature"
                    stroke="#10b981" 
                    strokeWidth={2}
                    fill="url(#tempGradient)" 
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="humidity" 
                    name="Humidity"
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fill="url(#humidityGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
                  </div>
            <div className="flex justify-between mt-2">
              <div className="text-center">
                <h4 className="text-xs text-gray-400">Temperature</h4>
                <p className="text-sm font-medium">{agricultureCardData?.metrics?.[3]?.value ?? 0}°C</p>
                    </div>
              <div className="text-center">
                <h4 className="text-xs text-gray-400">Humidity</h4>
                <p className="text-sm font-medium">{agricultureCardData?.metrics?.[4]?.value ?? 0}%</p>
                    </div>
              <div className="text-center">
                <h4 className="text-xs text-gray-400">Rainfall</h4>
                <p className="text-sm font-medium">{agricultureCardData?.metrics?.[5]?.value ?? 0}mm</p>
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
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center mr-2">
                <i className="fas fa-flask text-accent"></i>
              </div>
              <h3 className="font-bold text-white">Soil Health</h3>
            </div>
            <div className="space-y-3">
              {soilHealthData.map((item, index) => (
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
              <h4 className="text-xs text-gray-400">Overall Health</h4>
              <p className="text-lg font-medium text-white">{agricultureCardData?.metrics?.[6]?.value ?? 0}<small>%</small></p>
              <span className="text-xs text-accent">Optimal conditions</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Additional Crop Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg mb-6"
      >
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center mr-2">
              <i className="fas fa-chart-line text-accent"></i>
            </div>
            <h3 className="font-bold text-white">Crop Performance Metrics</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cropMetrics.map((metric, index) => (
              <div key={index} className="bg-gray-700/40 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs text-gray-400">{metric.name}</h4>
                  <span className={`text-xs ${metric.trend === 'up' ? 'text-accent' : 'text-danger'}`}>
                    <i className={`fas fa-arrow-${metric.trend} mr-1`}></i>
                    {metric.trend === 'up' ? '↑' : '↓'}
                  </span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-lg font-medium">{metric.value}</span>
                  <span className="text-xs text-gray-400 ml-1">{metric.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
          
      {/* Crop Growth Analytics */}
            <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg mb-6"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white">Crop Growth Metrics</h3>
            <div className="flex space-x-2 text-sm">
              <button className="px-3 py-1 rounded-lg bg-gray-700/40 text-gray-300 hover:bg-gray-700/70 hover:text-white">
                Week
              </button>
              <button className="px-3 py-1 rounded-lg bg-accent/20 text-accent">
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
                data={growthData}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#475569" />
                <YAxis tick={{ fontSize: 12 }} stroke="#475569" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                        labelStyle={{ color: '#e2e8f0' }}
                  formatter={(value, name) => [`${value}${name === 'height' ? 'cm' : '%'}`, name]}
                />
                <Legend verticalAlign="bottom" />
                <Line 
                  type="monotone" 
                  dataKey="height" 
                  name="Height" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="health" 
                  name="Health" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="yield" 
                  name="Yield" 
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
            
      {/* Field Status & Alerts */}
            <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gray-800 rounded-xl p-4 border border-gray-700"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-white">Field Status & Alerts</h3>
          <div className="flex items-center space-x-2">
            <button 
              className="text-xs px-2 py-1 rounded-lg bg-gray-700/40 text-gray-300 hover:bg-gray-700/70 hover:text-white"
              title="View field map"
            >
              <i className="fas fa-map mr-1"></i>
              View Map
                  </button>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/20 text-warning">
              {alerts.length} alerts
            </span>
          </div>
        </div>

        {/* Field Zones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {fieldZones.map((zone) => (
            <div key={zone.id} className="bg-gray-700/40 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{zone.name}</h4>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  zone.status === 'healthy' ? 'bg-success/20 text-success' :
                  zone.status === 'warning' ? 'bg-warning/20 text-warning' :
                  'bg-danger/20 text-danger'
                }`}>
                  {zone.status.charAt(0).toUpperCase() + zone.status.slice(1)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Moisture:</span>
                  <span className="ml-1 text-white">{zone.moisture}</span>
                </div>
                <div>
                  <span className="text-gray-400">Temperature:</span>
                  <span className="ml-1 text-white">{zone.temperature}</span>
                </div>
                <div>
                  <span className="text-gray-400">Area:</span>
                  <span className="ml-1 text-white">{zone.area}</span>
                      </div>
                      </div>
                    </div>
                  ))}
                </div>
                
        {/* Alerts */}
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`bg-gray-700/40 rounded-lg p-3 border-l-4 border-${
                alert.severity === 'warning' ? 'warning' :
                alert.severity === 'danger' ? 'danger' :
                'primary'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-full bg-${
                    alert.severity === 'warning' ? 'warning' :
                    alert.severity === 'danger' ? 'danger' :
                    'primary'
                  }/20 flex items-center justify-center mr-3`}>
                    <i className={`fas fa-${
                      alert.type === 'moisture' ? 'tint' :
                      alert.type === 'pest' ? 'bug' :
                      alert.type === 'harvest' ? 'info-circle' :
                      alert.type === 'nutrient' ? 'flask' :
                      'virus'
                    } text-${
                      alert.severity === 'warning' ? 'warning' :
                      alert.severity === 'danger' ? 'danger' :
                      'primary'
                    }`}></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{alert.title}</h4>
                    <p className="text-xs text-gray-400">{alert.location}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{alert.time}</span>
              </div>
              {alert.description && (
                <p className="mt-2 text-xs text-gray-400">{alert.description}</p>
              )}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleAlertAction(alert.id, alert.action)}
                    disabled={selectedAlert === alert.id}
                    className={`text-xs bg-${
                      alert.severity === 'warning' ? 'warning' :
                      alert.severity === 'danger' ? 'danger' :
                      'primary'
                    }/20 hover:bg-${
                      alert.severity === 'warning' ? 'warning' :
                      alert.severity === 'danger' ? 'danger' :
                      'primary'
                    }/30 text-${
                      alert.severity === 'warning' ? 'warning' :
                      alert.severity === 'danger' ? 'danger' :
                      'primary'
                    } rounded px-2 py-0.5 transition-all duration-200 ${
                      selectedAlert === alert.id ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                    }`}
                  >
                    {selectedAlert === alert.id ? (
                      <span className="flex items-center">
                        <i className="fas fa-spinner fa-spin mr-1"></i>
                        Processing...
                      </span>
                    ) : (
                      alert.action === 'irrigation' ? 'Activate Irrigation' :
                      alert.action === 'treatment' ? 'Apply Treatment' :
                      alert.action === 'schedule' ? 'Schedule Harvest' :
                      alert.action === 'fertilize' ? 'Apply Fertilizer' :
                      alert.action === 'drainage' ? 'Adjust Drainage' :
                      alert.action === 'monitor' ? 'Monitor Closely' :
                      alert.action === 'prevent' ? 'Preventive Action' :
                      'Treat Disease'
                    )}
                  </button>
                  <button 
                    onClick={() => handleAlertSecondaryAction(alert.id, alert.action)}
                    disabled={selectedAlert === alert.id}
                    className={`text-xs bg-gray-600 hover:bg-gray-700 text-gray-300 rounded px-2 py-0.5 transition-all duration-200 ${
                      selectedAlert === alert.id ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                    }`}
                  >
                    {selectedAlert === alert.id ? (
                      <span className="flex items-center">
                        <i className="fas fa-spinner fa-spin mr-1"></i>
                        Processing...
                      </span>
                    ) : (
                      alert.action === 'irrigation' ? 'Adjust Schedule' :
                      alert.action === 'treatment' ? 'Investigate' :
                      alert.action === 'schedule' ? 'Postpone' :
                      alert.action === 'fertilize' ? 'Analyze' :
                      alert.action === 'drainage' ? 'Check System' :
                      alert.action === 'monitor' ? 'Set Traps' :
                      alert.action === 'prevent' ? 'Review Plan' :
                      'Monitor'
                    )}
                  </button>
                </div>
                <div className="text-xs text-gray-400">
                  {alert.value} / {alert.threshold}
                </div>
              </div>
            </div>
          ))}
            </div>
          </motion.div>
    </DashboardLayout>
  );
}