import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

interface Metric {
  label: string;
  value: string;
  unit?: string;
}

interface StatusCardData {
  title: string;
  status: 'optimal' | 'attention' | 'critical';
  metrics: Metric[];
  chartData: number[];
}

interface StatusCardProps {
  data: StatusCardData;
  color: string;
  glowClass: string;
  isSelected?: boolean;
  onSelect?: () => void;
  additionalInfo?: {
    [key: string]: string;
  };
  actions?: {
    label: string;
    icon: string;
    onClick: () => void;
  }[];
}

export default function StatusCard({ 
  data, 
  color, 
  glowClass,
  isSelected,
  onSelect,
  additionalInfo,
  actions
}: StatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-success';
      case 'attention': return 'text-warning';
      case 'critical': return 'text-danger';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-success/20';
      case 'attention': return 'bg-warning/20';
      case 'critical': return 'bg-danger/20';
      default: return 'bg-gray-700/20';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${glowClass} rounded-xl overflow-hidden border border-gray-700 cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-white">{data.title}</h3>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusBg(data.status)} ${getStatusColor(data.status)}`}>
              <i className={`fas fa-circle text-xs mr-1 ${getStatusColor(data.status)}`}></i>
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </div>
          </div>
          {actions && (
            <div className="flex space-x-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                  className="p-1 rounded-lg bg-gray-700/40 text-gray-300 hover:bg-gray-700/70 hover:text-white transition-all"
                  title={action.label}
                >
                  <i className={`fas ${action.icon}`}></i>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {data.metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
              <div className="text-xl font-bold text-white">
                {metric.value}
                {metric.unit && <span className="text-sm text-gray-400 ml-1">{metric.unit}</span>}
              </div>
            </div>
          ))}
        </div>

        {additionalInfo && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {Object.entries(additionalInfo).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-xs text-gray-400 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                <div className="text-sm font-medium text-white">{value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.chartData.map((value, index) => ({ value }))}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={`var(--${color})`}
                strokeWidth={2}
                dot={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
