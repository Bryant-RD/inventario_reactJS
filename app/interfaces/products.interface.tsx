export interface Product {
  
  id: number
  nombre: string
  categoria: string
  cantidad: number
  cantidadMinima: number
  precio: number
  proveedorId: number
  fechaCreacion: string
  fechaActualizacion: string
}

export interface CreateProductData {
  nombre: string
  descripcion: string
  categoria: string
  precio: number
  cantidad: number
  cantidadMinima: number
  proveedorId: number
}

export type UpdateProductData = Partial<CreateProductData>

export interface ProductResponse {
  success: boolean
  message: string
  product?: Product
  products?: Product[]
}