import { NextRequest, NextResponse } from 'next/server';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tickers, quotes, histories } = body;

    // Validate input
    if (!tickers || !quotes || !histories) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      );
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not set in environment variables');
    }

    // ===== STEP 1: BUILD THE PROMPT =====
    // This is the key to AI integration - we transform data into a readable prompt
    
    let prompt = `You are a financial analyst. Compare the following stocks and provide 3-5 key insights:\n\n`;

    // Add quote data for each stock
    quotes.forEach((q: any, i: number) => {
      prompt += `**${tickers[i]}**\n`;
      prompt += `- Current Price: $${q.price.toFixed(2)}\n`;
      prompt += `- Change: ${q.changePercent.toFixed(2)}%\n`;
      if (q.marketCap) {
        prompt += `- Market Cap: $${(q.marketCap / 1e9).toFixed(2)}B\n`;
      }
      if (q.peRatio) {
        prompt += `- P/E Ratio: ${q.peRatio.toFixed(2)}\n`;
      }
      prompt += `\n`;
    });

    // Add historical performance context
    prompt += `\nHistorical Performance:\n`;
    histories.forEach((h: any, i: number) => {
      const candles = h.candles;
      if (candles && candles.length > 1) {
        const firstPrice = candles[0].c;
        const lastPrice = candles[candles.length - 1].c;
        const change = ((lastPrice - firstPrice) / firstPrice) * 100;
        prompt += `- ${tickers[i]}: ${change > 0 ? '+' : ''}${change.toFixed(2)}% over period\n`;
      }
    });

    prompt += `\nProvide insights on:\n`;
    prompt += `1. Relative valuation (which appears over/undervalued)\n`;
    prompt += `2. Recent momentum and trends\n`;
    prompt += `3. Risk considerations\n`;
    prompt += `4. Which might be better for different investor profiles\n\n`;
    prompt += `Format as 3-5 concise bullet points. Be specific and data-driven.`;

    // ===== STEP 2: CALL OPENAI API =====
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Cheaper and faster than GPT-4, perfect for this use case
        messages: [
          {
            role: 'system',
            content: 'You are a helpful financial analyst assistant. Provide clear, concise stock comparisons.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7, // Some creativity but not too much
        max_tokens: 500, // Limit response length
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error('OpenAI API error');
    }

    const aiData = await openaiResponse.json();

    // ===== STEP 3: PARSE AND FORMAT RESPONSE =====
    // OpenAI returns: { choices: [{ message: { content: "..." } }] }
    const aiText = aiData.choices[0]?.message?.content || 'No insights generated';

    // Split into bullet points (AI usually formats with - or • or numbered lists)
    const insights = aiText
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.trim().replace(/^[-•\d.)\s]+/, '').trim()) // Remove bullet markers
      .filter(line => line.length > 10); // Filter out very short lines

    return NextResponse.json({ insights });

  } catch (error) {
    console.error('AI comparison error:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
