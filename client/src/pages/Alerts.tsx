import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Alert } from "@/lib/types";
import { useSidebar } from "@/context/SidebarContext";

// Components
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

// Tabs for different alert types
type AlertTab = 'all' | 'active' | 'warning' | 'danger' | 'info' | 'resolved';

export default function Alerts() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isCollapsed } = useSidebar();
  const [activeTab, setActiveTab] = useState<AlertTab>('all');
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch alerts data
  const { data: alertsData, isLoading } = useQuery({
    queryKey: ['/api/alerts'],
    staleTime: 60000, // 1 minute
    refetchInterval: 60000, // Refetch every minute
  });

  // Sample alerts data
  const alerts: Alert[] = [
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
    },
    {
      id: "4",
      type: "warning",
      title: "Soil Moisture Below Threshold",
      location: "South Field - Zone 2",
      time: "1 hour ago",
      icon: "fas fa-seedling",
      primaryAction: "Irrigate",
      secondaryAction: "Ignore"
    },
    {
      id: "5",
      type: "info",
      title: "Data Backup Completed",
      location: "System",
      time: "3 hours ago",
      icon: "fas fa-server",
      primaryAction: "View",
      secondaryAction: "Dismiss"
    },
    {
      id: "6",
      type: "danger",
      title: "Critical Battery Level",
      location: "Energy Storage - Unit 3",
      time: "15 min ago",
      icon: "fas fa-battery-quarter",
      primaryAction: "Enable Charging",
      secondaryAction: "Investigate"
    },
    {
      id: "7",
      type: "warning",
      title: "Irrigation System Pressure Drop",
      location: "Main Pump - Station 2",
      time: "45 min ago",
      icon: "fas fa-tint-slash",
      primaryAction: "Check",
      secondaryAction: "Ignore"
    },
    {
      id: "8",
      type: "info",
      title: "Weather Alert: Rain Expected",
      location: "All Zones",
      time: "5 hours ago",
      icon: "fas fa-cloud-rain",
      primaryAction: "Adjust Schedule",
      secondaryAction: "Dismiss"
    }
  ];

  // Filter alerts based on active tab and search query
  const filteredAlerts = alerts.filter(alert => {
    const matchesTab = activeTab === 'all' || alert.type === activeTab;
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      alert.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return {
          border: 'border-warning',
          bg: 'bg-warning/20',
          text: 'text-warning',
          icon: 'fas fa-exclamation-triangle'
        };
      case 'danger':
        return {
          border: 'border-danger',
          bg: 'bg-danger/20',
          text: 'text-danger',
          icon: 'fas fa-bolt'
        };
      case 'info':
      default:
        return {
          border: 'border-primary',
          bg: 'bg-primary/20',
          text: 'text-primary',
          icon: 'fas fa-info-circle'
        };
    }
  };
  
  const getTabCount = (tab: AlertTab) => {
    if (tab === 'all') return alerts.length;
    return alerts.filter(alert => alert.type === tab).length;
  };
  
  const [displayedAlerts, setDisplayedAlerts] = useState(alerts);
  
  const handlePrimaryAction = (alertId: string) => {
    // In a real application, this would handle the primary action based on the alert type
    console.log(`Primary action for alert ${alertId}`);
  };
  
  const handleSecondaryAction = (alertId: string) => {
    // Remove the alert from the displayed list
    setDisplayedAlerts(alerts.filter(alert => alert.id !== alertId));
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Alerts & Notifications</h2>
              <p className="text-gray-400 text-sm">Monitor and manage system alerts and notifications</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-search text-gray-400"></i>
                </span>
                <input 
                  type="text" 
                  placeholder="Search alerts..." 
                  className="w-full bg-gray-700/40 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors flex items-center justify-center">
                <i className="fas fa-bell-slash mr-2"></i>
                <span>Mark All as Read</span>
              </button>
            </div>
          </div>
          
          {/* Alert Tabs */}
          <div className="mb-6 border-b border-gray-700">
            <div className="flex overflow-x-auto space-x-4 pb-2">
              <button 
                className={`pb-2 px-1 text-sm font-medium flex items-center ${activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('all')}
              >
                All
                <span className="ml-2 bg-gray-700 text-xs px-2 py-0.5 rounded-full">{getTabCount('all')}</span>
              </button>
              <button 
                className={`pb-2 px-1 text-sm font-medium flex items-center ${activeTab === 'active' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('active')}
              >
                Active
                <span className="ml-2 bg-gray-700 text-xs px-2 py-0.5 rounded-full">{getTabCount('all')}</span>
              </button>
              <button 
                className={`pb-2 px-1 text-sm font-medium flex items-center ${activeTab === 'warning' ? 'text-warning border-b-2 border-warning' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('warning')}
              >
                Warnings
                <span className="ml-2 bg-warning/20 text-warning text-xs px-2 py-0.5 rounded-full">{getTabCount('warning')}</span>
              </button>
              <button 
                className={`pb-2 px-1 text-sm font-medium flex items-center ${activeTab === 'danger' ? 'text-danger border-b-2 border-danger' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('danger')}
              >
                Critical
                <span className="ml-2 bg-danger/20 text-danger text-xs px-2 py-0.5 rounded-full">{getTabCount('danger')}</span>
              </button>
              <button 
                className={`pb-2 px-1 text-sm font-medium flex items-center ${activeTab === 'info' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('info')}
              >
                Information
                <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">{getTabCount('info')}</span>
              </button>
              <button 
                className={`pb-2 px-1 text-sm font-medium flex items-center ${activeTab === 'resolved' ? 'text-gray-300 border-b-2 border-gray-300' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('resolved')}
              >
                Resolved
                <span className="ml-2 bg-gray-700 text-xs px-2 py-0.5 rounded-full">0</span>
              </button>
            </div>
          </div>
          
          {/* Alerts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => {
                const styles = getAlertStyles(alert.type);
                
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={`bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg`}
                  >
                    <div className={`p-4 border-l-4 ${styles.border}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full ${styles.bg} flex items-center justify-center mr-3`}>
                            <i className={`${alert.icon} ${styles.text}`}></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{alert.title}</h4>
                            <p className="text-xs text-gray-400">{alert.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-400">{alert.time}</span>
                          <div className="flex mt-1 space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles.bg} ${styles.text}`}>
                              {alert.type === 'warning' ? 'Warning' : alert.type === 'danger' ? 'Critical' : 'Info'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        <button 
                          className={`text-sm ${styles.bg} hover:bg-opacity-30 ${styles.text} rounded-lg px-3 py-1`}
                          onClick={() => handlePrimaryAction(alert.id)}
                        >
                          {alert.primaryAction}
                        </button>
                        <button 
                          className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg px-3 py-1"
                          onClick={() => handleSecondaryAction(alert.id)}
                        >
                          {alert.secondaryAction}
                        </button>
                        <button className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg px-3 py-1 ml-auto">
                          <i className="fas fa-ellipsis-h"></i>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="lg:col-span-2 flex flex-col items-center justify-center p-8 bg-gray-800 rounded-xl border border-gray-700">
                <div className="h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                  <i className="fas fa-check-circle text-3xl text-gray-400"></i>
                </div>
                <h3 className="text-xl font-medium text-gray-300 mb-1">No alerts to display</h3>
                <p className="text-gray-400 text-center">
                  {searchQuery ? 'No alerts match your search criteria.' : 'All clear! There are no active alerts in this category.'}
                </p>
              </div>
            )}
          </div>
          
          {/* Alert History & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
              <div className="p-4">
                <h3 className="font-bold text-white mb-4">Recent Alert History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-700/30">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Alert</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">Mar 21, 08:45</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-warning mr-2"></span>
                            Potential Water Leak
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">Northern Sector</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                            Resolved
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button className="text-primary hover:text-primary/80">
                            <i className="fas fa-eye"></i>
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">Mar 20, 14:32</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-danger mr-2"></span>
                            Power Outage Warning
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">East Grid - Sector 4</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                            Resolved
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button className="text-primary hover:text-primary/80">
                            <i className="fas fa-eye"></i>
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">Mar 20, 09:15</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                            System Update Completed
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">System</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                            Info
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button className="text-primary hover:text-primary/80">
                            <i className="fas fa-eye"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
              <div className="p-4">
                <h3 className="font-bold text-white mb-4">Alert Summary</h3>
                
                <div className="space-y-3">
                  <div className="bg-gray-700/40 rounded-lg p-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Critical Alerts</span>
                      <span className="font-medium">{getTabCount('danger')}</span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-danger rounded-full" style={{ width: `${(getTabCount('danger') / alerts.length) * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/40 rounded-lg p-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Warnings</span>
                      <span className="font-medium">{getTabCount('warning')}</span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-warning rounded-full" style={{ width: `${(getTabCount('warning') / alerts.length) * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/40 rounded-lg p-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Information</span>
                      <span className="font-medium">{getTabCount('info')}</span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: `${(getTabCount('info') / alerts.length) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="bg-gray-700/40 rounded-lg p-2 text-center">
                    <h4 className="text-xs text-gray-400">Total Today</h4>
                    <p className="text-xl font-medium text-white">12</p>
                  </div>
                  <div className="bg-gray-700/40 rounded-lg p-2 text-center">
                    <h4 className="text-xs text-gray-400">Resolved</h4>
                    <p className="text-xl font-medium text-white">4</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
                    View Detailed Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}