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

/**
 * Representa la estructura de un producto tal como viene de la API (backend).
 */
export interface ApiProduct {
  id: number
  nombre: string
  descripcion: string
  categoria: string
  cantidad: number
  cantidadMinima: number
  precio: string
  proveedorId: number
  fechaCreacion: string
  fechaActualizacion: string
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

export type UpdateProductData = Partial<CreateProductData>

export interface ProductResponse {
  success: boolean
  message: string
  product?: Product
  products?: Product[]
}