'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Check, Trash2 } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client using environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  // Fetch todos from Supabase on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase.from('todos').select('*')
      if (error) {
        console.error('Error fetching todos:', error)
        return
      }
      if (data) {
        setTodos(data as Todo[]) // Ensure data matches the Todo type
      }
    }
    fetchTodos()
  }, [])

  const addTodo = async () => {
    if (input.trim()) {
      const newTodo = { title: input.trim(), completed: false }

      try {
        const { data, error } = await supabase
          .from('todos')
          .insert([newTodo])
          .select()

        if (error) {
          console.error('Error inserting todo:', error)
          return
        }

        if (data && data.length > 0) {
          setTodos(prevTodos => [...prevTodos, data[0]])
          setInput('')
        }
      } catch (error) {
        console.error('Exception while adding todo:', error)
      }
    }
  }

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    const updatedTodo = { ...todo, completed: !todo.completed }

    try {
      const { data, error } = await supabase
        .from('todos')
        .update({ completed: updatedTodo.completed })
        .eq('id', id)

      if (error) {
        console.error('Error updating todo:', error)
        return
      }

      if (data) {
        setTodos(todos.map(t => (t.id === id ? updatedTodo : t)))
      }
    } catch (error) {
      console.error('Exception while toggling todo:', error)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      const { error } = await supabase.from('todos').delete().eq('id', id)

      if (error) {
        console.error('Error deleting todo:', error)
        return
      }

      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Exception while deleting todo:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">Minimalist Todo </h1>
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
                {todo.title}
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
