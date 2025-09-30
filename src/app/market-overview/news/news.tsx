
import HeatMap from "@/app/market-overview/news/heat-map";
import TopGainers from "@/app/market-overview/news/top-gainers";
import TopNews from "@/app/market-overview/news/top-news";

export default function MarketOverviewPage() {
    return (
    <div className="w-full grid grid-cols-3 h-[583px] gap-2">
           <div className="flex-1"> <HeatMap/> </div>
                     <div className="flex-1"><TopNews/></div>  
             <div className="flex-1 bg-blue-400"><TopGainers/> </div>
    
        </div>
    )
}