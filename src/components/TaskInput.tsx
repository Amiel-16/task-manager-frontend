import { useState } from 'react'
import type { FormEvent } from 'react'

type TaskInputProps = {
  onAddTask: (text: string) => Promise<void>
}

function TaskInput({ onAddTask }: TaskInputProps) {
  const [taskText, setTaskText] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanText = taskText.trim()
    if (!cleanText) {
      return
    }
    await onAddTask(cleanText)
    setTaskText('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={taskText}
        onChange={(event) => setTaskText(event.target.value)}
        placeholder="What needs to be done?"
        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
      />
      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        Add Task
      </button>
    </form>
  )
}

export default TaskInput
