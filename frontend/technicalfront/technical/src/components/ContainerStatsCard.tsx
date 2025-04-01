import React from 'react';
import { ContainerStat } from '../hooks/useCadvisorStats';

interface ContainerStatsCardProps {
  containerStat: ContainerStat;
}

const ContainerStatsCard: React.FC<ContainerStatsCardProps> = ({ containerStat }) => {
  const { 
    name, 
    cpuUsage, 
    memoryUsage, 
    memoryLimit, 
    networkRx, 
    networkTx, 
    diskRead, 
    diskWrite 
  } = containerStat;

  const memoryPercentage = Math.min(Math.round((memoryUsage / memoryLimit) * 100), 100) || 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg truncate">{name}</h3>
        <span className="text-xs text-gray-500">ID: {containerStat.id.substring(0, 8)}</span>
      </div>
      
      {/* CPU Usage */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">CPU</span>
          <span className={`text-sm font-medium ${cpuUsage > 80 ? 'text-red-600' : cpuUsage > 50 ? 'text-yellow-600' : 'text-green-600'}`}>
            {cpuUsage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${cpuUsage > 80 ? 'bg-red-500' : cpuUsage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(cpuUsage, 100)}%` }} 
          />
        </div>
        {/* Mini sparkline pour CPU */}
        <div className="flex mt-1 h-[20px]">
          {containerStat.cpuUsageHistory.map((value, idx) => (
            <div 
              key={idx}
              className={`flex-1 mx-[1px] ${value > 80 ? 'bg-red-300' : value > 50 ? 'bg-yellow-300' : 'bg-green-300'}`} 
              style={{ height: `${Math.max(value, 2)}%` }}
            />
          ))}
        </div>
      </div>
      
      {/* Memory Usage */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Mémoire</span>
          <span className={`text-sm font-medium ${memoryPercentage > 80 ? 'text-red-600' : memoryPercentage > 50 ? 'text-yellow-600' : 'text-green-600'}`}>
            {memoryUsage} MB / {memoryLimit} MB ({memoryPercentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${memoryPercentage > 80 ? 'bg-red-500' : memoryPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${memoryPercentage}%` }} 
          />
        </div>
        {/* Mini sparkline pour Mémoire */}
        <div className="flex mt-1 h-[20px]">
          {containerStat.memoryUsageHistory.map((value, idx) => (
            <div 
              key={idx}
              className="flex-1 mx-[1px] bg-blue-300" 
              style={{ height: `${Math.min((value / memoryLimit) * 100, 100)}%` }}
            />
          ))}
        </div>
      </div>
      
      {/* Network */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Réseau ↓</span>
            <span className="text-sm text-blue-600">{networkRx} KB/s</span>
          </div>
          <div className="flex h-[15px]">
            {containerStat.networkRxHistory.map((value, idx) => (
              <div 
                key={idx}
                className="flex-1 mx-[1px] bg-blue-300" 
                style={{ 
                  height: `${Math.min((value / Math.max(...containerStat.networkRxHistory, 1)) * 100, 100)}%`
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Réseau ↑</span>
            <span className="text-sm text-purple-600">{networkTx} KB/s</span>
          </div>
          <div className="flex h-[15px]">
            {containerStat.networkTxHistory.map((value, idx) => (
              <div 
                key={idx}
                className="flex-1 mx-[1px] bg-purple-300" 
                style={{ 
                  height: `${Math.min((value / Math.max(...containerStat.networkTxHistory, 1)) * 100, 100)}%`
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Disk */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Disque ↓</span>
            <span className="text-sm text-green-600">{diskRead} KB/s</span>
          </div>
          <div className="flex h-[15px]">
            {containerStat.diskReadHistory.map((value, idx) => (
              <div 
                key={idx}
                className="flex-1 mx-[1px] bg-green-300" 
                style={{ 
                  height: `${Math.min((value / Math.max(...containerStat.diskReadHistory, 1)) * 100, 100)}%`
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Disque ↑</span>
            <span className="text-sm text-orange-600">{diskWrite} KB/s</span>
          </div>
          <div className="flex h-[15px]">
            {containerStat.diskWriteHistory.map((value, idx) => (
              <div 
                key={idx}
                className="flex-1 mx-[1px] bg-orange-300" 
                style={{ 
                  height: `${Math.min((value / Math.max(...containerStat.diskWriteHistory, 1)) * 100, 100)}%`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContainerStatsCard;
