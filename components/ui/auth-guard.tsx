"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ApiUsuarios } from "@/lib/api"
import { Skeleton } from "./skeleton"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("inventory_token")

      if (!token) {
        router.push("/auth/login")
        return
      }

      try {
        // Hacemos una llamada ligera a la API para validar el token.
        // El ApiClient se encargará de redirigir si el token es inválido (401).
        const response = await ApiUsuarios.getProfile(token)
        if (response.success) {
          setIsVerified(true)
        } else {
          // Si la API devuelve un error que no es 401, también redirigimos por seguridad.
          router.push("/auth/login")
        }
      } catch (error) {
        // El interceptor en ApiClient ya debería haber manejado el error 401.
      }
    }

    verifyToken()
  }, [router])

  if (!isVerified) {
    // Muestra un esqueleto de carga mientras se verifica el token para evitar parpadeos.
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    )
  }

  return <>{children}</>
}

