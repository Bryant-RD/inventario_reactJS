"use client"

import { useState } from "react"
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

// Mock data
const initialProducts = [
  { id: 1, name: "Wireless Headphones", stock: 5, minStock: 10, price: 99.99, supplierId: 1, category: "Electronics" },
  { id: 2, name: "Smartphone Case", stock: 25, minStock: 15, price: 19.99, supplierId: 2, category: "Accessories" },
  { id: 3, name: "USB Cable", stock: 3, minStock: 20, price: 12.99, supplierId: 1, category: "Cables" },
  { id: 4, name: "Bluetooth Speaker", stock: 8, minStock: 12, price: 79.99, supplierId: 3, category: "Electronics" },
  { id: 5, name: "Power Bank", stock: 15, minStock: 8, price: 39.99, supplierId: 2, category: "Electronics" },
]

const suppliers = [
  { id: 1, name: "TechCorp Solutions" },
  { id: 2, name: "Global Electronics" },
  { id: 3, name: "Audio Specialists" },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    stock: "",
    minStock: "",
    price: "",
    supplierId: "",
    category: "",
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.stock && newProduct.price) {
      const product = {
        id: Date.now(),
        name: newProduct.name,
        stock: Number.parseInt(newProduct.stock),
        minStock: Number.parseInt(newProduct.minStock) || 5,
        price: Number.parseFloat(newProduct.price),
        supplierId: Number.parseInt(newProduct.supplierId) || 1,
        category: newProduct.category || "General",
      }
      setProducts([...products, product])
      setNewProduct({ name: "", stock: "", minStock: "", price: "", supplierId: "", category: "" })
      setIsAddDialogOpen(false)
    }
  }

  const handleUpdateStock = (productId : number, newStock: number) => {
    setProducts(
      products.map((product) =>
        product.id === productId ? { ...product, stock: Number.parseInt(newStock.toString()) } : product,
      ),
    )
  }

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter((product) => product.id !== productId))
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setNewProduct({
      name: product.name,
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      price: product.price.toString(),
      supplierId: product.supplierId.toString(),
      category: product.category,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateProduct = () => {
    if (editingProduct && newProduct.name && newProduct.stock && newProduct.price) {
      const updatedProduct = {
        ...editingProduct,
        name: newProduct.name,
        stock: Number.parseInt(newProduct.stock),
        minStock: Number.parseInt(newProduct.minStock) || 5,
        price: Number.parseFloat(newProduct.price),
        supplierId: Number.parseInt(newProduct.supplierId) || 1,
        category: newProduct.category || "General",
      }
      setProducts(products.map((p) => (p.id === editingProduct.id ? updatedProduct : p)))
      setNewProduct({ name: "", stock: "", minStock: "", price: "", supplierId: "", category: "" })
      setEditingProduct(null)
      setIsEditDialogOpen(false)
    }
  }

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
                          {supplier.name}
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
                          onChange={(e) => handleUpdateStock(product.id, Number(e.target.value))}
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
