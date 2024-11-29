'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Check, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')

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

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      const newTodoObj = { title: newTodo.trim(), completed: false }

      try {
        const { data, error } = await supabase
          .from('todos')
          .insert([newTodoObj])
          .select()

        if (error) {
          console.error('Error inserting todo:', error)
          return
        }

        if (data && data.length > 0) {
          setTodos(prevTodos => [...prevTodos, data[0]])
          setNewTodo('')
        }
      } catch (error) {
        console.error('Exception while adding todo:', error)
      }
    }
  }

  const handleToggleTodo = async (id: number) => {
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

  const handleDeleteTodo = async (id: number) => {
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center text-[#044462]">Todo List</h1>
      <div className="flex space-x-2">
        <Input
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
          className="flex-grow border-[#e0e0e0] focus-visible:ring-[#009845]"
        />
        <Button
          onClick={handleAddTodo}
          size="icon"
          className="bg-[#009845] hover:bg-[#008038] text-white transition-colors"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-2 bg-white border border-[#e0e0e0] p-3 rounded-lg shadow-sm"
          >
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleToggleTodo(todo.id)}
              className={todo.completed ? 'text-[#009845] hover:text-[#008038] hover:bg-[#f5f5f5]' : 'text-gray-400 hover:bg-[#f5f5f5]'}
            >
              <Check className="h-4 w-4" />
            </Button>
            <span
              className={`flex-grow ${
                todo.completed ? 'line-through text-gray-400' : 'text-[#333333]'
              }`}
            >
              {todo.title}
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleDeleteTodo(todo.id)}
              className="text-[#dc2626] hover:text-[#b91c1c] hover:bg-[#f5f5f5]"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
