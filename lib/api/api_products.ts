import { CreateProductData, Product, ProductResponse, UpdateProductData } from "@/app/interfaces/products.interface"
import { ApiClient } from "./api_client"

export class ApiProductos {
  // Obtener todos los productos
  static async getAllProducts(token: string): Promise<ProductResponse> {
    const response = await ApiClient.get<Product[]>("/productos", token)
    
    
    // console.log(JSON.stringify(response));
    
    return {
      success: response.success,
      message: response.message,
      products: response.data
    }
  }

  // Obtener producto por ID
  static async getProductById(token: string, productId: number): Promise<ProductResponse> {
    const response = await ApiClient.get<Product>(`/productos/${productId}`, token)
    return { ...response, product: response.data }
  }

  // Crear nuevo producto
  static async createProduct(token: string, productData: CreateProductData): Promise<ProductResponse> {
    const response = await ApiClient.post<Product>("/productos", productData, token)
    return { ...response, product: response.data }
  }

  // Actualizar producto
  static async updateProduct(
    token: string,
    productId: number,
    productData: UpdateProductData,
  ): Promise<ProductResponse> {
    const response = await ApiClient.patch<Product>(`/productos/${productId}`, productData, token)
    return { ...response, product: response.data }
  }

  // Eliminar producto
  static async deleteProduct(token: string, productId: number): Promise<{ success: boolean; message: string }> {
    return ApiClient.delete(`/productos/${productId}`, token)
  }

  // Obtener productos por proveedor
  static async getProductsBySupplier(token: string, supplierId: number): Promise<ProductResponse> {
    const response = await ApiClient.get<Product[]>(`/productos/supplier/${supplierId}`, token)
    return { ...response, products: response.data }
  }

  // Actualizar stock de producto
  static async updateStock(
    token: string,
    productId: number,
    newStock: number,
  ): Promise<{ success: boolean; message: string; product?: Product }> {
    const response = await ApiClient.patch<Product>(`/productos/${productId}/stock`, { stock: newStock }, token)
    return { ...response, product: response.data }
  }
}
