import type { Task } from '../pages/Dashboard'

type TaskItemProps = {
  task: Task
  onDeleteTask: (id: number) => void
  onToggleTask: (id: number) => void
}

function TaskItem({ task, onDeleteTask, onToggleTask }: TaskItemProps) {
  return (
    <li className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => onToggleTask(task.id)}
          className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
        />
        <span className={`text-slate-700 ${task.done ? 'text-slate-400 line-through' : ''}`}>{task.text}</span>
      </label>

      <button
        onClick={() => onDeleteTask(task.id)}
        className="rounded-md bg-rose-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
      >
        Delete
      </button>
    </li>
  )
}

export default TaskItem
