"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Package, Users, TrendingDown, TrendingUp, LogOut } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { AuthGuard, useAuth } from "./context/auth-context"

// Mock data - in a real app, this would come from an API
const mockProducts = [
  { id: 1, name: "Wireless Headphones", stock: 5, minStock: 10, price: 99.99, supplierId: 1 },
  { id: 2, name: "Smartphone Case", stock: 25, minStock: 15, price: 19.99, supplierId: 2 },
  { id: 3, name: "USB Cable", stock: 3, minStock: 20, price: 12.99, supplierId: 1 },
  { id: 4, name: "Bluetooth Speaker", stock: 8, minStock: 12, price: 79.99, supplierId: 3 },
  { id: 5, name: "Power Bank", stock: 15, minStock: 8, price: 39.99, supplierId: 2 },
]

const mockSuppliers = [
  { id: 1, name: "TechCorp Solutions", contact: "contact@techcorp.com" },
  { id: 2, name: "Global Electronics", contact: "sales@globalelec.com" },
  { id: 3, name: "Audio Specialists", contact: "info@audiospec.com" },
]

function DashboardContent() {
  const [products] = useState(mockProducts)
  const [suppliers] = useState(mockSuppliers)
  // Get user and logout function from the Auth context
  const { user, logout } = useAuth()

  const lowStockProducts = products.filter((product) => product.stock <= product.minStock)
  const totalValue = products.reduce((sum, product) => sum + product.stock * product.price, 0)
  const totalProducts = products.reduce((sum, product) => sum + product.stock, 0)

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight"> 
              Welcome back, {user?.firstName || "User"}!
            </h1>
            <p className="text-muted-foreground">Manage your stock and suppliers efficiently</p>
          </div>
          <div className="flex gap-2 items-center">
            <Link href="/products">
              <Button className="cursor-pointer">Manage Products</Button>
            </Link>
            <Link href="/suppliers">
              <Button variant="outline" className="cursor-pointer bg-transparent">
                Manage Suppliers
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Low Stock Alerts */}
        {lowStockProducts.length > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertTitle className="text-orange-800">Low Stock Alert</AlertTitle>
            <AlertDescription className="text-orange-700">
              {lowStockProducts.length} product{lowStockProducts.length > 1 ? "s" : ""} running low on stock:
              <div className="mt-2 space-y-1">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{product.name}</span>
                    <Badge variant="destructive">{product.stock} left</Badge>
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">Across {products.length} product types</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total stock value</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</div>
              <p className="text-xs text-muted-foreground">Need restocking</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suppliers.length}</div>
              <p className="text-xs text-muted-foreground">Active suppliers</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Products */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>Latest products in your inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => {
                  const supplier = suppliers.find((s) => s.id === product.supplierId)
                  const isLowStock = product.stock <= product.minStock
                  return (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">Supplier: {supplier?.name}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={isLowStock ? "destructive" : "secondary"}>{product.stock} in stock</Badge>
                        <p className="text-xs text-muted-foreground mt-1">${product.price}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suppliers</CardTitle>
              <CardDescription>Your active suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suppliers.map((supplier) => {
                  const supplierProducts = products.filter((p) => p.supplierId === supplier.id)
                  return (
                    <div key={supplier.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{supplier.name}</p>
                        <p className="text-xs text-muted-foreground">{supplier.contact}</p>
                      </div>
                      <Badge variant="outline">{supplierProducts.length} products</Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <AuthGuard><DashboardContent /></AuthGuard>
  )
}
