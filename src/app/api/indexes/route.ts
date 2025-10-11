import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchAllIndexes } from '@/services/stockService';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CACHE_DURATION = 5 * 60 * 1000; 

export async function GET() {
  try {
 
    const { data: cachedData, error: cacheError } = await supabase
      .from('index_data')
      .select('*')
      .gte('updated_at', new Date(Date.now() - CACHE_DURATION).toISOString());


    if (!cacheError && cachedData && cachedData.length === 3) {
      console.log('Returning cached index data');
      return NextResponse.json({
        indexes: cachedData,
        source: 'cache',
        timestamp: new Date().toISOString()
      });
    }

    console.log('Fetching fresh index data from Yahoo Finance...');


    const indexes = await fetchAllIndexes();


    for (const index of indexes) {
      await supabase
        .from('index_data')
        .upsert({
          symbol: index.symbol,
          name: index.name,
          price: index.price,
          change: index.change,
          change_percent: index.changePercent,
          color: index.color,
          chart_data: index.chartData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'symbol'
        });
    }

    console.log('Index data cached successfully');

    return NextResponse.json({
      indexes,
      source: 'api',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Indexes API error:', error);
    return NextResponse.json({ error: 'Failed to fetch index data' }, { status: 500 });
  }
}