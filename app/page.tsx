import CompanyInfo from '@/components/company-info'
import { TodoApp } from '@/components/todo-app'

export default function Home() {
  return (
    <main className="container mx-auto p-4 bg-[#f5f5f5]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4">
          <TodoApp />
        </div>
        <div className="md:col-span-8">
          <CompanyInfo />
        </div>
      </div>
    </main>
  )
}