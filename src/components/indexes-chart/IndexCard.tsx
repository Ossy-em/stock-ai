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
}

export default function IndexCard({ index }: IndexCardProps) {
  const isPositive = index.change >= 0;
  const changeColor = isPositive ? "text-[#0FEDBE]" : "text-[#F63C6B]";
  
  return (
    <div className="flex flex-col h-19 justify-center px-2">
      <div className="flex flex-row items-center gap-1 text-[14px]">
        <div 
          className="h-3 w-0.5" 
          style={{ backgroundColor: index.color }}
        />
        
        <h1>
          {index.name} 
          <span className="pl-1">${index.price.toFixed(2)}</span>
        </h1>
      </div>
      
      <span className={`${changeColor} mt-1 text-[13px]`}>
        {isPositive ? '+' : ''}{index.change.toFixed(2)} {index.changePercent.toFixed(2)}%
      </span>
    </div>
  );
}