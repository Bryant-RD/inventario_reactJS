"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Supplier, UpdateSupplierData } from "@/app/interfaces/suppliers.interface"

interface EditSupplierDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  newSupplier: UpdateSupplierData
  setNewSupplier: (supplier: UpdateSupplierData) => void
  onUpdate: () => void
  onCancel: () => void
}

export function EditSupplierDialog({
  isOpen,
  onOpenChange,
  newSupplier,
  setNewSupplier,
  onUpdate,
  onCancel,
}: EditSupplierDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Supplier</DialogTitle>
          <DialogDescription>Update supplier information</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Supplier Name</Label>
            <Input
              id="edit-name"
              value={newSupplier.name}
              onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
              placeholder="Enter supplier name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-contact">Email</Label>
            <Input
              id="edit-contact"
              type="email"
              value={newSupplier.contact}
              onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
              placeholder="supplier@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input
              id="edit-phone"
              value={newSupplier.phone}
              onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-address">Address</Label>
            <Textarea
              id="edit-address"
              value={newSupplier.address}
              onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
              placeholder="Enter supplier address"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} className="cursor-pointer bg-transparent">
            Cancel
          </Button>
          <Button onClick={onUpdate} className="cursor-pointer">
            Update Supplier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
