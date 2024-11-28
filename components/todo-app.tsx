'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Check, Trash2 } from 'lucide-react'

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }])
      setInput('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">Minimalist Todo</h1>
        <div className="flex space-x-2">
          <Input
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            className="flex-grow"
          />
          <Button
            onClick={addTodo}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 hover:opacity-90 transition-opacity"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm"
            >
              <Button
                size="sm"
                variant="ghost"
                className={`${
                  todo.completed ? 'text-green-500' : 'text-gray-400'
                } hover:text-green-600 hover:bg-green-50`}
                onClick={() => toggleTodo(todo.id)}
              >
                <Check className="h-5 w-5" />
              </Button>
              <span
                className={`flex-grow ${
                  todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
                }`}
              >
                {todo.text}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                onClick={() => deleteTodo(todo.id)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

