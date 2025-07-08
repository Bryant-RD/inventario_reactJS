import {
  CreateSupplierData,
  Supplier,
  SupplierResponse,
  SupplierWithProducts,
  UpdateSupplierData,
} from "@/app/interfaces/suppliers.interface"
import { ApiClient } from "./api_client"

export class ApiProveedores {
  // Obtener todos los proveedores
  static async getAllSuppliers(token: string): Promise<SupplierResponse> {
    const response = await ApiClient.get<Supplier[]>("/suplidores", token)

    return { ...response, suppliers: response.data }
  }

  // Obtener proveedor por ID
  static async getSupplierById(token: string, supplierId: number): Promise<SupplierResponse> {
    const response = await ApiClient.get<Supplier>(`/suplidores/${supplierId}`, token)
    return { ...response, supplier: response.data }
  }

  // Crear nuevo proveedor
  static async createSupplier(token: string, supplierData: CreateSupplierData): Promise<SupplierResponse> {
    const response = await ApiClient.post<Supplier>("/suplidores", supplierData, token)
    return { ...response, supplier: response.data }
  }

  // Actualizar proveedor
  static async updateSupplier(
    token: string,
    supplierId: number,
    supplierData: UpdateSupplierData,
  ): Promise<SupplierResponse> {
    const response = await ApiClient.put<Supplier>(`/suplidores/${supplierId}`, supplierData, token)
    return { ...response, supplier: response.data }
  }

  // Eliminar proveedor
  static async deleteSupplier(token: string, supplierId: number): Promise<{ success: boolean; message: string }> {
    return ApiClient.delete(`/suplidores/${supplierId}`, token)
  }

  // Obtener proveedor con sus productos
  static async getSupplierWithProducts(
    token: string,
    supplierId: number,
  ): Promise<{ success: boolean; data?: SupplierWithProducts; message: string }> {
    return ApiClient.get<SupplierWithProducts>(`/suplidores/${supplierId}/products`, token)
  }
}
