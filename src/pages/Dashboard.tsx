import { useEffect, useState } from 'react'
import TaskInput from '../components/TaskInput'
import TaskList from '../components/TaskList'
import { ApiError, createTask, deleteTask, getTasks, type TaskDto, updateTask } from '../services/api'

export type Task = TaskDto

type DashboardProps = {
  token: string
  onLogout: () => void
}

function Dashboard({ token, onLogout }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getTasks(token)
        setTasks(data)
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          onLogout()
          return
        }
        setError('Impossible de charger les taches.')
      } finally {
        setLoading(false)
      }
    }

    void loadTasks()
  }, [onLogout, token])

  const addTask = async (text: string) => {
    setError(null)
    try {
      const createdTask = await createTask(token, text)
      setTasks((prevTasks) => [createdTask, ...prevTasks])
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onLogout()
        return
      }
      setError('Impossible de creer la tache.')
    }
  }

  const removeTask = async (id: number) => {
    setError(null)
    try {
      await deleteTask(token, id)
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onLogout()
        return
      }
      setError('Impossible de supprimer la tache.')
    }
  }

  const toggleTask = async (id: number) => {
    setError(null)
    const currentTask = tasks.find((task) => task.id === id)
    if (!currentTask) {
      return
    }

    try {
      const updatedTask = await updateTask(token, id, { ...currentTask, done: !currentTask.done })
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? updatedTask : task)))
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onLogout()
        return
      }
      setError('Impossible de mettre a jour la tache.')
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="flex items-center justify-between rounded-2xl bg-white px-6 py-4 shadow-md">
          <h1 className="text-2xl font-bold text-slate-800">TaskFlow Dashboard</h1>
          <button
            onClick={onLogout}
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            Logout
          </button>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-md">
          <TaskInput onAddTask={addTask} />
          {error ? <p className="mb-4 text-sm text-rose-500">{error}</p> : null}
          {loading ? (
            <p className="rounded-lg border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
              Loading tasks...
            </p>
          ) : (
            <TaskList tasks={tasks} onDeleteTask={removeTask} onToggleTask={toggleTask} />
          )}
        </section>
      </div>
    </main>
  )
}

export default Dashboard
