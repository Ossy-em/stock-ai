import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1'
const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// High-quality news sources (lowercase for matching)
const PREMIUM_SOURCES = [
  'reuters', 'bloomberg', 'wsj', 'cnbc', 'marketwatch',
  'ft', 'barrons', 'seekingalpha', 'investing.com', 'yahoo',
  'benzinga', 'thestreet', 'fool', 'zacks'
]

// Financial keywords that indicate market-relevant news
const FINANCIAL_KEYWORDS = [
  'earnings', 'revenue', 'profit', 'quarter', 'fiscal', 'eps',
  'analyst', 'upgrade', 'downgrade', 'rating', 'price target', 'outlook',
  'merger', 'acquisition', 'deal', 'buyout', 'm&a',
  'sec', 'filing', 'regulatory', 'investigation',
  'dividend', 'buyback', 'split', 'share',
  'guidance', 'forecast', 'beat', 'miss',
  'fed', 'interest rate', 'inflation', 'treasury', 'bond',
  'ipo', 'stock', 'market', 'trading', 'investor',
  'ceo', 'executive', 'leadership', 'board',
  'sector', 'industry', 'bull', 'bear'
]

// Words that indicate low-quality or irrelevant news
const SPAM_KEYWORDS = [
  'horoscope', 'astrology', 'celebrity', 'entertainment',
  'sports', 'weather', 'recipe', 'lifestyle',
  'quiz', 'poll', 'vote now', 'click here'
]

function scoreNewsQuality(news: any): number {
  const headline = news.headline?.toLowerCase() || ''
  const source = news.source?.toLowerCase() || ''
  const summary = news.summary?.toLowerCase() || ''
  let score = 0

  // Premium source bonus (big boost)
  if (PREMIUM_SOURCES.some(s => source.includes(s))) {
    score += 50
  }

  // Financial keywords (count all matches)
  const keywordMatches = FINANCIAL_KEYWORDS.filter(keyword => 
    headline.includes(keyword) || summary.includes(keyword)
  ).length
  score += keywordMatches * 10

  // Penalize spam content
  if (SPAM_KEYWORDS.some(spam => headline.includes(spam))) {
    score -= 100
  }

  // Penalize very short headlines (likely low quality)
  if (headline.length < 30) {
    score -= 20
  }

  // Bonus for substantial headlines
  if (headline.length > 60) {
    score += 10
  }

  // Bonus for having a summary
  if (summary && summary.length > 50) {
    score += 15
  }

  // Recency bonus (newer = better)
  const hoursAgo = (Date.now() / 1000 - news.datetime) / 3600
  if (hoursAgo < 1) score += 30
  else if (hoursAgo < 3) score += 20
  else if (hoursAgo < 6) score += 10
  else if (hoursAgo < 12) score += 5

  return score
}

export async function GET() {
  try {
    // Step 1: Check for cached data
    const { data: cachedNews, error: fetchError } = await supabase
      .from('market_news')
      .select('*')
      .order('cached_at', { ascending: false })
      .limit(10)

    if (fetchError) throw fetchError

    // Step 2: Check if cache is fresh
    if (cachedNews && cachedNews.length > 0) {
      const latestCache = new Date(cachedNews[0].cached_at).getTime()
      const now = Date.now()
      const isFresh = (now - latestCache) < CACHE_DURATION

      if (isFresh) {
        console.log('✅ Returning cached premium news')
        return NextResponse.json({ 
          data: cachedNews,
          source: 'cache'
        })
      }
    }

    // Step 3: Fetch fresh general market news (most recent)
    console.log('🔄 Fetching and filtering financial news...')
    
    const response = await fetch(
      `${FINNHUB_BASE_URL}/news?category=general&token=${API_KEY}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch from Finnhub')
    }

    const allNews = await response.json()

    if (!Array.isArray(allNews) || allNews.length === 0) {
      console.log('⚠️ No fresh news, returning cached data')
      return NextResponse.json({ 
        data: cachedNews || [],
        source: 'cache-fallback'
      })
    }

    // Step 4: Score, filter, and rank news
    const scoredNews = allNews.map(news => ({
      ...news,
      qualityScore: scoreNewsQuality(news)
    }))

    const premiumNews = scoredNews
      .filter(news => news.qualityScore > 30) // Only high-quality news
      .filter((news, index, self) => 
        // Remove duplicates based on headline
        index === self.findIndex(n => n.headline === news.headline)
      )
      .sort((a, b) => b.datetime - a.datetime) // Most recent first
      .slice(0, 10)

    console.log(`📊 Scored ${allNews.length} articles, filtered to ${premiumNews.length} premium articles`)
    
    if (premiumNews.length > 0) {
      console.log(`🏆 Top article score: ${premiumNews[0].qualityScore} - "${premiumNews[0].headline.substring(0, 60)}..."`)
    }

    if (premiumNews.length === 0) {
      console.log('⚠️ No premium news after filtering, returning cached')
      return NextResponse.json({ 
        data: cachedNews || [],
        source: 'cache-fallback'
      })
    }

    // Step 5: Clear old cache and insert fresh premium data
    await supabase.from('market_news').delete().neq('id', 0)

    const newsToInsert = premiumNews.map(news => ({
      headline: news.headline,
      summary: news.summary || null,
      url: news.url,
      source: news.source || null,
      datetime: news.datetime,
      image_url: news.image || null,
      cached_at: new Date().toISOString()
    }))

    const { data: insertedNews, error: insertError } = await supabase
      .from('market_news')
      .insert(newsToInsert)
      .select()

    if (insertError) throw insertError

    console.log('✅ Premium financial news cached successfully')
    return NextResponse.json({ 
      data: insertedNews,
      source: 'fresh'
    })

  } catch (error) {
    console.error('❌ Error in market-news API:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch market news',
      message: error.message 
    }, { status: 500 })
  }
}