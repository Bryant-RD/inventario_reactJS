import { CreateSupplierData, SupplierResponse, SupplierWithProducts, UpdateSupplierData } from "@/app/interfaces/suppliers.interface"

const API_BASE_URL = "http://localhost:4000"

export class ApiProveedores {
  // Obtener todos los proveedores
  static async getAllSuppliers(token: string): Promise<SupplierResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers`, {
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
          message: data.message || "Error obteniendo proveedores",
        }
      }

      return {
        success: true,
        suppliers: data,
        message: "Proveedores obtenidos exitosamente",
      }
    } catch (error) {
      console.error("Error obteniendo proveedores:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }

  // Obtener proveedor por ID
  static async getSupplierById(token: string, supplierId: number): Promise<SupplierResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}`, {
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
          message: data.message || "Error obteniendo proveedor",
        }
      }

      return {
        success: true,
        supplier: data,
        message: "Proveedor obtenido exitosamente",
      }
    } catch (error) {
      console.error("Error obteniendo proveedor:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }

  // Crear nuevo proveedor
  static async createSupplier(token: string, supplierData: CreateSupplierData): Promise<SupplierResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(supplierData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Error creando proveedor",
        }
      }

      return {
        success: true,
        supplier: data,
        message: "Proveedor creado exitosamente",
      }
    } catch (error) {
      console.error("Error creando proveedor:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }

  // Actualizar proveedor
  static async updateSupplier(
    token: string,
    supplierId: number,
    supplierData: UpdateSupplierData,
  ): Promise<SupplierResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(supplierData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Error actualizando proveedor",
        }
      }

      return {
        success: true,
        supplier: data,
        message: "Proveedor actualizado exitosamente",
      }
    } catch (error) {
      console.error("Error actualizando proveedor:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }

  // Eliminar proveedor
  static async deleteSupplier(token: string, supplierId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}`, {
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
          message: data.message || "Error eliminando proveedor",
        }
      }

      return {
        success: true,
        message: "Proveedor eliminado exitosamente",
      }
    } catch (error) {
      console.error("Error eliminando proveedor:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }

  // Obtener proveedor con sus productos
  static async getSupplierWithProducts(
    token: string,
    supplierId: number,
  ): Promise<{ success: boolean; data?: SupplierWithProducts; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}/products`, {
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
          message: data.message || "Error obteniendo proveedor con productos",
        }
      }

      return {
        success: true,
        data: data,
        message: "Proveedor con productos obtenido exitosamente",
      }
    } catch (error) {
      console.error("Error obteniendo proveedor con productos:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
      }
    }
  }
}
