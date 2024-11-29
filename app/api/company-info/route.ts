import { NextResponse } from 'next/server'
import OpenAI from 'openai'

interface OpenAIError {
  message: string;
  type?: string;
  code?: string;
}

interface APIResponse {
  error?: string;
  details?: string;
  summary?: string;
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

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a business analyst providing comprehensive company information. For each company, provide information in the following format:

Overview: Brief introduction of the company
Products/Services: Main offerings
Market Position: Current standing in the industry
Key Strengths: Notable advantages or unique selling points
Recent Developments: Any significant recent news or changes`
        },
        {
          role: "user",
          content: `Please provide detailed information about ${companyName}.`
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 500,
    })

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No response from OpenAI')
    }

    return NextResponse.json({ 
      summary: completion.choices[0].message.content 
    })
  } catch (error: unknown) {
    const err = error as OpenAIError
    console.error('OpenAI API error:', err.message || 'Unknown error')
    return NextResponse.json(
      { 
        error: 'Failed to fetch company information',
        details: err.message || 'Unknown error'
      }, 
      { status: 500 }
    )
  }
} 