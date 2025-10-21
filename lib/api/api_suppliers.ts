import type { SupplierResponse } from "@/app/interfaces/suppliers.interface"
import { ApiClient } from "./api_client"

export class ApiSuppliers {
  /**
   * Obtiene todos los proveedores desde la API.
   * @param token - El token de autenticación.
   */
  static async getAllSuppliers(token: string): Promise<SupplierResponse> {
    const response = await ApiClient.get<any[]>("/suplidores", token)
    return {
      success: response.success,
      message: response.message,
      suppliers: response.data,
    }
  }
}