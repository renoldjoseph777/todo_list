'use client'

import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface FinancialData {
  revenue?: number[]
  profit?: number[]
  stockPrice?: number[]
  dates?: string[]
}

interface FinancialChartsProps {
  data: FinancialData
}

export function FinancialCharts({ data }: FinancialChartsProps) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  }

  const revenueData: ChartData<'line'> = {
    labels: data.dates || [],
    datasets: [
      {
        label: 'Revenue (Millions USD)',
        data: data.revenue || [],
        borderColor: '#009845',
        backgroundColor: 'rgba(0, 152, 69, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  }

  const profitData: ChartData<'bar'> = {
    labels: data.dates || [],
    datasets: [
      {
        label: 'Net Profit (Millions USD)',
        data: data.profit || [],
        backgroundColor: '#044462',
      },
    ],
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-[#044462] font-bold mb-4">Revenue Trend</h3>
        <div className="h-[300px]">
          <Line options={chartOptions} data={revenueData} />
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-[#044462] font-bold mb-4">Net Profit</h3>
        <div className="h-[300px]">
          <Bar options={chartOptions} data={profitData} />
        </div>
      </div>
    </div>
  )
} 