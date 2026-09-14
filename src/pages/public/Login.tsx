import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { signIn } from '../../features/auth/authService'
import Logo from '../../components/layout/Logo'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import ErrorMessage from '../../components/ui/ErrorMessage'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn({ email, password })
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <div className="bg-[#0C447C] sm:w-2/5 flex flex-col items-center justify-center gap-4 px-8 py-16">
        <Logo variant="avatar" theme="dark" />
        <h2 className="text-2xl font-bold text-white">EventEase</h2>
        <p className="text-[#B5D4F4] text-center max-w-xs">Plan your event with ease, one booking at a time.</p>
      </div>

      <div className="sm:w-3/5 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Log in to continue planning.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            {error && <ErrorMessage message={error} />}
            <Button type="submit" disabled={loading} className="w-full !py-3 text-base">
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
            Don't have an account? <Link to="/register" className="text-[#0C447C] dark:text-[#85B7EB] font-semibold">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
