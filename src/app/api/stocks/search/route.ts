import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 1) {
      return NextResponse.json([]);
    }

  
    const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

    if (!FINNHUB_API_KEY) {
      throw new Error('FINNHUB_API_KEY not set in environment variables');
    }

    const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${FINNHUB_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform Finnhub response to match our frontend type
    // Finnhub returns: { count, result: [{ description, displaySymbol, symbol, type }] }
    const results = data.result
      .filter((item: any) => item.type === 'Common Stock') 
      .slice(0, 10)
      .map((item: any) => ({
        ticker: item.symbol,
        name: item.description,
      }));

    return NextResponse.json(results);

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search stocks' },
      { status: 500 }
    );
  }
}