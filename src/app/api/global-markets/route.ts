import { NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const markets = [
  { name: "USA (S&P 500)", symbol: "^GSPC", coordinates: [-95.7129, 37.0902] },
  { name: "USA (NASDAQ)", symbol: "^IXIC", coordinates: [-118.2437, 34.0522] },
  { name: "UK (FTSE 100)", symbol: "^FTSE", coordinates: [-0.1276, 51.5074] },
  { name: "Japan (Nikkei)", symbol: "^N225", coordinates: [139.6917, 35.6895] },
  { name: "Germany (DAX)", symbol: "^GDAXI", coordinates: [10.4515, 51.1657] },
  { name: "France (CAC 40)", symbol: "^FCHI", coordinates: [2.3522, 48.8566] },
  { name: "China (Shanghai)", symbol: "000001.SS", coordinates: [121.4737, 31.2304] },
  { name: "India (NIFTY 50)", symbol: "^NSEI", coordinates: [77.2090, 28.6139] },
  { name: "Brazil (BOVESPA)", symbol: "^BVSP", coordinates: [-46.6333, -23.5505] },
]

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function GET() {
  try {
    // Check cache first
    const { data: cachedData, error: cacheError } = await supabase
      .from('global_markets')
      .select('*')
      .gte('updated_at', new Date(Date.now() - CACHE_DURATION).toISOString())

    // If cache is fresh and complete, return it
    if (!cacheError && cachedData && cachedData.length === markets.length) {
      console.log('Returning cached data')
      return NextResponse.json({ 
        markets: cachedData, 
        source: 'cache',
        timestamp: new Date().toISOString() 
      })
    }

    console.log('Fetching fresh data from Yahoo Finance...')

    // Fetch fresh data
    const marketData = await Promise.all(
      markets.map(async (market) => {
        try {
          const quote = await yahooFinance.quote(market.symbol)
          
          return {
            name: market.name,
            symbol: market.symbol,
            coordinates: market.coordinates,
            price: quote.regularMarketPrice || 0,
            change: quote.regularMarketChange || 0,
            change_percent: quote.regularMarketChangePercent || 0,
            market_state: quote.marketState || 'CLOSED',
          }
        } catch (error) {
          console.error(`Error fetching ${market.symbol}:`, error)
          return null
        }
      })
    )

    const validData = marketData.filter(data => data !== null)

    // Store in Supabase
    for (const market of validData) {
      await supabase
        .from('global_markets')
        .upsert({
          symbol: market.symbol,
          name: market.name,
          coordinates: market.coordinates,
          price: market.price,
          change: market.change,
          change_percent: market.change_percent,
          market_state: market.market_state,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'symbol'
        })
    }

    console.log('Data stored successfully')

    return NextResponse.json({ 
      markets: validData, 
      source: 'api',
      timestamp: new Date().toISOString() 
    })
    
  } catch (error) {
    console.error('Global markets API error:', error)
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 })
  }
}