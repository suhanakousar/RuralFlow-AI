import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

interface SecuritySettings {
  twoFactorAuth: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  ipWhitelist: string[];
  passwordExpiry: number;
  failedLoginAttempts: number;
  deviceManagement: boolean;
  activityLogs: boolean;
}

interface Device {
  id: string;
  name: string;
  lastActive: string;
  location: string;
  browser: string;
}

export default function AdminSecurity() {
  const [, navigate] = useLocation();
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: 30,
    ipWhitelist: ['192.168.1.1'],
    passwordExpiry: 90,
    failedLoginAttempts: 3,
    deviceManagement: true,
    activityLogs: true
  });

  const [devices] = useState<Device[]>([
    {
      id: '1',
      name: 'Windows PC',
      lastActive: '2024-01-20 10:30 AM',
      location: 'New York, USA',
      browser: 'Chrome 120.0.0'
    },
    {
      id: '2',
      name: 'iPhone 13',
      lastActive: '2024-01-20 09:45 AM',
      location: 'New York, USA',
      browser: 'Safari 17.0'
    }
  ]);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = async () => {
    if (newPassword === confirmPassword) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Buttons */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <i className="fas fa-tachometer-alt mr-2"></i>
          Back to Dashboard
        </button>
        <span className="text-gray-600">|</span>
        <button
          onClick={() => navigate('/admin/profile')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Profile
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700/50"
      >
        <h1 className="text-2xl font-bold text-white mb-6">Security Settings</h1>

        {/* Password Management */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Password Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-white mb-2">Change Password</h3>
              <p className="text-sm text-gray-400 mb-4">Last changed 30 days ago</p>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <i className="fas fa-key mr-2"></i>
                Change Password
              </button>
            </div>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-white mb-2">Password Expiry</h3>
              <p className="text-sm text-gray-400 mb-4">Set password expiration period</p>
              <select
                value={settings.passwordExpiry}
                onChange={(e) => setSettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
              >
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
                <option value={180}>180 days</option>
              </select>
            </div>
          </div>
        </section>

        {/* Device Management */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Device Management</h2>
          <div className="space-y-4">
            {devices.map(device => (
              <div key={device.id} className="bg-gray-700/30 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <i className={`fas ${device.name.includes('iPhone') ? 'fa-mobile-alt' : 'fa-desktop'} text-gray-400`}></i>
                    <h3 className="text-white">{device.name}</h3>
                  </div>
                  <div className="text-sm text-gray-400">
                    <div>Last active: {device.lastActive}</div>
                    <div>Location: {device.location}</div>
                    <div>Browser: {device.browser}</div>
                  </div>
                </div>
                <button className="text-red-400 hover:text-red-300">
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Advanced Security */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Advanced Security</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white">Failed Login Attempts</h3>
                  <p className="text-sm text-gray-400">Maximum attempts before lockout</p>
                </div>
                <select
                  value={settings.failedLoginAttempts}
                  onChange={(e) => setSettings(prev => ({ ...prev, failedLoginAttempts: parseInt(e.target.value) }))}
                  className="bg-gray-700 text-white rounded-lg px-3 py-2"
                >
                  <option value={3}>3 attempts</option>
                  <option value={5}>5 attempts</option>
                  <option value={10}>10 attempts</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white">Activity Logs</h3>
                  <p className="text-sm text-gray-400">Track all security events</p>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, activityLogs: !prev.activityLogs }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.activityLogs ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.activityLogs ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Change Password</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Change Password
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => navigate('/admin/profile')}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}