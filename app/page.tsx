import { TodoApp } from "@/components/todo-app"
import { CompanyInfo } from "@/components/company-info"

export default function Page() {
  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      {/* Todo App - 30% width */}
      <div className="w-[30%] border-r border-[#e0e0e0] p-4 bg-white">
        <TodoApp />
      </div>
      
      {/* Company Info - 70% width */}
      <div className="w-[70%] bg-white">
        <CompanyInfo />
      </div>
    </div>
  )
}