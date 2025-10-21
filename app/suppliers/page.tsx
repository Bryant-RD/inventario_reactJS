"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SupplierRepository, UserRepository } from "@/lib/repositories"
import type { Supplier } from "@/app/interfaces/suppliers.interface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Truck } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function SuppliersPage() {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSuppliers = async () => {
      const token = UserRepository.getToken()
      if (!token) {
        router.push("/auth/login")
        return
      }

      try {
        const result = await SupplierRepository.getAllSuppliers()
        if (result.success && result.suppliers) {
          setSuppliers(result.suppliers)
        } else {
          setError(result.message || "No se pudieron cargar los proveedores.")
        }
      } catch (e) {
        setError("Ocurrió un error de conexión al cargar los proveedores.")
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuppliers()
  }, [router])

  if (isLoading) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6" />
            <div>
              <CardTitle>Lista de Proveedores</CardTitle>
              <CardDescription>Aquí puedes ver y gestionar todos los proveedores.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contact}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}