import type { Task } from '../pages/Dashboard'
import TaskItem from './TaskItem'

type TaskListProps = {
  tasks: Task[]
  onDeleteTask: (id: number) => void
  onToggleTask: (id: number) => void
}

function TaskList({ tasks, onDeleteTask, onToggleTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
        No tasks yet. Add your first one.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDeleteTask={onDeleteTask} onToggleTask={onToggleTask} />
      ))}
    </ul>
  )
}

export default TaskList
