export interface Product {
  id: number
  name: string
  description: string
  category: string
  stock: number
  minStock: number
  price: number // Lo convertiremos de string a number en el repositorio
  supplierId: number
  createdAt: string
  updatedAt: string
}

export interface CreateProductData {
  nombre: string
  descripcion: string
  categoria: string
  cantidad: number
  cantidadMinima: number
  precio: number
  proveedorId: number
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface ProductResponse {
  success: boolean
  message: string
  product?: Product
  products?: Product[]
}