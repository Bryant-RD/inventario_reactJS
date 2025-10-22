"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserRepository } from "@/lib/repositories"
import { SupplierRepository } from "@/lib/repositories/supplier_repository"
import { ProductRepository } from "@/lib/repositories/product_repository"
import type { CreateProductData, Product } from "@/app/interfaces/products.interface"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Edit, Link, Package, Plus, Search, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select"
import { Badge } from "@/components/ui/badge"

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [formError, setFormError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [productForm, setProductForm] = useState({
    name: "",
    stock: "",
    minStock: "",
    price: "",
    supplierId: "",
    category: "",
  })

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const resetForm = () => {
    setProductForm({ name: "", stock: "", minStock: "", price: "", supplierId: "", category: "" })
    setFormError("")
  }

  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.stock || !productForm.price || !productForm.supplierId) {
      setFormError("Nombre, Stock, Precio y Proveedor son campos requeridos.")
      return
    }
    setIsSaving(true)
    setFormError("")

    const newProductData : CreateProductData = {
      nombre: productForm.name,
      cantidad: Number.parseInt(productForm.stock),
      precio: Number.parseFloat(productForm.price),
      cantidadMinima: Number.parseInt(productForm.minStock) || 0,
      proveedorId: Number.parseInt(productForm.supplierId),
      categoria: productForm.category || "General",
      descripcion: "",
    }

    const result = await ProductRepository.createProduct(newProductData)

    if (result.success && result.product) {
      // Para evitar otra llamada a la API, mapeamos la respuesta al formato del frontend
      const newProduct = {
        ...result.product,
        price: Number(result.product.price), // Asegurar que el precio es un número
      }
      setProducts([...products, newProduct])
      setIsAddDialogOpen(false)
      resetForm()
    } else {
      setFormError(result.message || "No se pudo crear el producto.")
    }
    setIsSaving(false)
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct || !productForm.name || !productForm.stock || !productForm.price) {
      setFormError("Nombre, Stock y Precio son campos requeridos.")
      return
    }
    setIsSaving(true)
    setFormError("")

    const updatedData = {
      nombre: productForm.name,
      cantidad: Number.parseInt(productForm.stock),
      precio: Number.parseFloat(productForm.price),
      cantidadMinima: Number.parseInt(productForm.minStock) || 0,
      proveedorId: Number.parseInt(productForm.supplierId),
      categoria: productForm.category || "General",
    }

    const result = await ProductRepository.updateProduct(editingProduct.id, updatedData)

    if (result.success && result.product) {
      const updatedProduct = {
        ...result.product,
        price: Number(result.product.price),
      }
      setProducts(products.map((p) => (p.id === editingProduct.id ? updatedProduct : p)))
      setIsEditDialogOpen(false)
      setEditingProduct(null)
      resetForm()
    } else {
      setFormError(result.message || "No se pudo actualizar el producto.")
    }
    setIsSaving(false)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      // Proteger la ruta: si no hay token, redirigir al login
      const token = UserRepository.getToken()
      if (!token) {
        router.push("/auth/login")
        return
      }

      try {
        // Cargar productos y proveedores en paralelo
        const [productsResult, suppliersResult] = await Promise.all([
          ProductRepository.getAllProducts(),
          SupplierRepository.getAllSuppliers(),
        ])

        if (productsResult.success && productsResult.products) {
          setProducts(productsResult.products)
        } else {
          setError(productsResult.message || "No se pudieron cargar los productos.")
        }

        if (suppliersResult.success && suppliersResult.suppliers) {
          setSuppliers(suppliersResult.suppliers)
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

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      stock: product.stock.toString(),
      minStock: (product.minStock || "").toString(),
      price: product.price.toString(),
      supplierId: product.supplierId.toString(),
      category: product.category || "",
    })
    setIsEditDialogOpen(true)
  }

    const handleUpdateStock = (productId: number, newStock: string) => {
    setProducts(
      products.map((product) =>
        product.id === productId ? { ...product, stock: Number.parseInt(newStock) } : product,
      ),
    )
  }

   const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter((product) => product.id !== productId))
  }

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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </a>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Products</h1>
              <p className="text-muted-foreground">Manage your product inventory</p>
            </div>
          </div>
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(isOpen) => {
              if (!isOpen) resetForm()
              setIsAddDialogOpen(isOpen)
            }}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Add a new product to your inventory</DialogDescription>
              </DialogHeader>
              {formError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Current Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minStock">Minimum Stock</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={productForm.minStock}
                      onChange={(e) => setProductForm({ ...productForm, minStock: e.target.value })}
                      placeholder="5"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    placeholder="Electronics, Accessories, etc."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select
                    value={productForm.supplierId}
                    onValueChange={(value) => setProductForm({ ...productForm, supplierId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id.toString()}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="cursor-pointer"
                  disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct} className="cursor-pointer" disabled={isSaving}>
                  {isSaving ? "Adding..." : "Add Product"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Edit Product Dialog */}
          <Dialog
            open={isEditDialogOpen}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setEditingProduct(null)
                resetForm()
              }
              setIsEditDialogOpen(isOpen)
            }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>Update product information</DialogDescription>
              </DialogHeader>
              {formError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-stock">Current Stock</Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-minStock">Minimum Stock</Label>
                    <Input
                      id="edit-minStock"
                      type="number"
                      value={productForm.minStock}
                      onChange={(e) => setProductForm({ ...productForm, minStock: e.target.value })}
                      placeholder="5"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    placeholder="Electronics, Accessories, etc."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-supplier">Supplier</Label>
                  <Select
                    value={productForm.supplierId}
                    onValueChange={(value) => setProductForm({ ...productForm, supplierId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id.toString()}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                  }}
                  className="cursor-pointer"
                  disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateProduct} className="cursor-pointer" disabled={isSaving}>
                  {isSaving ? "Updating..." : "Update Product"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Product Inventory</CardTitle>
            <CardDescription>{filteredProducts.length} products found</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const supplier = suppliers.find((s) => s.id === product.supplierId)
                  const isLowStock = product.stock <= product.minStock
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={product.stock}
                          onChange={(e) => handleUpdateStock(product.id, e.target.value)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>{product.minStock}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={isLowStock ? "destructive" : "secondary"}>
                          {isLowStock ? "Low Stock" : "In Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell>{supplier?.name}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(product)}
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}