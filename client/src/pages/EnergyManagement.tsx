// Add type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (params: any) => void) => void;
      removeListener: (event: string, callback: (params: any) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import DashboardLayout from "../components/layout/DashboardLayout";
import { ethers } from "ethers";

// Add interfaces for P2P trading
interface P2PTransaction {
  id: string;
  node: string;
  type: 'Seller' | 'Buyer';
  energy: number;
  rate: number;
  status: 'Active' | 'Pending' | 'Completed';
  timestamp: number;
  details: {
    totalTraded: number;
    averageRate: number;
    successRate: number;
    lastActivity: number;
  };
  blockchain: {
    hash: string;
    confirmations: number;
    status: 'Pending' | 'Confirmed' | 'Failed';
  };
}

interface NodeStatus {
  id: string;
  name: string;
  type: 'Residential' | 'Commercial' | 'Farm';
  status: 'Online' | 'Offline';
  lastUpdate: number;
}

// Add new interfaces
interface TransactionHistory {
  id: string;
  transactionId: string;
  type: 'Exchange' | 'Accept' | 'Complete';
  amount: number;
  rate: number;
  timestamp: number;
  status: 'Success' | 'Failed';
}

interface TransactionDetails {
  totalTraded: number;
  averageRate: number;
  successRate: number;
  lastActivity: number;
}

// Add blockchain interfaces
interface BlockchainStatus {
  network: string;
  blockNumber: number;
  gasPrice: string;
  lastUpdate: number;
}

interface SmartContract {
  address: string;
  name: string;
  balance: string;
  transactions: number;
}

interface TransactionVerification {
  hash: string;
  blockNumber: number;
  confirmations: number;
  status: 'Pending' | 'Confirmed' | 'Failed';
  gasUsed: number;
  gasPrice: string;
}

// Add new interfaces for enhanced blockchain features
interface SmartContractABI {
  name: string;
  address: string;
  abi: any[];
  functions: {
    name: string;
    inputs: any[];
    outputs: any[];
  }[];
}

interface BlockchainAnalytics {
  totalTransactions: number;
  totalVolume: number;
  averageGasPrice: number;
  successRate: number;
  activeUsers: number;
  last24hVolume: number;
}

// Add smart contract ABI
const ENERGY_TRADING_ABI: SmartContractABI = {
  name: 'EnergyTrading',
  address: '0x1234...5678',
  abi: [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "rate",
          "type": "uint256"
        }
      ],
      "name": "createTrade",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tradeId",
          "type": "uint256"
        }
      ],
      "name": "acceptTrade",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  functions: [
    {
      name: 'createTrade',
      inputs: [
        { name: 'amount', type: 'uint256' },
        { name: 'rate', type: 'uint256' }
      ],
      outputs: []
    },
    {
      name: 'acceptTrade',
      inputs: [
        { name: 'tradeId', type: 'uint256' }
      ],
      outputs: []
    }
  ]
};

export default function EnergyManagement() {
  // Fetch energy data
  const { data: energyData, isLoading } = useQuery({
    queryKey: ['/api/energy'],
    staleTime: 60000, // 1 minute
    refetchInterval: 60000, // Refetch every minute
  });

  // Energy sources distribution data
  const energySourcesData = [
    { name: 'Solar', value: 60 },
    { name: 'Battery', value: 25 },
    { name: 'Grid', value: 15 }
  ];
  
  const COLORS = ['#00a3ff', '#0cc0df', '#8f00ff'];

  // Energy consumption data over time
  const consumptionData = [
    { time: '00:00', value: 23 },
    { time: '04:00', value: 18 },
    { time: '08:00', value: 35 },
    { time: '12:00', value: 48 },
    { time: '16:00', value: 43 },
    { time: '20:00', value: 40 },
    { time: '24:00', value: 30 }
  ];
  
  // Energy production data over time
  const productionData = [
    { time: '00:00', value: 10 },
    { time: '04:00', value: 5 },
    { time: '08:00', value: 42 },
    { time: '12:00', value: 65 },
    { time: '16:00', value: 55 },
    { time: '20:00', value: 35 },
    { time: '24:00', value: 15 }
  ];

  // Add state for P2P trading
  const [transactions, setTransactions] = useState<P2PTransaction[]>([
    {
      id: '1',
      node: 'Residential 1',
      type: 'Seller',
      energy: 2.5,
      rate: 0.12,
      status: 'Active',
      timestamp: Date.now(),
      details: {
        totalTraded: 0,
        averageRate: 0,
        successRate: 0,
        lastActivity: 0
      },
      blockchain: {
        hash: '',
        confirmations: 0,
        status: 'Pending'
      }
    },
    {
      id: '2',
      node: 'Commercial 3',
      type: 'Buyer',
      energy: 4.8,
      rate: 0.14,
      status: 'Pending',
      timestamp: Date.now(),
      details: {
        totalTraded: 0,
        averageRate: 0,
        successRate: 0,
        lastActivity: 0
      },
      blockchain: {
        hash: '',
        confirmations: 0,
        status: 'Pending'
      }
    },
    {
      id: '3',
      node: 'Farm Node 2',
      type: 'Seller',
      energy: 1.2,
      rate: 0.11,
      status: 'Active',
      timestamp: Date.now(),
      details: {
        totalTraded: 0,
        averageRate: 0,
        successRate: 0,
        lastActivity: 0
      },
      blockchain: {
        hash: '',
        confirmations: 0,
        status: 'Pending'
      }
    }
  ]);

  const [nodes, setNodes] = useState<NodeStatus[]>([
    {
      id: '1',
      name: 'Residential 1',
      type: 'Residential',
      status: 'Online',
      lastUpdate: Date.now()
    },
    {
      id: '2',
      name: 'Commercial 3',
      type: 'Commercial',
      status: 'Online',
      lastUpdate: Date.now()
    },
    {
      id: '3',
      name: 'Farm Node 2',
      type: 'Farm',
      status: 'Online',
      lastUpdate: Date.now()
    }
  ]);

  // Add new state for transaction history
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistory[]>([
    {
      id: '1',
      transactionId: '1',
      type: 'Exchange',
      amount: 0.5,
      rate: 0.12,
      timestamp: Date.now() - 3600000,
      status: 'Success'
    },
    {
      id: '2',
      transactionId: '2',
      type: 'Accept',
      amount: 1.0,
      rate: 0.14,
      timestamp: Date.now() - 7200000,
      status: 'Success'
    }
  ]);

  // Add state for selected transaction
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  // Add blockchain state
  const [blockchainStatus, setBlockchainStatus] = useState<BlockchainStatus>({
    network: 'Ethereum Testnet',
    blockNumber: 0,
    gasPrice: '0',
    lastUpdate: Date.now()
  });

  const [smartContract, setSmartContract] = useState<SmartContract>({
    address: '0x1234...5678',
    name: 'EnergyTrading',
    balance: '0.5 ETH',
    transactions: 42
  });

  // Add blockchain connection
  const [isConnected, setIsConnected] = useState(false);

  // Add new state for blockchain features
  const [blockchainAnalytics, setBlockchainAnalytics] = useState<BlockchainAnalytics>({
    totalTransactions: 0,
    totalVolume: 0,
    averageGasPrice: 0,
    successRate: 0,
    activeUsers: 0,
    last24hVolume: 0
  });

  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Connect to blockchain
  const connectBlockchain = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setIsConnected(true);
        
        // Get network info
        const network = await provider.getNetwork();
        const blockNumber = await provider.getBlockNumber();
        const gasPrice = await provider.getGasPrice();
        
        setBlockchainStatus({
          network: network.name,
          blockNumber,
          gasPrice: ethers.utils.formatEther(gasPrice),
          lastUpdate: Date.now()
        });
      }
    } catch (error) {
      console.error('Failed to connect to blockchain:', error);
    }
  };

  // Initialize smart contract
  useEffect(() => {
    if (isConnected && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const energyContract = new ethers.Contract(
        ENERGY_TRADING_ABI.address,
        ENERGY_TRADING_ABI.abi,
        signer
      );
      setContract(energyContract);
    }
  }, [isConnected]);

  // Enhanced transaction verification
  const verifyTransaction = async (hash: string) => {
    try {
      setIsVerifying(true);
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const receipt = await provider.getTransactionReceipt(hash);
        
        // Get transaction details
        const tx = await provider.getTransaction(hash);
        const block = await provider.getBlock(receipt.blockNumber);
        
        const verification = {
          blockNumber: receipt.blockNumber,
          confirmations: receipt.confirmations,
          status: receipt.status === 1 ? 'Confirmed' : 'Failed',
          gasUsed: receipt.gasUsed.toNumber(),
          gasPrice: ethers.utils.formatEther(receipt.effectiveGasPrice),
          timestamp: block.timestamp,
          from: tx.from,
          to: tx.to,
          value: ethers.utils.formatEther(tx.value),
          data: tx.data
        };

        // Update transaction status
        setTransactions(prev => {
          return prev.map(tx => {
            if (tx.blockchain.hash === hash) {
              return {
                ...tx,
                blockchain: {
                  ...tx.blockchain,
                  status: verification.status,
                  confirmations: verification.confirmations
                }
              };
            }
            return tx;
          });
        });

        return verification;
      }
    } catch (error) {
      console.error('Failed to verify transaction:', error);
      throw error;
    } finally {
      setIsVerifying(false);
    }
  };

  // Create trade on blockchain
  const createTrade = async (transaction: P2PTransaction) => {
    try {
      if (!contract) throw new Error('Contract not initialized');
      
      const amount = ethers.utils.parseEther(transaction.energy.toString());
      const rate = ethers.utils.parseEther(transaction.rate.toString());
      
      const tx = await contract.createTrade(amount, rate);
      const receipt = await tx.wait();
      
      // Update transaction with blockchain info
      setTransactions(prev => {
        return prev.map(t => {
          if (t.id === transaction.id) {
            return {
              ...t,
              blockchain: {
                hash: receipt.transactionHash,
                confirmations: receipt.confirmations,
                status: 'Pending'
              }
            };
          }
          return t;
        });
      });

      // Start verification process
      await verifyTransaction(receipt.transactionHash);
      
      return receipt;
    } catch (error) {
      console.error('Failed to create trade:', error);
      throw error;
    }
  };

  // Accept trade on blockchain
  const acceptTrade = async (transaction: P2PTransaction) => {
    try {
      if (!contract) throw new Error('Contract not initialized');
      
      const tx = await contract.acceptTrade(transaction.id);
      const receipt = await tx.wait();
      
      // Update transaction status
      setTransactions(prev => {
        return prev.map(t => {
          if (t.id === transaction.id) {
            return {
              ...t,
              status: 'Completed',
              blockchain: {
                ...t.blockchain,
                hash: receipt.transactionHash,
                confirmations: receipt.confirmations,
                status: 'Pending'
              }
            };
          }
          return t;
        });
      });

      // Start verification process
      await verifyTransaction(receipt.transactionHash);
      
      return receipt;
    } catch (error) {
      console.error('Failed to accept trade:', error);
      throw error;
    }
  };

  // Update blockchain analytics
  const updateBlockchainAnalytics = async () => {
    try {
      if (!contract) return;

      // Get contract events
      const events = await contract.queryFilter('*');
      
      // Calculate analytics
      const analytics: BlockchainAnalytics = {
        totalTransactions: events.length,
        totalVolume: events.reduce((acc, event) => {
          const value = event.args?.value || ethers.BigNumber.from(0);
          return acc.add(value);
        }, ethers.BigNumber.from(0)),
        averageGasPrice: 0, // Calculate from events
        successRate: 0, // Calculate from events
        activeUsers: new Set(events.map(e => e.args?.from)).size,
        last24hVolume: 0 // Calculate from events
      };

      setBlockchainAnalytics(analytics);
    } catch (error) {
      console.error('Failed to update blockchain analytics:', error);
    }
  };

  // Update analytics periodically
  useEffect(() => {
    if (isConnected && contract) {
      updateBlockchainAnalytics();
      const interval = setInterval(updateBlockchainAnalytics, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isConnected, contract]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update transactions
      setTransactions(prev => {
        return prev.map(tx => {
          if (tx.status === 'Active') {
            return {
              ...tx,
              energy: Math.max(0, tx.energy - (Math.random() * 0.1)),
              timestamp: Date.now()
            };
          }
          return tx;
        });
      });

      // Update node statuses
      setNodes(prev => {
        return prev.map(node => {
          if (Math.random() < 0.1) { // 10% chance of status change
            return {
              ...node,
              status: node.status === 'Online' ? 'Offline' : 'Online',
              lastUpdate: Date.now()
            };
          }
          return node;
        });
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle transaction actions
  const handleTransactionAction = (transactionId: string, action: 'exchange' | 'accept') => {
    setTransactions(prev => {
      return prev.map(tx => {
        if (tx.id === transactionId) {
          if (action === 'accept') {
            return { ...tx, status: 'Completed' };
          }
          // For exchange, create a new transaction
          return {
            ...tx,
            energy: Math.max(0, tx.energy - 0.5),
            timestamp: Date.now()
          };
        }
        return tx;
      });
    });
  };

  // Add function to handle transaction selection
  const handleTransactionSelect = (transactionId: string) => {
    setSelectedTransaction(selectedTransaction === transactionId ? null : transactionId);
  };

  // Add function to format time
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const actions = (
    <div className="flex space-x-2">
      <button className="px-3 py-1 rounded-lg bg-primary/20 text-primary">
        <i className="fas fa-download mr-2"></i>
        Export Data
      </button>
      <button className="px-3 py-1 rounded-lg bg-gray-700/40 text-gray-300 hover:bg-gray-700/70 hover:text-white">
        <i className="fas fa-cog mr-2"></i>
        Settings
      </button>
    </div>
  );
  
  return (
    <DashboardLayout title="Energy Management" actions={actions}>
      {/* Energy Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
        >
          <div className="p-4">
            <h3 className="font-bold text-white mb-4">Real-Time Energy Distribution</h3>
            <div className="flex flex-col lg:flex-row items-center">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={energySourcesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {energySourcesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                      labelStyle={{ color: '#e2e8f0' }}
                      formatter={(value) => [`${value}%`, null]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 w-full lg:w-1/3 p-4">
                <div className="bg-gray-700/40 rounded-lg p-3">
                  <h4 className="text-sm text-gray-400">Total Output</h4>
                  <p className="text-xl font-medium text-white">8.6 <small>kW</small></p>
                </div>
                <div className="bg-gray-700/40 rounded-lg p-3">
                  <h4 className="text-sm text-gray-400">Grid Load</h4>
                  <p className="text-xl font-medium text-white">15 <small>%</small></p>
                </div>
                <div className="bg-gray-700/40 rounded-lg p-3">
                  <h4 className="text-sm text-gray-400">Battery Status</h4>
                  <p className="text-xl font-medium text-white">78 <small>%</small></p>
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
            <h3 className="font-bold text-white mb-4">Energy Consumption vs. Production</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={consumptionData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="productionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00a3ff" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#00a3ff" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff6b6b" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#ff6b6b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10 }} 
                    stroke="#475569"
                  />
                  <YAxis tick={{ fontSize: 10 }} stroke="#475569" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    name="Production"
                    stroke="#00a3ff" 
                    strokeWidth={2}
                    fill="url(#productionGradient)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value"
                    name="Consumption" 
                    stroke="#ff6b6b" 
                    strokeWidth={2}
                    fill="url(#consumptionGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Energy Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
        >
          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                <i className="fas fa-solar-panel text-primary"></i>
              </div>
              <h3 className="font-bold text-white">Solar Panels</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Current Output</span>
                <span className="text-sm font-medium">3.4 kW</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Efficiency</span>
                <span className="text-sm font-medium">87%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Daily Production</span>
                <span className="text-sm font-medium">24.8 kWh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Status</span>
                <span className="text-sm font-medium">
                  <span className="inline-block w-2 h-2 bg-accent rounded-full mr-1"></span>
                  Optimal
                </span>
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
              <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center mr-2">
                <i className="fas fa-car-battery text-secondary"></i>
              </div>
              <h3 className="font-bold text-white">Battery Storage</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Charge Level</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-secondary rounded-full" style={{ width: '78%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Status</span>
                <span className="text-sm font-medium">Charging</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Estimated Backup</span>
                <span className="text-sm font-medium">6.5 hours</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
        >
          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center mr-2">
                <i className="fas fa-plug text-warning"></i>
              </div>
              <h3 className="font-bold text-white">Grid Connection</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Current Draw</span>
                <span className="text-sm font-medium">1.2 kW</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Daily Usage</span>
                <span className="text-sm font-medium">16.4 kWh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Voltage</span>
                <span className="text-sm font-medium">230V</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Status</span>
                <span className="text-sm font-medium">
                  <span className="inline-block w-2 h-2 bg-accent rounded-full mr-1"></span>
                  Connected
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced P2P Energy Trading Network with Blockchain */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg mb-6"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white">P2P Energy Trading Network</h3>
              <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
            <div className="flex space-x-2">
              {!isConnected ? (
                <button 
                  className="px-3 py-1 rounded-lg bg-primary/20 text-primary hover:bg-primary/30"
                  onClick={connectBlockchain}
                  title="Connect to blockchain"
                >
                  <i className="fas fa-plug mr-2"></i> Connect Wallet
                </button>
              ) : (
                <>
                  <button 
                    className="px-3 py-1 rounded-lg bg-primary/20 text-primary hover:bg-primary/30"
                    title="Refresh network data"
                  >
                    <i className="fas fa-sync-alt mr-2"></i> Refresh
                  </button>
                  <button 
                    className="px-3 py-1 rounded-lg bg-primary/20 text-primary hover:bg-primary/30"
                    title="View transaction history"
                  >
                    <i className="fas fa-history mr-2"></i> History
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Enhanced Blockchain Status */}
          {isConnected && (
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="text-xs text-gray-400">Network</div>
                <div className="text-sm font-medium">{blockchainStatus.network}</div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="text-xs text-gray-400">Block Number</div>
                <div className="text-sm font-medium">{blockchainStatus.blockNumber}</div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="text-xs text-gray-400">Gas Price</div>
                <div className="text-sm font-medium">{blockchainStatus.gasPrice} ETH</div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="text-xs text-gray-400">Smart Contract</div>
                <div className="text-sm font-medium">{smartContract.name}</div>
              </div>
            </div>
          )}
          
          {/* Blockchain Analytics */}
          {isConnected && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="text-xs text-gray-400">Total Volume</div>
                <div className="text-sm font-medium">{ethers.utils.formatEther(blockchainAnalytics.totalVolume.toString())} ETH</div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="text-xs text-gray-400">Active Users</div>
                <div className="text-sm font-medium">{blockchainAnalytics.activeUsers}</div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="text-xs text-gray-400">Success Rate</div>
                <div className="text-sm font-medium">{blockchainAnalytics.successRate}%</div>
              </div>
            </div>
          )}
          
          {/* Network Status with enhanced info */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {nodes.map(node => (
              <div key={node.id} className="bg-gray-700/30 rounded-lg p-3 hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-2 ${
                      node.status === 'Online' ? 'bg-accent' : 'bg-danger'
                    }`}></div>
                    <span className="text-sm font-medium">{node.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(node.lastUpdate)}
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-400">{node.type}</div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Uptime</span>
                  <span className="text-accent">99.9%</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Enhanced Transaction Table with Blockchain Info */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700/30">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Node</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Energy</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rate</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Blockchain</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {transactions.map(transaction => (
                  <>
                    <tr 
                      key={transaction.id}
                      className={`cursor-pointer hover:bg-gray-700/30 transition-colors ${
                        selectedTransaction === transaction.id ? 'bg-gray-700/30' : ''
                      }`}
                      onClick={() => handleTransactionSelect(transaction.id)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full ${
                            transaction.type === 'Seller' ? 'bg-primary/20' : 'bg-secondary/20'
                          } flex items-center justify-center mr-2`}>
                            <i className={`fas ${
                              transaction.type === 'Seller' ? 'fa-home text-primary' : 'fa-industry text-secondary'
                            }`}></i>
                          </div>
                          <span>{transaction.node}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{transaction.type}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <span>{transaction.energy.toFixed(1)} kWh</span>
                          <div className="w-20 h-1 bg-gray-700 rounded-full ml-2">
                            <div 
                              className="h-full bg-accent rounded-full"
                              style={{ width: `${(transaction.energy / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">${transaction.rate.toFixed(2)} / kWh</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === 'Active' 
                              ? 'bg-accent/20 text-accent'
                              : transaction.status === 'Pending'
                              ? 'bg-warning/20 text-warning'
                              : 'bg-success/20 text-success'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.blockchain.status === 'Confirmed'
                              ? 'bg-success/20 text-success'
                              : transaction.blockchain.status === 'Pending'
                              ? 'bg-warning/20 text-warning'
                              : 'bg-danger/20 text-danger'
                          }`}>
                            {transaction.blockchain.status}
                          </span>
                          <span className="ml-2 text-xs text-gray-400">
                            {transaction.blockchain.confirmations} confs
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {transaction.status === 'Active' && (
                          <button 
                            className="text-primary hover:text-primary/80 mr-2"
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                await createTrade(transaction);
                              } catch (error) {
                                console.error('Failed to create trade:', error);
                              }
                            }}
                            title="Create trade on blockchain"
                            disabled={isVerifying}
                          >
                            <i className="fas fa-exchange-alt"></i>
                          </button>
                        )}
                        {transaction.status === 'Pending' && (
                          <button 
                            className="text-success hover:text-success/80"
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                await acceptTrade(transaction);
                              } catch (error) {
                                console.error('Failed to accept trade:', error);
                              }
                            }}
                            title="Accept trade on blockchain"
                            disabled={isVerifying}
                          >
                            <i className="fas fa-check-circle"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                    {selectedTransaction === transaction.id && (
                      <tr>
                        <td colSpan={7} className="px-4 py-3 bg-gray-700/20">
                          <div className="grid grid-cols-4 gap-4">
                            <div className="bg-gray-700/30 rounded-lg p-3">
                              <div className="text-xs text-gray-400">Total Traded</div>
                              <div className="text-sm font-medium">{transaction.details.totalTraded.toFixed(1)} kWh</div>
                            </div>
                            <div className="bg-gray-700/30 rounded-lg p-3">
                              <div className="text-xs text-gray-400">Average Rate</div>
                              <div className="text-sm font-medium">${transaction.details.averageRate.toFixed(2)} / kWh</div>
                            </div>
                            <div className="bg-gray-700/30 rounded-lg p-3">
                              <div className="text-xs text-gray-400">Success Rate</div>
                              <div className="text-sm font-medium">{transaction.details.successRate}%</div>
                            </div>
                            <div className="bg-gray-700/30 rounded-lg p-3">
                              <div className="text-xs text-gray-400">Transaction Hash</div>
                              <div className="text-sm font-medium font-mono truncate">
                                {transaction.blockchain.hash}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}