import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { IrrigationZone } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface SmartIrrigationPanelProps {
  zones: IrrigationZone[];
  aiRecommendation: string;
}

interface SoilCellData {
  moisture: number;
  temperature: number;
  pH: number;
  nutrientLevel: string;
  lastWatered: string;
  soilType: string;
  nextScheduledIrrigation: string;
}

export default function SmartIrrigationPanel({ zones: initialZones, aiRecommendation }: SmartIrrigationPanelProps) {
  const [zones, setZones] = useState(initialZones);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [showSoilDetails, setShowSoilDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Move moistureLevels outside to be accessible by both functions
  const moistureLevels = [
    [10, 20, 30, 40, 50, 30],
    [20, 40, 60, 80, 60, 30],
    [10, 30, 70, 80, 50, 20],
    [10, 20, 40, 50, 30, 10],
    [5, 10, 20, 30, 20, 5],
    [5, 5, 10, 10, 5, 5]
  ];

  const handleToggleZone = (zoneId: string) => {
    setZones(zones.map(zone => 
      zone.id === zoneId ? { ...zone, active: !zone.active } : zone
    ));
  };

  const getSoilData = async (row: number, col: number): Promise<SoilCellData> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        moisture: moistureLevels[row][col],
        temperature: 22 + Math.random() * 5,
        pH: 6.0 + Math.random() * 2,
        nutrientLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        lastWatered: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
        soilType: ['Clay', 'Loam', 'Sandy'][Math.floor(Math.random() * 3)],
        nextScheduledIrrigation: new Date(Date.now() + Math.random() * 86400000).toLocaleString()
      };
    } catch (error) {
      console.error('Error fetching soil data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateHeatmapCells = () => {
    const cells = [];
    const rows = 6;
    const cols = 6;
    
    // This would come from real sensor data in a production environment
    const moistureLevels = [
      [10, 20, 30, 40, 50, 30],
      [20, 40, 60, 80, 60, 30],
      [10, 30, 70, 80, 50, 20],
      [10, 20, 40, 50, 30, 10],
      [5, 10, 20, 30, 20, 5],
      [5, 5, 10, 10, 5, 5]
    ];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const opacity = moistureLevels[row][col];
        cells.push(
          <motion.div 
            key={`${row}-${col}`}
            className={`bg-accent rounded cursor-pointer hover:ring-2 hover:ring-accent transition-all`}
            style={{ opacity: opacity / 100 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: opacity / 100 }}
            transition={{ duration: 1, delay: (row + col) * 0.05 }}
            onClick={() => {
              setSelectedCell({ row, col });
              setShowSoilDetails(true);
            }}
          />
        );
      }
    }
    
    return cells;
  };

  return (
    <>
      <div className="lg:col-span-3 rounded-xl overflow-hidden border border-gray-700 bg-gray-800">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white">Smart Irrigation Management</h3>
            <div className="flex space-x-2">
              <button className="text-gray-400 hover:text-white">
                <i className="fas fa-sync-alt"></i>
              </button>
              <button className="text-gray-400 hover:text-white">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/40 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">Active Zones</h4>
                <button className="text-xs bg-accent/20 text-accent px-2 py-1 rounded hover:bg-accent/30">
                  Schedule All
                </button>
              </div>
              
              <div className="space-y-3">
                {zones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${zone.active ? 'bg-accent' : 'bg-gray-600'} mr-2`}></div>
                      <span className="text-sm">{zone.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs font-mono mr-2">
                        {zone.active ? zone.duration : 'OFF'}
                      </span>
                      <Switch
                        checked={zone.active}
                        onCheckedChange={() => handleToggleZone(zone.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-700/40 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">Soil Moisture Map</h4>
                <div className="flex space-x-2">
                  <button className="text-xs bg-gray-600/50 text-gray-200 px-2 py-1 rounded hover:bg-gray-600/70">
                    Live View
                  </button>
                  <button className="text-xs bg-gray-600/50 text-gray-200 px-2 py-1 rounded hover:bg-gray-600/70">
                    History
                  </button>
                </div>
              </div>
              
              <div className="relative h-40 rounded-lg overflow-hidden bg-gray-900/80 p-1">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1">
                  {generateHeatmapCells()}
                </div>
                
                <div className="absolute bottom-2 right-2 bg-gray-800/80 text-xs p-1 rounded">
                  <div className="flex items-center space-x-1">
                    <span className="block w-2 h-2 bg-accent/10 rounded"></span>
                    <span>Dry</span>
                    <span className="block w-2 h-2 bg-accent/80 rounded"></span>
                    <span>Wet</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-xs text-gray-400">
                  <span className="text-accent font-semibold">AI Recommendation:</span> {aiRecommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showSoilDetails} onOpenChange={setShowSoilDetails}>
        <DialogContent className="bg-gray-800 p-6 rounded-xl w-full max-w-md mx-4 text-white">
          {selectedCell && (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <DialogTitle className="text-lg font-bold">
                    Soil Analysis - Section {selectedCell.row + 1}-{selectedCell.col + 1}
                  </DialogTitle>
                  <p className="text-sm text-gray-400">Real-time sensor data</p>
                </div>
                <DialogClose className="text-gray-400 hover:text-white">
                  <i className="fas fa-times"></i>
                </DialogClose>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {Object.entries(getSoilData(selectedCell.row, selectedCell.col)).map(([key, value]) => (
                      <div key={key} className="bg-gray-700/30 p-3 rounded-lg">
                        <span className="text-gray-400 text-sm block mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-mono text-white">
                          {typeof value === 'number' ? value.toFixed(1) : value}
                          {key === 'moisture' ? '%' : key === 'temperature' ? '°C' : ''}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-sm font-medium text-white mb-3">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          alert('Scheduling irrigation...');
                          setShowSoilDetails(false);
                        }}
                        className="px-4 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors"
                      >
                        Schedule Irrigation
                      </button>
                      <button
                        onClick={() => {
                          alert('Adjusting settings...');
                          setShowSoilDetails(false);
                        }}
                        className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Adjust Settings
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
