import { NextResponse } from 'next/server'
import OpenAI from 'openai'

interface OpenAIError {
  message: string;
  type?: string;
  code?: string;
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key is not configured in environment variables')
    return NextResponse.json(
      { error: 'OpenAI API key not configured' }, 
      { status: 500 }
    )
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const { companyName } = await req.json()
    
    if (!companyName) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      )
    }

    console.log('Requesting data for:', companyName); // Debug log

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a financial analyst providing verified company information. Only provide information that you can verify from reliable sources. If specific financial data is not available or uncertain, indicate that in the response. Do not generate or estimate numbers.`
        },
        {
          role: "user",
          content: `Please provide verified financial information for ${companyName} in JSON format. Include:

1. The most recent verified quarterly revenue figures (only if publicly reported)
2. The most recent verified quarterly profit figures (only if publicly reported)
3. A factual summary of the company's current business state and market position

For any data point that cannot be verified, use null.

Format the response as a JSON object with the following structure:
{
  "revenue": {
    "data": [numbers in millions] or null,
    "period": ["Q4 2023", ...] or null,
    "source": "Source of data (e.g., Latest 10-Q filing, Annual Report)" or null
  },
  "profit": {
    "data": [numbers in millions] or null,
    "period": ["Q4 2023", ...] or null,
    "source": "Source of data" or null
  },
  "summary": "Verified factual summary",
  "dataAvailability": "Public|Private|Limited",
  "lastUpdated": "Date of most recent data"
}`
        }
      ],
      model: "gpt-3.5-turbo",  // Changed to gpt-3.5-turbo as gpt-4-turbo-preview might not be available
      temperature: 0.3,
      max_tokens: 1000,
    })

    console.log('OpenAI Response:', completion.choices[0]?.message?.content); // Debug log

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No response from OpenAI')
    }

    try {
      const financialData = JSON.parse(completion.choices[0].message.content)
      return NextResponse.json({ financials: financialData })
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw Content:', completion.choices[0].message.content);
      return NextResponse.json(
        { error: 'Invalid response format from OpenAI' },
        { status: 500 }
      )
    }

  } catch (error: unknown) {
    const err = error as OpenAIError
    console.error('OpenAI API error:', err);
    return NextResponse.json(
      { 
        error: 'Failed to fetch company information',
        details: err.message || 'Unknown error',
        type: err.type,
        code: err.code
      }, 
      { status: 500 }
    )
  }
} 