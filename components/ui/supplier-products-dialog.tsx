"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Supplier } from "@/app/interfaces/suppliers.interface"
import { Product } from "@/app/interfaces/products.interface"

interface SupplierProductsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  supplier: Supplier | null
  products: Product[]
}

export function SupplierProductsDialog({ isOpen, onOpenChange, supplier, products }: SupplierProductsDialogProps) {
  const supplierProducts = products.filter((product) => product.supplierId === supplier?.id)
  const totalValue = supplierProducts.reduce((sum, product) => sum + product.stock * product.price, 0)
  const totalStock = supplierProducts.reduce((sum, product) => sum + product.stock, 0)
  const lowStockProducts = supplierProducts.filter((product) => product.stock <= product.minStock)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{supplier?.name} - Products</DialogTitle>
          <DialogDescription>All products supplied by {supplier?.name}</DialogDescription>
        </DialogHeader>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{supplierProducts.length}</div>
              <p className="text-xs text-muted-foreground">{totalStock} total units</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Inventory value</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</div>
              <p className="text-xs text-muted-foreground">Need restocking</p>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        {supplierProducts.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierProducts.map((product) => {
                  const isLowStock = product.stock <= product.minStock
                  const productValue = product.stock * product.price
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.minStock}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>${productValue.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={isLowStock ? "destructive" : "secondary"}>
                          {isLowStock ? "Low Stock" : "In Stock"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No products found for this supplier.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
