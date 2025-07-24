
import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function Login() {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/login', { username, password })
      localStorage.setItem('token', data.token)
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed')
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <div className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">Sign In</Button>
        <p className="mt-4 text-sm">
          Don't have an account? <Link to="/register" className="text-emerald-600">Register</Link>
        </p>
      </form>
    </div>
  );
}