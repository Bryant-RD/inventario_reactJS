"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Product } from "../interfaces/products.interface"
import { UpdateProductData } from "../interfaces/products.interface"
import { ApiProductos, ApiProveedores } from "@/lib/api"
import { getToken } from "../utils/auth"


let token = getToken()

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    stock: "",
    minStock: "5",
    price: "",
    supplierId: "",
    category: "",
  })
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  
  // ✅ Traer productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) return
      
      try {
        const res = await ApiProductos.getAllProducts(token)
        console.log(res)
        if (res.products) {
          setProducts(res.products)
          console.log(res.products)
        }
      } catch (error) { // TODO: Handle error in UI
        console.error("Error fetching products:", error) // TODO: Handle error in UI
      }
    }

    const fetchSuppliers = async () => {
      if (!token) return
      try {
        const res = await ApiProveedores.getAllSuppliers(token)
        if (res.suppliers) {
          setSuppliers(res.suppliers)
          console.log(res.suppliers)
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error)
      }
    }

    fetchProducts()
    fetchSuppliers()
  }, [token])

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.stock && newProduct.price && token) {
      try { // TODO: Add validation for price
        const created = await ApiProductos.createProduct(token, {
          nombre: newProduct.name,
          cantidad: Number.parseInt(newProduct.stock),
          cantidadMinima: Number.parseInt(newProduct.minStock) || 5,
          precio: Number.parseFloat(newProduct.price),
          proveedorId: Number.parseInt(newProduct.supplierId) || 1,
          categoria: newProduct.category || "General",
          descripcion: "FALTA ESTE CAMPO"
        })
        if (created.product) {
          setProducts([...products, created.product])
        }
        setNewProduct({ name: "", stock: "", minStock: "", price: "", supplierId: "", category: "" })
        setIsAddDialogOpen(false) // TODO: Add success message
      } catch (error) {
        console.error("Error creating product:", error)
      }
    }
  }

  const handleUpdateStock = async (productId: number, newStock: number) => {
    if (token) {
      try {
        await ApiProductos.updateStock(token, productId, newStock)
        setProducts(products.map((p) => (p.id === productId ? { ...p, stock: newStock } : p)))
      } catch (error) {
        console.error("Error updating stock:", error) // TODO: Handle error in UI
      }
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (token) {
      try {
        await ApiProductos.deleteProduct(token, productId)
        setProducts(products.filter((p) => p.id !== productId))
      } catch (error) { // TODO: Handle error in UI
        console.error("Error deleting product:", error)
      }
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setNewProduct({
      name: product.nombre,
      stock: product.cantidad.toString(),
      minStock: product.cantidadMinima.toString(),
      price: product.precio.toString(),
      supplierId: product.proveedorId.toString(),
      category: product.categoria,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateProduct = async () => {
    if (editingProduct && newProduct.name && newProduct.stock && newProduct.price && token) {
      try { // TODO: Add validation for price

        const updated = await ApiProductos.updateProduct(token, editingProduct.id, {
          nombre: newProduct.name,
          cantidad: Number.parseInt(newProduct.stock),
          cantidadMinima: Number.parseInt(newProduct.minStock) || 5,
          precio: Number.parseFloat(newProduct.price),
          proveedorId: Number.parseInt(newProduct.supplierId) || 1,
          categoria: newProduct.category || "General",
        } as UpdateProductData) // TODO: Add validation for price
        if (updated.product) {
          setProducts(products.map((p) => (p.id === editingProduct.id ? updated.product : p)) as Product[])
        }
        setNewProduct({ name: "", stock: "", minStock: "", price: "", supplierId: "", category: "" })
        setEditingProduct(null)
        setIsEditDialogOpen(false)
      } catch (error) {
        console.error("Error updating product:", error) // TODO: Handle error in UI
      }
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Products</h1>
              <p className="text-muted-foreground">Manage your product inventory</p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Current Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minStock">Minimum Stock</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={newProduct.minStock}
                      onChange={(e) => setNewProduct({ ...newProduct, minStock: e.target.value })}
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
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    placeholder="Electronics, Accessories, etc."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select
                    value={newProduct.supplierId}
                    onValueChange={(value) => setNewProduct({ ...newProduct, supplierId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id.toString()}>
                          {supplier.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="cursor-pointer">
                  Cancel
                </Button>
                <Button onClick={handleAddProduct} className="cursor-pointer">
                  Add Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Edit Product Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>Update product information</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-stock">Current Stock</Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-minStock">Minimum Stock</Label>
                    <Input
                      id="edit-minStock"
                      type="number"
                      value={newProduct.minStock}
                      onChange={(e) => setNewProduct({ ...newProduct, minStock: e.target.value })}
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
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    placeholder="Electronics, Accessories, etc."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-supplier">Supplier</Label>
                  <Select
                    value={newProduct.supplierId}
                    onValueChange={(value) => setNewProduct({ ...newProduct, supplierId: value })}
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
                    setEditingProduct(null)
                    setNewProduct({ name: "", stock: "", minStock: "", price: "", supplierId: "", category: "" })
                  }}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateProduct} className="cursor-pointer">
                  Update Product
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
                  const supplier = suppliers.find((s) => s.id === product.proveedorId)
                  const isLowStock = product.cantidad <= product.cantidadMinima
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.nombre}</TableCell>
                      <TableCell>{product.categoria}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={product.cantidad}
                          onChange={(e) => handleUpdateStock(product.id, Number(e.target.value))}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>{product.cantidadMinima}</TableCell>
                      <TableCell>${product.precio.toString(2)}</TableCell>
                      <TableCell>
                        <Badge variant={isLowStock ? "destructive" : "secondary"}>
                          {isLowStock ? "Low Stock" : "In Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell>{supplier?.nombre}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
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
