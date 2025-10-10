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