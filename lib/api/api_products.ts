import { CreateProductData, Product, ProductResponse, UpdateProductData } from "@/app/interfaces/products.interface"
import { ApiClient } from "./api_client"

export class ApiProductos {
  // Obtener todos los productos
  static async getAllProducts(token: string): Promise<ProductResponse> {
    const response = await ApiClient.get<Product[]>("/products", token)
    return { ...response, products: response.data }
  }

  // Obtener producto por ID
  static async getProductById(token: string, productId: number): Promise<ProductResponse> {
    const response = await ApiClient.get<Product>(`/products/${productId}`, token)
    return { ...response, product: response.data }
  }

  // Crear nuevo producto
  static async createProduct(token: string, productData: CreateProductData): Promise<ProductResponse> {
    const response = await ApiClient.post<Product>("/products", productData, token)
    return { ...response, product: response.data }
  }

  // Actualizar producto
  static async updateProduct(
    token: string,
    productId: number,
    productData: UpdateProductData,
  ): Promise<ProductResponse> {
    const response = await ApiClient.put<Product>(`/products/${productId}`, productData, token)
    return { ...response, product: response.data }
  }

  // Eliminar producto
  static async deleteProduct(token: string, productId: number): Promise<{ success: boolean; message: string }> {
    return ApiClient.delete(`/products/${productId}`, token)
  }

  // Obtener productos por proveedor
  static async getProductsBySupplier(token: string, supplierId: number): Promise<ProductResponse> {
    const response = await ApiClient.get<Product[]>(`/products/supplier/${supplierId}`, token)
    return { ...response, products: response.data }
  }

  // Actualizar stock de producto
  static async updateStock(
    token: string,
    productId: number,
    newStock: number,
  ): Promise<{ success: boolean; message: string; product?: Product }> {
    const response = await ApiClient.patch<Product>(`/products/${productId}/stock`, { stock: newStock }, token)
    return { ...response, product: response.data }
  }
}
