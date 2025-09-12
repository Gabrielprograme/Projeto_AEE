"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import { AuthService, type User } from "@/lib/auth"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await AuthService.getCurrentUser()
      setUser(currentUser)
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser)
  }

  const handleLogout = async () => {
    await AuthService.logout()
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  switch (user.role) {
    case "admin":
    default:
      return <LoginForm onLogin={handleLogin} />
  }
}
