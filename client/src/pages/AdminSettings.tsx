import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

interface Theme {
  name: string;
  primary: string;
  secondary: string;
}

interface UserSettings {
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
  timezone: string;
  theme: string;
  fontSize: 'small' | 'medium' | 'large';
  soundEffects: boolean;
  desktopNotifications: boolean;
  autoBackup: boolean;
  dataSync: boolean;
}

const themes: Theme[] = [
  { name: "Default", primary: "#3B82F6", secondary: "#10B981" },
  { name: "Ocean", primary: "#0EA5E9", secondary: "#0D9488" },
  { name: "Sunset", primary: "#F59E0B", secondary: "#DB2777" },
  { name: "Forest", primary: "#22C55E", secondary: "#059669" }
];

export default function AdminSettings() {
  const [, navigate] = useLocation();
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    darkMode: true,
    language: "English",
    timezone: "UTC+00:00",
    theme: "Default",
    fontSize: 'medium',
    soundEffects: true,
    desktopNotifications: true,
    autoBackup: true,
    dataSync: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/profile')}
        className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <i className="fas fa-arrow-left mr-2"></i>
        Back to Profile
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700/50"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">System Settings</h1>
          <div className="flex items-center gap-4">
            {showSaveSuccess && (
              <span className="text-green-400 text-sm">
                <i className="fas fa-check mr-2"></i>Settings saved!
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Theme</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themes.map(theme => (
              <button
                key={theme.name}
                onClick={() => setSettings(prev => ({ ...prev, theme: theme.name }))}
                className={`p-4 rounded-lg border transition-all ${
                  settings.theme === theme.name
                    ? 'border-primary bg-gray-700/50'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.primary }}></div>
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.secondary }}></div>
                </div>
                <span className="text-white text-sm">{theme.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Font Size */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Font Size</h2>
          <div className="flex gap-4">
            {['small', 'medium', 'large'].map(size => (
              <button
                key={size}
                onClick={() => setSettings(prev => ({ ...prev, fontSize: size as any }))}
                className={`px-4 py-2 rounded-lg transition-all ${
                  settings.fontSize === size
                    ? 'bg-primary text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* More settings sections... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notifications */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white">Email Notifications</h3>
                  <p className="text-sm text-gray-400">Receive updates via email</p>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white">Desktop Notifications</h3>
                  <p className="text-sm text-gray-400">Show desktop alerts</p>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, desktopNotifications: !prev.desktopNotifications }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.desktopNotifications ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.desktopNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </section>

          {/* System */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">System</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white">Auto Backup</h3>
                  <p className="text-sm text-gray-400">Backup data automatically</p>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, autoBackup: !prev.autoBackup }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoBackup ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white">Data Sync</h3>
                  <p className="text-sm text-gray-400">Sync across devices</p>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, dataSync: !prev.dataSync }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.dataSync ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.dataSync ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}