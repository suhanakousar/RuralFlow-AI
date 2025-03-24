import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

interface AdminStats {
  totalActions: number;
  lastLogin: string;
  activeZones: number;
  alertsHandled: number;
  systemUptime: string;
  successRate: number;
}

interface Activity {
  id: string;
  action: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  details: string;
}

// Add new interfaces
interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  loginNotifications: boolean;
  sessionTimeout: number;
}

interface UserSettings {
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
  timezone: string;
}

export default function AdminProfile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'settings'>('overview');
  const [adminData] = useState({
    name: "Admin User",
    email: "admin@smartfarm.com",
    role: "System Administrator",
    joinDate: "2023-01-15",
    location: "Headquarters",
    phoneNumber: "+1 (555) 123-4567",
    department: "Operations",
    stats: {
      totalActions: 1234,
      lastLogin: "2024-01-20 09:30 AM",
      activeZones: 6,
      alertsHandled: 89,
      systemUptime: "99.9%",
      successRate: 95.5
    } as AdminStats,
    recentActivities: [
      {
        id: "1",
        action: "System Update",
        timestamp: "2024-01-20 10:15 AM",
        status: "success",
        details: "Successfully deployed v2.1.0"
      },
      {
        id: "2",
        action: "Alert Response",
        timestamp: "2024-01-20 09:45 AM",
        status: "warning",
        details: "Investigated high water usage in Zone 3"
      }
    ] as Activity[]
  });

  // Add new states
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    lastPasswordChange: "2024-01-01",
    loginNotifications: true,
    sessionTimeout: 30
  });

  const [userSettings, setUserSettings] = useState<UserSettings>({
    emailNotifications: true,
    darkMode: true,
    language: "English",
    timezone: "UTC+00:00"
  });

  // Add settings toggle handlers
  const toggleSetting = (setting: keyof UserSettings) => {
    setUserSettings(prev => ({
      ...prev,
      [setting]: typeof prev[setting] === 'boolean' ? !prev[setting] : prev[setting]
    }));
  };

  const toggleSecuritySetting = (setting: keyof SecuritySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: typeof prev[setting] === 'boolean' ? !prev[setting] : prev[setting]
    }));
  };

  const [, navigate] = useLocation();
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Navigation Buttons */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <i className="fas fa-home mr-2"></i>
          Home
        </button>
        <span className="text-gray-600">|</span>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <i className="fas fa-tachometer-alt mr-2"></i>
          Dashboard
        </button>
      </div>

      {/* Header Section with updated styling */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/90 to-secondary/90 rounded-2xl p-8 mb-6 relative overflow-hidden shadow-lg"
      >
        <div className="absolute inset-0 bg-grid-white/10 opacity-20"></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20 shadow-inner">
            <span className="text-4xl font-bold text-white">{adminData.name[0]}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{adminData.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-white/80">
              <span><i className="fas fa-envelope mr-2"></i>{adminData.email}</span>
              <span className="hidden sm:inline">•</span>
              <span><i className="fas fa-phone mr-2"></i>{adminData.phoneNumber}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-6">
        {(['overview', 'activity', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab 
                ? 'bg-primary text-white' 
                : 'bg-gray-700/20 text-gray-400 hover:bg-gray-700/40'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Stats */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"
          >
            {Object.entries(adminData.stats).map(([key, value]) => (
              <div key={key} className="bg-gray-800 rounded-xl p-4 border border-gray-700/50">
                <div className="text-gray-400 text-sm mb-1">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-2xl font-bold text-white">{value}</div>
              </div>
            ))}
          </motion.div>

          {/* Recent Activities */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700/50"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {adminData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-700/30">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-400' :
                    activity.status === 'warning' ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{activity.action}</div>
                    <div className="text-sm text-gray-400">{activity.details}</div>
                  </div>
                  <div className="text-sm text-gray-400">{activity.timestamp}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Additional Info */}
        <div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700/50"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Profile Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400">Department</span>
                <span className="text-white">{adminData.department}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400">Location</span>
                <span className="text-white">{adminData.location}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400">Join Date</span>
                <span className="text-white">{adminData.joinDate}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button 
                onClick={() => navigate('/admin/profile/edit')}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <i className="fas fa-edit mr-2"></i>Edit Profile
              </button>
              <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                <i className="fas fa-key mr-2"></i>Change Password
              </button>
              <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                <i className="fas fa-shield-alt mr-2"></i>Security Settings
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}