export interface ChartDataPoint {
  time: string;
  value: number;
}

export async function fetchStockData(symbol: string) {
    const api = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY;
    const res = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${api}`, 
        { next: { revalidate: 60 } }
    );
    return res.json();
}

export function transformStockData(apiResponse: any): ChartDataPoint[] {
  const timeSeries = apiResponse["Time Series (60min)"];
  
  if (!timeSeries) {
    console.error("No time series data found!");
    console.error("Response:", apiResponse);
    return [];
  }
  
  const dataPoints: ChartDataPoint[] = [];
  
  for (const datetime in timeSeries) {
    const [date, time] = datetime.split(' ');
    const dayData = timeSeries[datetime];
    const closePrice = dayData["4. close"];
    

    const shortTime = time.substring(0, 5);
    

    const [hours, minutes] = shortTime.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    

    const marketOpen = 9 * 60 + 30;
    const marketClose = 16 * 60;
    
    if (timeInMinutes >= marketOpen && timeInMinutes <= marketClose) {
      dataPoints.push({
        time: shortTime,
        value: parseFloat(closePrice)
      });
    }
  }

  dataPoints.sort((a, b) => a.time.localeCompare(b.time));

  console.log(`Found ${dataPoints.length} market hours data points for stock`);

  if (dataPoints.length <= 8) {
    return dataPoints;
    }
  return dataPoints.slice(-8);
}

export async function fetchAllIndexes() {

  const spyData = await fetchStockData("SPY");
  const qqqData = await fetchStockData("QQQ");
  const diaData = await fetchStockData("DIA");

  const spyChart = transformStockData(spyData);
  const qqqChart = transformStockData(qqqData);
  const diaChart = transformStockData(diaData);

  const calculateChange = (chartData: ChartDataPoint[]) => {
    if (chartData.length < 2) return { change: 0, changePercent: 0 };
    
    const current = chartData[chartData.length - 1].value;
    const previous = chartData[chartData.length - 2].value;
    const change = current - previous;
    const changePercent = (change / previous) * 100;
    
    return { 
      change: parseFloat(change.toFixed(2)), 
      changePercent: parseFloat(changePercent.toFixed(2)) 
    };
  };
  
  const spyChange = calculateChange(spyChart);
  const qqqChange = calculateChange(qqqChart);
  const diaChange = calculateChange(diaChart);

  return [
    {
      name: "S&P 500",
      symbol: "SPY",
      price: spyChart[spyChart.length - 1]?.value || 0,
      change: spyChange.change,
      changePercent: spyChange.changePercent,
      color: "#8085FF",
      chartData: spyChart
    },
    {
      name: "NASDAQ",
      symbol: "QQQ",
      price: qqqChart[qqqChart.length - 1]?.value || 0,
      change: qqqChange.change,
      changePercent: qqqChange.changePercent,
      color: "#F044FF",
      chartData: qqqChart
    },
    {
      name: "Dow Jones",
      symbol: "DIA",
      price: diaChart[diaChart.length - 1]?.value || 0,
      change: diaChange.change,
      changePercent: diaChange.changePercent,
      color: "#FFAA2B",
      chartData: diaChart
    }
  ];
}