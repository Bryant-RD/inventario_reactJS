import { Product } from "./products.interface"

export interface Supplier {
  id: number
  name: string
  contact: string
  phone?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export interface CreateSupplierData {
  name: string
  contact: string
  phone?: string
  address?: string
}

export type UpdateSupplierData = Partial<CreateSupplierData>

export interface SupplierResponse {
  success: boolean
  message: string
  supplier?: Supplier
  suppliers?: Supplier[]
}

export interface SupplierWithProducts {
  supplier: Supplier
  products: Product[]
  totalProducts: number
  totalValue: number
  lowStockProducts: number
}
