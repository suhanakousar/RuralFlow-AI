import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRealTime } from "@/context/RealTimeContext";
import { useLocation } from "wouter";

interface TopBarProps {
  onMenuToggle: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const [, navigate] = useLocation(); // Renamed from setLocation to navigate
  const [location, setLocation] = useState("Sundarpur Village");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { realTimeData, isConnected } = useRealTime();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Add locations array
  const locations = [
    "Sundarpur Village",
    "Greenfield District",
    "Lakeside Community",
    "Highland Farms",
    "Valley Settlement",
    "Riverside Fields"
  ];

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new notification
        const newNotification: Notification = {
          id: Date.now().toString(),
          title: "System Update",
          message: `New sensor reading detected in ${location}`,
          type: ['alert', 'warning', 'info'][Math.floor(Math.random() * 3)] as 'alert' | 'warning' | 'info',
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 10));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [location]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <header className="bg-gray-800 border-b border-gray-700 shadow-lg py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <button
          className="md:hidden text-gray-400 hover:text-white focus:outline-none mr-3"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="flex items-center bg-gray-700/60 rounded-lg px-3 py-1.5">
          <i className="fas fa-map-marker-alt text-primary mr-2"></i>
          <select 
            className="bg-transparent text-gray-300 text-sm focus:outline-none"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="Select location"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <i className="fas fa-search text-gray-400"></i>
          </span>
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-gray-700/40 border border-gray-600 text-sm rounded-lg pl-8 pr-4 py-1.5 text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary w-48"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Notifications */}
        <div className="relative">
          <button 
            className="relative p-2 rounded-full text-gray-400 hover:text-white"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-warning flex items-center justify-center text-xs text-white"
              >
                {unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50"
              >
                <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  <button 
                    onClick={clearAllNotifications}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Clear all
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                      No notifications
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`p-3 border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer ${
                          !notif.read ? 'bg-gray-700/20' : ''
                        }`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs ${
                            notif.type === 'alert' ? 'text-red-400' :
                            notif.type === 'warning' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`}>
                            {notif.type.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(notif.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <h4 className="font-medium mt-1">{notif.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Admin Menu */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 hover:bg-gray-700/50 rounded-lg px-3 py-2"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <span className="text-sm font-semibold text-white">A</span>
            </div>
            <div className="text-left hidden md:block">
              <div className="text-sm font-medium">Admin</div>
              <div className="text-xs text-gray-400">
                {isConnected ? (
                  <span className="text-green-400">●</span>
                ) : (
                  <span className="text-red-400">●</span>
                )} {isConnected ? 'Online' : 'Offline'}
              </div>
            </div>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50"
              >
                <div className="p-2">
                  // Update the Profile button onClick handler
                  <button 
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-700/50"
                    onClick={() => {
                      navigate('/admin/profile'); // Using the renamed variable
                      setShowUserMenu(false);
                    }}
                  >
                    <i className="fas fa-user-circle mr-2"></i> Profile
                  </button>
                  <button 
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-700/50"
                    onClick={() => {
                      navigate('/admin/settings');
                      setShowUserMenu(false);
                    }}
                  >
                    <i className="fas fa-cog mr-2"></i> Settings
                  </button>
                  <button 
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-700/50"
                    onClick={() => {
                      navigate('/admin/security');
                      setShowUserMenu(false);
                    }}
                  >
                    <i className="fas fa-shield-alt mr-2"></i> Security
                  </button>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-700/50 text-red-400">
                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
