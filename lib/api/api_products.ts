import { CreateProductData, Product, ProductResponse, UpdateProductData } from "@/app/interfaces/products.interface"

const API_BASE_URL = "http://localhost:4000"

export class ApiProductos {
  // Obtener todos los productos
  static async getAllProducts(token: string): Promise<ProductResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Error obteniendo productos",
        }
      }

      return {
        success: true,
        products: data,
        message: "Productos obtenidos exitosamente",
      }
    } catch (error) {
      console.error("Error obteniendo productos:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }

  // Obtener producto por ID
  static async getProductById(token: string, productId: number): Promise<ProductResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Error obteniendo producto",
        }
      }

      return {
        success: true,
        product: data,
        message: "Producto obtenido exitosamente",
      }
    } catch (error) {
      console.error("Error obteniendo producto:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }

  // Crear nuevo producto
  static async createProduct(token: string, productData: CreateProductData): Promise<ProductResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Error creando producto",
        }
      }

      return {
        success: true,
        product: data,
        message: "Producto creado exitosamente",
      }
    } catch (error) {
      console.error("Error creando producto:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }

  // Actualizar producto
  static async updateProduct(
    token: string,
    productId: number,
    productData: UpdateProductData,
  ): Promise<ProductResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Error actualizando producto",
        }
      }

      return {
        success: true,
        product: data,
        message: "Producto actualizado exitosamente",
      }
    } catch (error) {
      console.error("Error actualizando producto:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }

  // Eliminar producto
  static async deleteProduct(token: string, productId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Error eliminando producto",
        }
      }

      return {
        success: true,
        message: "Producto eliminado exitosamente",
      }
    } catch (error) {
      console.error("Error eliminando producto:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }

  // Obtener productos por proveedor
  static async getProductsBySupplier(token: string, supplierId: number): Promise<ProductResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/supplier/${supplierId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Error obteniendo productos del proveedor",
        }
      }

      return {
        success: true,
        products: data,
        message: "Productos del proveedor obtenidos exitosamente",
      }
    } catch (error) {
      console.error("Error obteniendo productos del proveedor:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }

  // Actualizar stock de producto
  static async updateStock(
    token: string,
    productId: number,
    newStock: number,
  ): Promise<{ success: boolean; message: string; product?: Product }> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/stock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stock: newStock }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Error actualizando stock",
        }
      }

      return {
        success: true,
        product: data,
        message: "Stock actualizado exitosamente",
      }
    } catch (error) {
      console.error("Error actualizando stock:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }
}
