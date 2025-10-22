import { CreateProductData, Product, ProductResponse, UpdateProductData } from "@/app/interfaces/products.interface"
import { ApiProductos } from "../api/api_products"
import { UserRepository } from "./user_repository"

/**
 * Repositorio para manejar la lógica de negocio de los productos.
 * Actúa como intermediario entre la UI y la capa de API,
 * gestionando la obtención del token de autenticación.
 */
export class ProductRepository {
  /**
   * Obtiene el token de autenticación. Si no existe, devuelve una respuesta de error.
   * @returns El token o un objeto de error.
   */
  private static getTokenOrError() {
    const token = UserRepository.getToken()
    if (!token) {
      return { error: { success: false, message: "No se encontró el token de autenticación." } }
    }
    return { token }
  }

  /**
   * Mapea los datos de un producto de la API a la interfaz del frontend.
   * @param apiProduct - El objeto de producto tal como viene de la API.
   * @returns Un objeto `Product` con los nombres de propiedad del frontend.
   */
  private static mapApiProductToProduct(apiProduct: any): Product {
    return {
      id: apiProduct.id,
      name: apiProduct.nombre,
      description: apiProduct.descripcion,
      category: apiProduct.categoria,
      stock: apiProduct.cantidad,
      minStock: apiProduct.cantidadMinima,
      price: parseFloat(apiProduct.precio) || 0, // Convertimos el string a número
      supplierId: apiProduct.proveedorId,
      createdAt: apiProduct.fechaCreacion,
      updatedAt: apiProduct.fechaActualizacion,
    }
  }

  /**
   * Obtiene todos los productos.
   */
  static async getAllProducts(): Promise<ProductResponse> {
    const { token, error } = this.getTokenOrError()
    if (error) return error
    const apiResult = await ApiProductos.getAllProducts(token!)

    if (apiResult.success && apiResult.products) {
      apiResult.products = apiResult.products.map(this.mapApiProductToProduct)
    }

    return apiResult
  }

  /**
   * Obtiene un producto por su ID.
   * @param productId - El ID del producto.
   */
  static async getProductById(productId: number) : Promise<ProductResponse> {
    const { token, error } = this.getTokenOrError()
    if (error) return error
    return await ApiProductos.getProductById(token!, productId)
  }

  /**
   * Crea un nuevo producto.
   * @param productData - Los datos del producto a crear.
   */
  static async createProduct(productData: CreateProductData): Promise<ProductResponse> {
    const { token, error } = this.getTokenOrError()
    if (error) return error
    return ApiProductos.createProduct(token!, productData)
  }

  /**
   * Actualiza un producto existente.
   * @param productId - El ID del producto a actualizar.
   * @param productData - Los nuevos datos del producto.
   */
  static async updateProduct(productId: number, productData: UpdateProductData) : Promise<ProductResponse> {
    const { token, error } = this.getTokenOrError()
    if (error) return error
    return ApiProductos.updateProduct(token!, productId, productData)
  }

  /**
   * Elimina un producto.
   * @param productId - El ID del producto a eliminar.
   */
  static async deleteProduct(productId: number) {
    const { token, error } = this.getTokenOrError()
    if (error) return error
    return ApiProductos.deleteProduct(token!, productId)
  }
}