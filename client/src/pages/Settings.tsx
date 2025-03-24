import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { useSidebar } from "@/context/SidebarContext";

// Components
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

export default function Settings() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isCollapsed } = useSidebar();
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'system' | 'api'>('general');
  
  // System settings with default values
  const [settings, setSettings] = useState({
    // General
    theme: 'dark',
    language: 'english',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    
    // Security
    enableTwoFactor: false,
    sessionTimeout: 30,
    requirePasswordChange: 90,
    
    // Notifications
    emailAlerts: true,
    smsAlerts: false,
    criticalAlertsOnly: false,
    maintenanceNotifications: true,
    
    // System
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: 90,
    systemUpdates: 'auto',
    
    // API
    enableApi: true,
    apiThrottling: true,
    apiRateLimit: 1000,
    logApiCalls: true
  });
  
  const handleSettingChange = (settingName: string, value: any) => {
    setSettings({
      ...settings,
      [settingName]: value
    });
  };
  
  const handleBooleanToggle = (settingName: string) => {
    setSettings({
      ...settings,
      [settingName]: !settings[settingName as keyof typeof settings]
    });
  };
  
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Settings</h2>
              <p className="text-gray-400 text-sm">Configure your RuralFlow AI system</p>
            </div>
            
            <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors">
              Save Changes
            </button>
          </div>
          
          {/* Settings navigation and content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Settings navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-1"
            >
              <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="font-medium text-white">Settings Menu</h3>
                </div>
                <nav className="p-2">
                  <button 
                    className={`w-full flex items-center p-3 rounded-lg text-left text-sm ${activeTab === 'general' ? 'bg-primary/20 text-primary' : 'hover:bg-gray-700/40'}`}
                    onClick={() => setActiveTab('general')}
                  >
                    <i className="fas fa-sliders-h w-6"></i>
                    <span>General</span>
                  </button>
                  <button 
                    className={`w-full flex items-center p-3 rounded-lg text-left text-sm ${activeTab === 'security' ? 'bg-primary/20 text-primary' : 'hover:bg-gray-700/40'}`}
                    onClick={() => setActiveTab('security')}
                  >
                    <i className="fas fa-shield-alt w-6"></i>
                    <span>Security</span>
                  </button>
                  <button 
                    className={`w-full flex items-center p-3 rounded-lg text-left text-sm ${activeTab === 'notifications' ? 'bg-primary/20 text-primary' : 'hover:bg-gray-700/40'}`}
                    onClick={() => setActiveTab('notifications')}
                  >
                    <i className="fas fa-bell w-6"></i>
                    <span>Notifications</span>
                  </button>
                  <button 
                    className={`w-full flex items-center p-3 rounded-lg text-left text-sm ${activeTab === 'system' ? 'bg-primary/20 text-primary' : 'hover:bg-gray-700/40'}`}
                    onClick={() => setActiveTab('system')}
                  >
                    <i className="fas fa-server w-6"></i>
                    <span>System</span>
                  </button>
                  <button 
                    className={`w-full flex items-center p-3 rounded-lg text-left text-sm ${activeTab === 'api' ? 'bg-primary/20 text-primary' : 'hover:bg-gray-700/40'}`}
                    onClick={() => setActiveTab('api')}
                  >
                    <i className="fas fa-code w-6"></i>
                    <span>API Settings</span>
                  </button>
                </nav>
                
                <div className="p-4 border-t border-gray-700 mt-2">
                  <button className="w-full py-2 bg-danger/20 text-danger rounded-lg hover:bg-danger/30 text-sm">
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* Settings content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-3"
            >
              <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-6">General Settings</h3>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-300">Interface Theme</label>
                          <select 
                            className="w-full bg-gray-700/60 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                            value={settings.theme}
                            onChange={(e) => handleSettingChange('theme', e.target.value)}
                          >
                            <option value="dark">Dark (Default)</option>
                            <option value="light">Light</option>
                            <option value="system">System Preference</option>
                          </select>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-300">Language</label>
                          <select 
                            className="w-full bg-gray-700/60 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                            value={settings.language}
                            onChange={(e) => handleSettingChange('language', e.target.value)}
                          >
                            <option value="english">English</option>
                            <option value="spanish">Spanish</option>
                            <option value="french">French</option>
                            <option value="hindi">Hindi</option>
                            <option value="chinese">Chinese</option>
                          </select>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300">Date Format</label>
                            <select 
                              className="w-full bg-gray-700/60 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                              value={settings.dateFormat}
                              onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                            >
                              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300">Time Format</label>
                            <select 
                              className="w-full bg-gray-700/60 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                              value={settings.timeFormat}
                              onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                            >
                              <option value="24h">24 Hour</option>
                              <option value="12h">12 Hour (AM/PM)</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                          <h4 className="font-medium text-white mb-2">Location Settings</h4>
                          <p className="text-sm text-gray-400 mb-3">
                            Your system is currently configured for <span className="text-white font-medium">Sundarpur Village</span>. 
                            This affects weather data, forecasting, and regional optimizations.
                          </p>
                          <button className="text-sm bg-primary/20 text-primary rounded-lg px-3 py-1.5 hover:bg-primary/30">
                            Change Location
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Security Settings</h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-700/40 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-400">Require a verification code when signing in</p>
                        </div>
                        <Switch
                          checked={settings.enableTwoFactor}
                          onCheckedChange={() => handleBooleanToggle('enableTwoFactor')}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">Session Timeout (minutes)</label>
                        <input 
                          type="number" 
                          className="w-full bg-gray-700/60 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                          value={settings.sessionTimeout}
                          onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                          min={5}
                          max={120}
                        />
                        <p className="text-xs text-gray-400">Time of inactivity before automatic logout</p>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">Password Expiry (days)</label>
                        <input 
                          type="number" 
                          className="w-full bg-gray-700/60 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                          value={settings.requirePasswordChange}
                          onChange={(e) => handleSettingChange('requirePasswordChange', parseInt(e.target.value))}
                          min={0}
                          max={365}
                        />
                        <p className="text-xs text-gray-400">Days before requiring password change (0 = never)</p>
                      </div>
                      
                      <div className="p-4 bg-gray-700/40 rounded-lg">
                        <h4 className="font-medium text-white mb-3">Access Control</h4>
                        <div className="space-y-3">
                          <button className="w-full text-left text-sm bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2">
                            Manage User Permissions
                          </button>
                          <button className="w-full text-left text-sm bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2">
                            View Access Logs
                          </button>
                          <button className="w-full text-left text-sm bg-danger/20 text-danger hover:bg-danger/30 rounded-lg px-4 py-2">
                            Revoke All Sessions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Notification Settings</h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-700/40 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white">Email Notifications</h4>
                          <p className="text-sm text-gray-400">Receive alerts and reports via email</p>
                        </div>
                        <Switch
                          checked={settings.emailAlerts}
                          onCheckedChange={() => handleBooleanToggle('emailAlerts')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-700/40 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white">SMS Alerts</h4>
                          <p className="text-sm text-gray-400">Receive critical alerts via SMS</p>
                        </div>
                        <Switch
                          checked={settings.smsAlerts}
                          onCheckedChange={() => handleBooleanToggle('smsAlerts')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-700/40 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white">Critical Alerts Only</h4>
                          <p className="text-sm text-gray-400">Only notify for high-priority issues</p>
                        </div>
                        <Switch
                          checked={settings.criticalAlertsOnly}
                          onCheckedChange={() => handleBooleanToggle('criticalAlertsOnly')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-700/40 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white">Maintenance Notifications</h4>
                          <p className="text-sm text-gray-400">Notify about scheduled maintenance</p>
                        </div>
                        <Switch
                          checked={settings.maintenanceNotifications}
                          onCheckedChange={() => handleBooleanToggle('maintenanceNotifications')}
                        />
                      </div>
                      
                      <div className="p-4 bg-gray-700/40 rounded-lg">
                        <h4 className="font-medium text-white mb-3">Notification Recipients</h4>
                        <div className="mb-3">
                          <input
                            type="email"
                            placeholder="Add email address"
                            className="w-full bg-gray-700/60 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary mb-2"
                          />
                          <button className="text-sm bg-primary/20 text-primary rounded-lg px-3 py-1.5 hover:bg-primary/30">
                            Add Recipient
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-gray-700/60 rounded-lg px-3 py-2">
                            <span className="text-sm">admin@ruralflow.ai</span>
                            <button className="text-danger hover:text-danger/80">
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                          <div className="flex items-center justify-between bg-gray-700/60 rounded-lg px-3 py-2">
                            <span className="text-sm">alerts@ruralflow.ai</span>
                            <button className="text-danger hover:text-danger/80">
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* System Settings */}
                {activeTab === 'system' && (
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-6">System Settings</h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-700/40 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white">Automatic Backups</h4>
                          <p className="text-sm text-gray-400">Regularly backup system data</p>
                        </div>
                        <Switch
                          checked={settings.autoBackup}
                          onCheckedChange={() => handleBooleanToggle('autoBackup')}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">Backup Frequency</label>
                        <select 
                          className="w-full bg-gray-700/60 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                          value={settings.backupFrequency}
                          onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                          disabled={!settings.autoBackup}
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">Data Retention (days)</label>
                        <input 
                          type="number" 
                          className="w-full bg-gray-700/60 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                          value={settings.dataRetention}
                          onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                          min={30}
                          max={365}
                        />
                        <p className="text-xs text-gray-400">How long to keep historical data before archiving</p>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">System Updates</label>
                        <select 
                          className="w-full bg-gray-700/60 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                          value={settings.systemUpdates}
                          onChange={(e) => handleSettingChange('systemUpdates', e.target.value)}
                        >
                          <option value="auto">Automatic (Recommended)</option>
                          <option value="prompt">Prompt before updating</option>
                          <option value="manual">Manual updates only</option>
                        </select>
                      </div>
                      
                      <div className="p-4 bg-gray-700/40 rounded-lg">
                        <h4 className="font-medium text-white mb-3">System Maintenance</h4>
                        <div className="space-y-3">
                          <button className="w-full text-left text-sm bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2">
                            Run System Diagnostics
                          </button>
                          <button className="w-full text-left text-sm bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2">
                            Download System Logs
                          </button>
                          <button className="w-full text-left text-sm bg-warning/20 text-warning hover:bg-warning/30 rounded-lg px-4 py-2">
                            Clear Cache & Temporary Files
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* API Settings */}
                {activeTab === 'api' && (
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-6">API Settings</h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-700/40 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white">Enable API Access</h4>
                          <p className="text-sm text-gray-400">Allow external systems to connect via API</p>
                        </div>
                        <Switch
                          checked={settings.enableApi}
                          onCheckedChange={() => handleBooleanToggle('enableApi')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-700/40 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white">API Rate Limiting</h4>
                          <p className="text-sm text-gray-400">Prevent excessive API requests</p>
                        </div>
                        <Switch
                          checked={settings.apiThrottling}
                          onCheckedChange={() => handleBooleanToggle('apiThrottling')}
                          disabled={!settings.enableApi}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">Rate Limit (requests per day)</label>
                        <input 
                          type="number" 
                          className="w-full bg-gray-700/60 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                          value={settings.apiRateLimit}
                          onChange={(e) => handleSettingChange('apiRateLimit', parseInt(e.target.value))}
                          min={100}
                          max={10000}
                          step={100}
                          disabled={!settings.enableApi || !settings.apiThrottling}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-700/40 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white">Log API Calls</h4>
                          <p className="text-sm text-gray-400">Keep a record of all API activity</p>
                        </div>
                        <Switch
                          checked={settings.logApiCalls}
                          onCheckedChange={() => handleBooleanToggle('logApiCalls')}
                          disabled={!settings.enableApi}
                        />
                      </div>
                      
                      <div className="p-4 bg-gray-700/40 rounded-lg">
                        <h4 className="font-medium text-white mb-3">API Keys</h4>
                        <p className="text-sm text-gray-400 mb-3">
                          Manage authentication keys for external services
                        </p>
                        <div className="flex items-center justify-between bg-gray-700/60 rounded-lg px-3 py-2 mb-3">
                          <div>
                            <span className="text-sm font-medium">Production Key</span>
                            <p className="text-xs text-gray-400">Last used: Today at 10:45 AM</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-primary hover:text-primary/80">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button className="text-warning hover:text-warning/80">
                              <i className="fas fa-sync-alt"></i>
                            </button>
                          </div>
                        </div>
                        <button className="text-sm bg-primary/20 text-primary rounded-lg px-3 py-1.5 hover:bg-primary/30">
                          <i className="fas fa-plus mr-1"></i> Generate New API Key
                        </button>
                      </div>
                      
                      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <h4 className="font-medium text-white mb-2">API Documentation</h4>
                        <p className="text-sm text-gray-400 mb-3">
                          Access the complete API documentation and integration guides
                        </p>
                        <button className="text-sm bg-primary/20 text-primary rounded-lg px-3 py-1.5 hover:bg-primary/30">
                          <i className="fas fa-book mr-1"></i> View Documentation
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}