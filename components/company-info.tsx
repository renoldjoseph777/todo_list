'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

interface APIResponse {
  error?: string;
  details?: string;
  summary?: string;
}

export function CompanyInfo() {
  const [companyName, setCompanyName] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)

  const getCompanySummary = async () => {
    if (!companyName.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/company-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName }),
      })
      
      const data: APIResponse = await response.json()
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to fetch company information')
      }
      
      setSummary(data.summary || '')
    } catch (error: unknown) {
      const err = error as Error
      console.error('Error:', err)
      setSummary(`Error: ${err.message || 'Failed to fetch company information. Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  const formatSummary = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.includes(':')) {
        const [title, content] = line.split(':')
        return (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold text-[#044462] mb-2">{title.trim()}</h3>
            <p className="text-[#333333] leading-relaxed">{content.trim()}</p>
          </div>
        )
      }
      return line.trim() && (
        <p key={index} className="text-[#333333] leading-relaxed mb-4">{line}</p>
      )
    })
  }

  return (
    <div className="h-full p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-[#044462] mb-8">Company Information</h1>
        <div className="flex space-x-2 mb-8">
          <Input
            placeholder="Enter company name..."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && getCompanySummary()}
            className="flex-grow border-[#e0e0e0] focus-visible:ring-[#009845] text-lg py-6"
          />
          <Button
            onClick={getCompanySummary}
            disabled={loading}
            className="bg-[#009845] hover:bg-[#008038] text-white transition-colors px-6"
          >
            <Search className="h-5 w-5 mr-2" />
            {loading ? 'Loading...' : 'Search'}
          </Button>
        </div>

        {loading && (
          <div className="bg-white border border-[#e0e0e0] p-8 rounded-lg shadow-sm">
            <div className="animate-pulse space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 bg-[#f5f5f5] rounded w-1/4"></div>
                  <div className="h-4 bg-[#f5f5f5] rounded w-full"></div>
                  <div className="h-4 bg-[#f5f5f5] rounded w-5/6"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && summary && (
          <div className="bg-white border border-[#e0e0e0] p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-[#044462] border-b border-[#e0e0e0] pb-4">
              {companyName}
            </h2>
            <div className="space-y-2">
              {formatSummary(summary)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 