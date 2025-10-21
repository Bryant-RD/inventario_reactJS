"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserRepository } from "@/lib/repositories"
import { ProductRepository } from "@/lib/repositories/product_repository"
import type { Product } from "@/app/interfaces/products.interface"
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
import { AlertCircle, Package } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      // Proteger la ruta: si no hay token, redirigir al login
      const token = UserRepository.getToken()
      if (!token) {
        router.push("/auth/login")
        return
      }

      try {
        const result = await ProductRepository.getAllProducts()
        if (result.success && result.products) {
          setProducts(result.products)
        } else {
          setError(result.message || "No se pudieron cargar los productos.")
        }
      } catch (e) {
        setError("Ocurrió un error de conexión al cargar los productos.")
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
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
            <Package className="h-6 w-6" />
            <div>
              <CardTitle>Lista de Productos</CardTitle>
              <CardDescription>Aquí puedes ver y gestionar todos los productos de tu inventario.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{product.stock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}