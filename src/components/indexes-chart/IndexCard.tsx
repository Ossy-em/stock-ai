import { TrendingUp, TrendingDown } from "lucide-react";

interface ChartDataPoint {
  time: string;
  value: number;
}

interface Index {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  color: string;
  chartData: ChartDataPoint[];
}

interface IndexCardProps {
  index: Index;
  isActive?: boolean;
  onClick?: () => void;
}

export default function IndexCard({ index, isActive = false, onClick }: IndexCardProps) {
  const isPositive = index.change >= 0;
  const changeColor = isPositive ? "text-[#0FEDBE]" : "text-[#F63C6B]";
  const bgGradient = isPositive 
    ? "from-[#0FEDBE]/5 to-transparent" 
    : "from-[#F63C6B]/5 to-transparent";
  

  const generateSparkline = () => {
    if (!index.chartData || index.chartData.length < 2) return "";
    
    const width = 60;
    const height = 20;
    const data = index.chartData.slice(-8); 
    
    const max = Math.max(...data.map(d => d.value));
    const min = Math.min(...data.map(d => d.value));
    const range = max - min || 1;
    
    const points = data.map((point, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((point.value - min) / range) * height;
      return `${x},${y}`;
    });
    
    return `M ${points.join(" L ")}`;
  };

  return (
    <div 
      onClick={onClick}
      className={`
        group relative flex flex-col justify-between rounded-xl p-1
        bg-gradient-to-br ${bgGradient}
         transition-all duration-300 cursor-pointer
        hover:scale-105 hover:shadow-lg hover:shadow-${isPositive ? 'green' : 'red'}-500/20
        ${isActive 
          ? `border-[${index.color}] shadow-lg shadow-[${index.color}]/30` 
          : 'border-[#2A2A2A] hover:border-[#3A3A3A]'
        }
      `}
    >

      <div 
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl transition-all duration-300 group-hover:w-1"
        style={{ backgroundColor: index.color }}
      />
      
      <div className="flex items-start justify-between mb-3 ml-3">
        <div>
          <h3 className="text-sm font-semibold text-white/90 mb-0.5">
            {index.name}
          </h3>
          <span className="text-xs text-gray-500 font-mono">{index.symbol}</span>
        </div>
        
        <div className={`${changeColor} transition-transform group-hover:scale-110`}>
          {isPositive ? (
            <TrendingUp size={15} strokeWidth={2.5} />
          ) : (
            <TrendingDown size={15} strokeWidth={2.5} />
          )}
        </div>
      </div>
         
      <div className="ml-3 mb-2">
        <div className="text-2xl text-white mb-1">
          ${index.price.toFixed(2)}
        </div>
        
        <div className={`flex items-center gap-2 ${changeColor}`}>
          <span>
            {isPositive ? '+' : ''}{index.change.toFixed(2)}
          </span>
          <span className="text-xs">
            ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
      
      {index.chartData && index.chartData.length > 1 && (
        <div className="ml-3 mt-2">
          <svg width="60" height="20" className="opacity-60 group-hover:opacity-100 transition-opacity">
            <path
              d={generateSparkline()}
              fill="none"
              stroke={index.color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
   
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-xl transition-colors pointer-events-none" />
    </div>
  );
}