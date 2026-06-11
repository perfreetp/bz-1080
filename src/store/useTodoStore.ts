import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TodoItem } from '../types';
import { generateId, getToday } from '../utils/date';

interface TodoState {
  todos: TodoItem[];
  addTodo: (todo: Omit<TodoItem, 'id' | 'completed' | 'createdAt'>) => void;
  updateTodo: (id: string, todo: Partial<TodoItem>) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  getTodosByDate: (babyId: string, date: string) => TodoItem[];
  getTodayTodos: (babyId: string) => TodoItem[];
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      addTodo: (todo) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              ...todo,
              id: generateId(),
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateTodo: (id, todo) =>
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, ...todo } : t)),
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
        })),
      getTodosByDate: (babyId, date) =>
        get()
          .todos.filter((t) => t.babyId === babyId && t.date === date)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      getTodayTodos: (babyId) => get().getTodosByDate(babyId, getToday()),
    }),
    {
      name: 'babycare-todos',
    }
  )
);
