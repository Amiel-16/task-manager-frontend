import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type ChatPageProps = {
  onUnauthorized: () => void
}

function ChatPage({ onUnauthorized }: ChatPageProps) {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedInput = input.trim()
    if (!trimmedInput || loading) {
      return
    }

    const token = localStorage.getItem('auth_token')
    if (!token) {
      setError('You need to log in before using the chat.')
      return
    }

    const userMessage: ChatMessage = { role: 'user', content: trimmedInput }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput('')
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8001/chat', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: trimmedInput }),
      })

      if (response.status === 401) {
        onUnauthorized()
        return
      }

      if (!response.ok) {
        throw new Error('Chat API request failed')
      }

      const data = (await response.json()) as { response?: string }
      if (!data.response) {
        throw new Error('Invalid chat response payload')
      }

      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: data.response as string }])
    } catch (_err) {
      setError('Sorry, something went wrong while contacting the assistant. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex h-screen flex-col bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm">
        <div className="mx-auto flex w-full max-w-4xl items-start gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex shrink-0 items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900"
          >
            ← Back
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-slate-800">AI Chat</h1>
            <p className="text-sm text-slate-500">Ask the assistant anything about your tasks.</p>
          </div>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col overflow-hidden px-4 py-4">
        <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {messages.length === 0 ? (
            <p className="text-center text-sm text-slate-500">Start the conversation by sending a message.</p>
          ) : null}

          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm md:max-w-[70%] ${
                  message.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {loading ? (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-slate-200 px-4 py-2 text-sm text-slate-600">Assistant is typing...</div>
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>

        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

        <form onSubmit={handleSubmit} className="sticky bottom-0 mt-4 flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100"
          />
          <button
            type="submit"
            disabled={loading || input.trim().length === 0}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default ChatPage
