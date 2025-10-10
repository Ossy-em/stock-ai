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

  return (
    <div 
      onClick={onClick}
      className={`
        group relative flex flex-col justify-between rounded-lg px-3 
        bg-gradient-to-br ${bgGradient}
        transition-all duration-300 cursor-pointer
        hover:scale-[1.02] hover:shadow-lg hover:shadow-${isPositive ? 'green' : 'red'}-500/20
        ${isActive 
          ? `border-[${index.color}] shadow-lg shadow-[${index.color}]/30` 
          : 'border-[#2A2A2A] hover:border-[#3A3A3A]'
        }
      `}
    >
  
      <div 
        className="absolute left-0  h-8 w-1 rounded-full transition-all duration-300 group-hover:w-1.5"
        style={{ backgroundColor: index.color }}
      />
   
      <div className="flex items-start justify-between mb-2 ml-2">
        <div className="flex-1">
          <h3 className="text-[13px] font-semibold text-white/90 leading-tight mb-0.5">
            {index.name}
          </h3>
          <span className="text-[11px] text-gray-500 font-mono">{index.symbol}</span>
        </div>
        
        <div className={`${changeColor} transition-transform group-hover:scale-110 flex-shrink-0`}>
          {isPositive ? (
            <TrendingUp size={14} strokeWidth={2.5} />
          ) : (
            <TrendingDown size={14} strokeWidth={2.5} />
          )}
        </div>
      </div>

      <div className="ml-2.5 space-y-1">
        <div className="text-xl font-bold text-white leading-none">
          ${index.price.toFixed(2)}
        </div>
        
        <div className={`flex items-center gap-1.5 ${changeColor} text-[13px] font-semibold`}>
          <span>
            {isPositive ? '+' : ''}{index.change.toFixed(2)}
          </span>
          <span className="text-[11px] opacity-80">
            ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-lg transition-colors pointer-events-none" />
    </div>
  );
}