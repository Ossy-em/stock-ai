"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Clock } from "lucide-react";

interface ChartDataPoint {
  time: string;
  value: number;
}

interface Index {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  color: string;
  chartData: ChartDataPoint[];
}

interface IndexChartProps {
  indexes: Index[];
  activeIndex?: string | null;
  onIndexClick?: (symbol: string) => void;
}

const CustomTooltip = ({ active, payload, label, indexes }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-3 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#2A2A2A]">
        <Clock size={12} className="text-gray-500" />
        <p className="text-gray-400 text-[11px] font-medium">{label}</p>
      </div>
      <div className="space-y-1.5">
        {payload.map((entry: any, index: number) => {

          const indexData = indexes?.find((idx: Index) => idx.symbol === entry.dataKey);
          if (!indexData) return null;

          const openPrice = indexData.price / (1 + indexData.changePercent / 100);
          const actualPrice = openPrice * (1 + entry.value / 100);
          
          return (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full shadow-lg" 
                  style={{ 
                    backgroundColor: entry.color,
                    boxShadow: `0 0 6px ${entry.color}80`
                  }}
                />
                <span className="text-white text-[12px] font-medium">{entry.name}</span>
              </div>
              <div className="text-right">
                <div className="text-white text-[12px] font-bold">
                  ${actualPrice.toFixed(2)}
                </div>
                <div className={`text-[10px] font-medium ${entry.value >= 0 ? 'text-[#0FEDBE]' : 'text-[#F63C6B]'}`}>
                  {entry.value >= 0 ? '+' : ''}{entry.value.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


function getCombinedChartData(indexes: Index[]) {
  if (!indexes || indexes.length === 0) return [];
  
  const longestChart = indexes.reduce((prev, current) => 
    (current.chartData?.length || 0) > (prev.chartData?.length || 0) ? current : prev
  );
  
  if (!longestChart.chartData || longestChart.chartData.length === 0) {
    return [];
  }
  
  return longestChart.chartData.map((dataPoint, i) => {
    const combinedPoint: any = { time: dataPoint.time };
    
    indexes.forEach(index => {
      if (index.chartData && index.chartData[i]) {

        combinedPoint[index.symbol] = index.chartData[i].value;
      }
    });
    
    return combinedPoint;
  });
}

export default function IndexChart({ indexes, activeIndex, onIndexClick }: IndexChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);

  if (!indexes || indexes.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-gray-500 text-sm">
        No data available
      </div>
    );
  }

  const combinedData = getCombinedChartData(indexes);
  
  if (combinedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-gray-500 text-sm">
        Loading chart data...
      </div>
    );
  }

  const isLimitedData = combinedData.length < 4;

  return (
    <div className="relative space-y-3">
      <button disabled className="opacity-40 cursor-not-allowed" title="Coming soon">
        1W
      </button>
      

      {isLimitedData && (
        <div className="flex items-center justify-end px-2">
          <div className="flex items-center gap-2 bg-yellow-900/20 border border-yellow-700/30 text-yellow-500 text-[11px] px-2.5 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
            <span className="font-medium">Market Closed</span>
          </div>
        </div>
      )}


      <div className="flex justify-center gap-3 px-2">
        {indexes.map((index) => {
          const isActive = activeIndex === index.symbol || hoveredIndex === index.symbol;
          const isPositive = index.change >= 0;
          
          return (
            <button
              key={index.symbol}
              onClick={() => onIndexClick?.(index.symbol)}
              onMouseEnter={() => setHoveredIndex(index.symbol)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                flex items-center gap-2 px-2.5 py-1.5 rounded-lg
                transition-all duration-200
                ${isActive 
                  ? 'bg-white/10 scale-105' 
                  : 'hover:bg-white/5'
                }
              `}
            >
              <div 
                className="w-2.5 h-0.5 rounded-full transition-all duration-200"
                style={{ 
                  backgroundColor: index.color,
                  boxShadow: isActive ? `0 0 10px ${index.color}` : 'none'
                }}
              />
              <div className="text-left">
                <div className="text-[11px] text-gray-400 font-medium leading-tight">{index.name}</div>
                <div className={`text-[12px] font-bold leading-tight ${isPositive ? 'text-[#0FEDBE]' : 'text-[#F63C6B]'}`}>
                  {isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%
                </div>
              </div>
            </button>
          );
        })}
      </div>


      <div className="bg-gradient-to-b from-[#1A1A1A]/50 to-transparent rounded-lg p-3">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={combinedData}
            margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
          >
       
            <CartesianGrid 
              strokeDasharray="0" 
              stroke="#2A2A2A" 
              vertical={false}
            />
            
        
            <XAxis 
              dataKey="time"
              stroke="#444"
              tick={{ fill: '#666', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#333' }}
              interval="preserveStartEnd"
              minTickGap={40}
            />
        
            <YAxis 
              orientation="left"
              stroke="#444"
              tick={{ fill: '#666', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#333' }}
              domain={['auto', 'auto']}
              tickFormatter={(value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`}
            />
            
        
            <Tooltip content={<CustomTooltip indexes={indexes} />} />
            
          
            {indexes.map((index) => {
              const isActive = activeIndex === index.symbol || hoveredIndex === index.symbol;
              const opacity = activeIndex && !isActive ? 0.2 : 1;
              
              return (
                <Line
                  key={index.symbol}
                  type="natural"  
                  dataKey={index.symbol}
                  stroke={index.color}
                  strokeWidth={isActive ? 3 : 2.5}
                  dot={false}
                  name={index.name}
                  opacity={opacity}
                  activeDot={{ 
                    r: 5, 
                    stroke: index.color, 
                    strokeWidth: 2.5, 
                    fill: '#0A0A0A',
                    style: { 
                      filter: `drop-shadow(0 0 5px ${index.color})` 
                    }
                  }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                  style={{
                    transition: 'all 0.3s ease'
                  }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}