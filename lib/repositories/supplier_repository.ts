import type { Supplier, SupplierResponse } from "@/app/interfaces/suppliers.interface"
import { ApiSuppliers } from "../api/api_suppliers"
import { UserRepository } from "./user_repository"

/**
 * Repositorio para manejar la lógica de negocio de los proveedores.
 */
export class SupplierRepository {
  /**
   * Obtiene el token de autenticación. Si no existe, devuelve una respuesta de error.
   */
  private static getTokenOrError() {
    const token = UserRepository.getToken()
    if (!token) {
      return { error: { success: false, message: "No se encontró el token de autenticación." } }
    }
    return { token }
  }

  /**
   * Mapea los datos de un proveedor de la API a la interfaz del frontend.
   * @param apiSupplier - El objeto de proveedor tal como viene de la API.
   */
  private static mapApiSupplierToSupplier(apiSupplier: any): Supplier {
    return {
      id: apiSupplier.id,
      name: apiSupplier.nombre,
      contact: apiSupplier.nombreContacto,
      phone: apiSupplier.telefono,
      email: apiSupplier.email,
      address: apiSupplier.direccion,
      createdAt: apiSupplier.fechaCreacion,
      updatedAt: apiSupplier.fechaActualizacion,
    }
  }

  /**
   * Obtiene todos los proveedores y los mapea al formato del frontend.
   */
  static async getAllSuppliers(): Promise<SupplierResponse> {
    const { token, error } = this.getTokenOrError()
    if (error) return error

    const apiResult = await ApiSuppliers.getAllSuppliers(token!)

    if (apiResult.success && apiResult.suppliers) {
      apiResult.suppliers = apiResult.suppliers.map(this.mapApiSupplierToSupplier)
    }

    return apiResult
  }
}

