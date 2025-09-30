const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

export const fetchMarketNews = async () => {
  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/news?category=general&token=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();
    return data.slice(0, 8); 
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const fetchStockNews = async (symbol) => {
  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=2024-01-01&to=2024-12-31&token=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch stock news');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stock news:', error);
    throw error;
  }
};