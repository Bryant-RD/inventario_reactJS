"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { UserRepository } from "@/lib/repositories"
import { Skeleton } from "./skeleton"
import { Alert, AlertDescription } from "./alert"
import { AlertCircle } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [status, setStatus] = useState<"loading" | "success" | "unauthorized">("loading")

  useEffect(() => {
    // No proteger las rutas de autenticación
    if (pathname.startsWith("/auth")) {
      setStatus("success")
      return
    }

    const verifyAccess = () => {
      const token = UserRepository.getToken()
      if (!token) {
        router.push("/auth/login")
        return
      }

      const user = UserRepository.getUser()
      // Rutas que requieren rol de 'admin'
      const adminRoutes = ["/suppliers"]

      if (user && user.role !== "admin" && adminRoutes.some((route) => pathname.startsWith(route))) {
        setStatus("unauthorized")
        return
      }

      // Si todo está bien, permitimos el acceso
      setStatus("success")
    }

    verifyAccess()
  }, [pathname, router])

  if (status === "loading") {
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

  if (status === "unauthorized") {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No tienes permiso para acceder a este recurso.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}
