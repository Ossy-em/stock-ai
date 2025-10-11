import yahooFinance from 'yahoo-finance2';

export interface ChartDataPoint {
  time: string;
  value: number;
}

export interface Index {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  color: string;
  chartData: ChartDataPoint[];
}

const INDEX_SYMBOLS = {
  SPY: { name: "S&P 500", color: "#8085FF" },
  QQQ: { name: "NASDAQ", color: "#F044FF" },
  DIA: { name: "Dow Jones", color: "#FFAA2B" }
};


function generateIntradayData(currentPrice: number, changePercent: number): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const totalPoints = 26; 

  const openPrice = currentPrice / (1 + changePercent / 100);
  
  for (let i = 0; i <= totalPoints; i++) {

    const totalMinutes = i * 15;
    const hour = 9 + Math.floor((30 + totalMinutes) / 60);
    const minute = (30 + totalMinutes) % 60;
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    
    const progress = i / totalPoints;
    
    const trendPrice = openPrice + (currentPrice - openPrice) * progress;
    

    const wave1 = Math.sin(progress * Math.PI * 2.5) * (currentPrice * 0.003); 
    const wave2 = Math.sin(progress * Math.PI * 5) * (currentPrice * 0.0015);  
    const randomNoise = (Math.random() - 0.5) * (currentPrice * 0.001);        
    

    const priceAtPoint = trendPrice + wave1 + wave2 + randomNoise;
    

    const percentFromOpen = ((priceAtPoint - openPrice) / openPrice) * 100;
    
    data.push({
      time,
      value: parseFloat(percentFromOpen.toFixed(3))  // Store as percentage
    });
  }
  
  return data;
}

export async function fetchAllIndexes(): Promise<Index[]> {
  try {
    const symbols = Object.keys(INDEX_SYMBOLS);
    
    const quotes = await Promise.all(
      symbols.map(symbol => yahooFinance.quote(symbol))
    );

    const indexes: Index[] = quotes.map((quote, i) => {
      const symbol = symbols[i];
      const config = INDEX_SYMBOLS[symbol as keyof typeof INDEX_SYMBOLS];
      
      const price = quote.regularMarketPrice || 0;
      const change = quote.regularMarketChange || 0;
      const changePercent = quote.regularMarketChangePercent || 0;
      
      return {
        name: config.name,
        symbol: symbol,
        price: price,
        change: change,
        changePercent: changePercent,
        color: config.color,
        chartData: generateIntradayData(price, changePercent)
      };
    });
    
    return indexes;
    
  } catch (error) {
    console.error('Error fetching indexes:', error);
    throw error;
  }
}