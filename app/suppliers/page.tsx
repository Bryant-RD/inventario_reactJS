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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, ArrowLeft, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { EditSupplierDialog } from "@/components/ui/edit-supplier-dialog"
import { Supplier, UpdateSupplierData } from "@/app/interfaces/suppliers.interface"
import { SupplierProductsDialog } from "@/components/ui/supplier-products-dialog"
import { Product } from "../interfaces/products.interface"

// Mock products data
const mockProducts: Product[] = [ // Add createdAt and updatedAt to mock products
  { id: 1, nombre: "Wireless Headphones", cantidad: 5, cantidadMinima: 10, precio: 99.99, proveedorId: 1, categoria: "Electronics", fechaCreacion: new Date().toISOString(), fechaActualizacion: new Date().toISOString() },
  { id: 2, nombre: "Smartphone Case", cantidad: 25, cantidadMinima: 15, precio: 19.99, proveedorId: 2, categoria: "Accessories", fechaCreacion: new Date().toISOString(), fechaActualizacion: new Date().toISOString() },
  { id: 3, nombre: "USB Cable", cantidad: 3, cantidadMinima: 20, precio: 12.99, proveedorId: 1, categoria: "Cables", fechaCreacion: new Date().toISOString(), fechaActualizacion: new Date().toISOString() },
  { id: 4, nombre: "Bluetooth Speaker", cantidad: 8, cantidadMinima: 12, precio: 79.99, proveedorId: 3, categoria: "Electronics", fechaCreacion: new Date().toISOString(), fechaActualizacion: new Date().toISOString() },
  { id: 5, nombre: "Power Bank", cantidad: 15, cantidadMinima: 8, precio: 39.99, proveedorId: 2, categoria: "Electronics", fechaCreacion: new Date().toISOString(), fechaActualizacion: new Date().toISOString() },
] as Product[]

// Mock data
const initialSuppliers = [
  {
    id: 1,
    name: "TechCorp Solutions",
    contact: "contact@techcorp.com", // This is email
    phone: "+1 (555) 123-4567", // This is phone
    address: "123 Tech Street, Silicon Valley, CA 94000", // This is address
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Global Electronics",
    contact: "sales@globalelec.com", // This is email
    phone: "+1 (555) 987-6543", // This is phone
    address: "456 Electronics Ave, Austin, TX 78701", // This is address
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Audio Specialists",
    contact: "info@audiospec.com", // This is email
    phone: "+1 (555) 456-7890", // This is phone
    address: "789 Sound Blvd, Nashville, TN 37201", // This is address
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSupplier, setNewSupplier] = useState<UpdateSupplierData>({
    name: "",
    contact: "",
    phone: "",
    address: "",
  })

  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false) // State for the edit dialog
  const [viewingSupplierProducts, setViewingSupplierProducts] = useState<Supplier | null>(null)
  const [isProductsDialogOpen, setIsProductsDialogOpen] = useState(false)

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSupplier = () => {
    if (newSupplier.name && newSupplier.contact) {
      const supplier = {
        id: Date.now(),
        name: newSupplier.name,
        contact: newSupplier.contact,
        phone: newSupplier.phone || "",
        address: newSupplier.address || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
 setSuppliers([...suppliers, supplier])
      setNewSupplier({ name: "", contact: "", phone: "", address: "" })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteSupplier = (supplierId: number) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== supplierId))
  }
  

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setNewSupplier({
      name: supplier.name,
      contact: supplier.contact,
      phone: supplier.phone,
      address: supplier.address,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateSupplier = () => {
    if (editingSupplier && newSupplier.name && newSupplier.contact) {
      const updatedSupplier = {
        ...editingSupplier,
        name: newSupplier.name,
        contact: newSupplier.contact,
        phone: newSupplier.phone || "",
        address: newSupplier.address || "",
        createdAt: editingSupplier.createdAt, // Keep original createdAt
        updatedAt: new Date().toISOString(), // Update updatedAt
      }
      setSuppliers(suppliers.map((s) => (s.id === editingSupplier.id ? updatedSupplier : s)))
      setNewSupplier({ name: "", contact: "", phone: "", address: "" })
      setEditingSupplier(null)
      setIsEditDialogOpen(false)
    }
  }

  const handleContactSupplier = (supplier: Supplier) => {
    const subject = encodeURIComponent(`Inquiry from ${supplier.name}`)
    const body = encodeURIComponent(`Hello ${supplier.name},\n\nI hope this message finds you well.\n\nBest regards`)
    window.open(`mailto:${supplier.contact}?subject=${subject}&body=${body}`)
  }

  const handleViewProducts = (supplier: Supplier) => {
    setViewingSupplierProducts(supplier)
    setIsProductsDialogOpen(true)
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
              <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
              <p className="text-muted-foreground">Manage your supplier relationships</p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
                <DialogDescription>Add a new supplier to your network</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Supplier Name</Label>
                  <Input
                    id="name"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                    placeholder="Enter supplier name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact">Email</Label>
                  <Input
                    id="contact"
                    type="email"
                    value={newSupplier.contact}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                    placeholder="supplier@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={newSupplier.address}
                    onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                    placeholder="Enter supplier address"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="cursor-pointer">
                  Cancel
                </Button>
                <Button onClick={handleAddSupplier} className="cursor-pointer">
                  Add Supplier
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
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>{" "}
                    <CardDescription>
                      <Badge variant="outline" className="mt-2"> {/* Calculate productsCount dynamically */}
                        {
                          mockProducts.filter((product) => product.proveedorId === supplier.id).length
                        }{" "}
                        products
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSupplier(supplier)}
                      className="cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSupplier(supplier.id)}
                      className="cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.contact}</span>
                </div>
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{supplier.phone}</span>
                  </div>
                )}
                {supplier.address && (
                  <div className="text-sm text-muted-foreground">
                    <p>{supplier.address}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent cursor-pointer"
                    onClick={() => handleContactSupplier(supplier)}
                  >
                    Contact
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent cursor-pointer"
                    onClick={() => handleViewProducts(supplier)}
                  >
                    View Products
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Suppliers Table (Alternative view) */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Directory</CardTitle>
            <CardDescription>{filteredSuppliers.length} suppliers found</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => {
                  return (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.contact}</TableCell>
                      <TableCell>{supplier.phone || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {mockProducts.filter((product) => product.proveedorId === supplier.id).length}{" "}
                          products
                        </Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditSupplier(supplier)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteSupplier(supplier.id)}>
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

      {/* Edit Supplier Dialog */}
      <EditSupplierDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        newSupplier={newSupplier}
        setNewSupplier={setNewSupplier}
        onUpdate={handleUpdateSupplier}
        onCancel={() => {
          setIsEditDialogOpen(false)
          setEditingSupplier(null)
          setNewSupplier({ name: "", contact: "", phone: "", address: "" })
        }}
      />

      {/* Supplier Products Dialog */}
      <SupplierProductsDialog
        isOpen={isProductsDialogOpen}
        onOpenChange={setIsProductsDialogOpen}
        supplier={viewingSupplierProducts}
        products={mockProducts}
      />
    </div>
  )
}
