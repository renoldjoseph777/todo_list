'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronRight,
  Home,
  LineChart,
  Wallet,
  History,
  Bell,
  Settings,
  HelpCircle,
  Layout,
  BookOpen,
  Briefcase,
  DollarSign
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MenuItem {
  title: string
  icon: React.ReactNode
  href?: string
  submenu?: {
    title: string
    href: string
  }[]
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: <Home className="h-5 w-5" />,
    href: '/'
  },
  {
    title: 'Trading',
    icon: <LineChart className="h-5 w-5" />,
    submenu: [
      { title: 'Market Overview', href: '/market' },
      { title: 'Trade Stocks', href: '/stocks' },
      { title: 'Trade Crypto', href: '/crypto' },
      { title: 'Trade Forex', href: '/forex' }
    ]
  },
  {
    title: 'Portfolio',
    icon: <Briefcase className="h-5 w-5" />,
    submenu: [
      { title: 'Holdings', href: '/portfolio' },
      { title: 'Watchlist', href: '/watchlist' },
      { title: 'Performance', href: '/performance' }
    ]
  },
  {
    title: 'Wallet',
    icon: <Wallet className="h-5 w-5" />,
    submenu: [
      { title: 'Deposit', href: '/deposit' },
      { title: 'Withdraw', href: '/withdraw' },
      { title: 'Transaction History', href: '/transactions' }
    ]
  },
  {
    title: 'Analysis',
    icon: <BookOpen className="h-5 w-5" />,
    submenu: [
      { title: 'Technical Analysis', href: '/technical' },
      { title: 'Fundamental Analysis', href: '/fundamental' },
      { title: 'Market Research', href: '/research' }
    ]
  },
  {
    title: 'Orders',
    icon: <History className="h-5 w-5" />,
    href: '/orders'
  },
  {
    title: 'Alerts',
    icon: <Bell className="h-5 w-5" />,
    href: '/alerts'
  },
  {
    title: 'Reports',
    icon: <DollarSign className="h-5 w-5" />,
    href: '/reports'
  },
  {
    title: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    href: '/settings'
  },
  {
    title: 'Help & Support',
    icon: <HelpCircle className="h-5 w-5" />,
    href: '/support'
  }
]

export function SidebarNav() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (title: string) => {
    setExpandedItems(current =>
      current.includes(title)
        ? current.filter(item => item !== title)
        : [...current, title]
    )
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-[#e0e0e0] transition-all duration-300 z-50",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 bg-[#009845] text-white p-1 rounded-full"
      >
        <ChevronRight className={cn(
          "h-4 w-4 transition-transform",
          isCollapsed ? "" : "rotate-180"
        )} />
      </button>

      <div className="flex items-center gap-2 p-4 border-b border-[#e0e0e0]">
        <Layout className="h-6 w-6 text-[#009845]" />
        {!isCollapsed && <span className="font-bold text-[#044462]">Learning Portal</span>}
      </div>

      <nav className="p-2">
        {menuItems.map((item) => (
          <div key={item.title} className="mb-1">
            {item.submenu ? (
              <>
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className={cn(
                    "flex items-center w-full gap-2 p-2 rounded-lg hover:bg-[#f5f5f5] text-[#333333]",
                    expandedItems.includes(item.title) && "bg-[#f5f5f5]"
                  )}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform",
                        expandedItems.includes(item.title) && "rotate-90"
                      )} />
                    </>
                  )}
                </button>
                {!isCollapsed && expandedItems.includes(item.title) && (
                  <div className="ml-9 mt-1 space-y-1">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.href}
                        href={subitem.href}
                        className="block p-2 rounded-lg hover:bg-[#f5f5f5] text-[#666666]"
                      >
                        {subitem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href || '#'}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f5f5f5] text-[#333333]"
              >
                {item.icon}
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
} 