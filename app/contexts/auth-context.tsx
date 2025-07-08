"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { User } from "@/app/interfaces/user.interface"
import { getToken, removeToken } from "@/app/utils/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifyUser = async () => {
      const token = getToken()
      if (token) {
        try {
          // Aquí es donde obtienes el perfil del usuario desde tu backend
          const response = await fetch("/api/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const userData = await response.json()
            setUser(userData.data) // Asumiendo que la API devuelve { success: true, data: userObject }
          } else {
            // El token es inválido o ha expirado
            removeToken()
          }
        } catch (error) {
          // Error de red, etc.
          removeToken()
        }
      }
      // Si no hay token, el usuario no está autenticado. No hacemos nada aquí,
      // el AuthGuard se encargará de la redirección si es necesario.
      setIsLoading(false)
    }

    verifyUser()
  }, [])

  const logout = () => {
    removeToken()
    setUser(null)
    router.push("/auth/login")
  }

  const value = { user, isLoading, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [isLoading, user, router])

  if (isLoading || !user) {
    return <div>Loading...</div> // O un spinner de carga
  }

  return <>{children}</>
}