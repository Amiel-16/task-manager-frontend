const API_BASE_URL = 'http://localhost:8000'
const TOKEN_KEY = 'auth_token'

export type User = {
  id: number
  email: string
}

export type TaskDto = {
  id: number
  text: string
  done: boolean
}

type RequestOptions = RequestInit & {
  token?: string | null
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function normalizeTask(task: Record<string, unknown>): TaskDto {
  return {
    id: Number(task.id),
    text: String(task.text ?? task.title ?? task.description ?? ''),
    done: Boolean(task.done ?? task.completed ?? task.is_done ?? false),
  }
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json()
    if (typeof data?.detail === 'string') {
      return data.detail
    }
    if (Array.isArray(data?.detail)) {
      return data.detail
        .map((item: { msg?: string }) => item?.msg)
        .filter((message: string | undefined): message is string => Boolean(message))
        .join(', ')
    }
    return 'Une erreur est survenue.'
  } catch {
    return 'Une erreur est survenue.'
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...init } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    const message = await parseErrorMessage(response)
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export async function loginUser(email: string, password: string): Promise<string> {
  // On supprime tout le bloc try/catch de fallback
  // On utilise uniquement la fonction request avec un body JSON
  const response = await request<{ access_token: string }>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' }, // Force le header JSON
  })
  
  return response.access_token
}

export async function registerUser(email: string, password: string): Promise<void> {
  await request<void>('/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function getCurrentUser(token: string): Promise<User> {
  return request<User>('/users/me', { method: 'GET', token })
}

export async function getTasks(token: string): Promise<TaskDto[]> {
  const tasks = await request<Record<string, unknown>[]>('/tasks', { method: 'GET', token })
  return tasks.map(normalizeTask)
}

export async function createTask(token: string, text: string): Promise<TaskDto> {
  const createdTask = await request<Record<string, unknown>>('/tasks', {
    method: 'POST',
    token,
    body: JSON.stringify({ text }),
  })
  return normalizeTask(createdTask)
}

export async function updateTask(token: string, taskId: number, task: TaskDto): Promise<TaskDto> {
  const updatedTask = await request<Record<string, unknown>>(`/tasks/${taskId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ text: task.text, done: task.done }),
  })
  return normalizeTask(updatedTask)
}

export async function deleteTask(token: string, taskId: number): Promise<void> {
  await request<void>(`/tasks/${taskId}`, { method: 'DELETE', token })
}
