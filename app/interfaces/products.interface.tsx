export interface Product {
  id: number
  name: string
  category: string
  stock: number
  minStock: number
  price: number
  supplierId: number
  createdAt: string
  updatedAt: string
}

export interface CreateProductData {
  name: string
  category: string
  stock: number
  minStock: number
  price: number
  supplierId: number
}

export type UpdateProductData = Partial<CreateProductData>

export interface ProductResponse {
  success: boolean
  message: string
  product?: Product
  products?: Product[]
}