import { CreateProductData, Product, ProductResponse, UpdateProductData } from "@/app/interfaces/products.interface"
import { ApiClient } from "./api_client"

export class ApiProductos {
  static readonly path = "/productos";
  // Obtener todos los productos
  static async getAllProducts(token: string): Promise<ProductResponse> {
    const response = await ApiClient.get<Product[]>(this.path, token)
      
    return { ...response, products: response.data }
  }

  // Obtener producto por ID
  static async getProductById(token: string, productId: number): Promise<ProductResponse> {
    const response = await ApiClient.get<Product>(`${this.path}${productId}`, token)
    return { ...response, product: response.data }
  }

  // Crear nuevo producto
  static async createProduct(token: string, productData: CreateProductData): Promise<ProductResponse> {
    const response = await ApiClient.post<Product>(this.path, productData, token)
    console.log("crear producto: " + response);

    return { ...response, product: response.data }
  }

  // Actualizar producto
  static async updateProduct(
    token: string,
    productId: number,
    productData: UpdateProductData,
  ): Promise<ProductResponse> {
    const response = await ApiClient.patch<Product>(`${this.path}/${productId}`, productData, token)
    return { ...response, product: response.data }
  }

  // Eliminar producto
  static async deleteProduct(token: string, productId: number): Promise<{ success: boolean; message: string }> {
    return ApiClient.delete(`${this.path}/${productId}`, token)
  }

  // Obtener productos por proveedor
  // static async getProductsBySupplier(token: string, supplierId: number): Promise<ProductResponse> {
  //   const response = await ApiClient.get<Product[]>(`/products/supplier/${supplierId}`, token)
  //   return { ...response, products: response.data }
  // }

  // Actualizar stock de producto
  static async updateStock(
    token: string,
    productId: number,
    newStock: number,
  ): Promise<{ success: boolean; message: string; product?: Product }> {
    const response = await ApiClient.patch<Product>(`${this.path}/${productId}/stock`, { stock: newStock }, token)
    return { ...response, product: response.data }
  }
}
