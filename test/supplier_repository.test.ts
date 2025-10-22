import { SupplierRepository } from "@/lib/repositories/supplier_repository"
import { ApiSuppliers } from "@/lib/api/api_suppliers"
import { UserRepository } from "@/lib/repositories"

jest.mock("@/lib/api/api_suppliers")

describe("SupplierRepository", () => {
  const mockToken = "test-token"
  const mockSuppliersFromApi = [
    {
      id: 1,
      nombre: "Proveedor A",
      nombreContacto: "Juan Pérez",
      telefono: "809-555-1234",
      email: "proveedora@example.com",
      direccion: "Calle Falsa 123",
      fechaCreacion: "2025-01-01",
      fechaActualizacion: "2025-01-05",
    },
  ]

  const mockMappedSuppliers = [
    {
      id: 1,
      name: "Proveedor A",
      contact: "Juan Pérez",
      phone: "809-555-1234",
      email: "proveedora@example.com",
      address: "Calle Falsa 123",
      createdAt: "2025-01-01",
      updatedAt: "2025-01-05",
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    // Mockear solo UserRepository.getToken
    ;(UserRepository.getToken as jest.Mock) = jest.fn()
  })

  describe("getAllSuppliers", () => {
    it("debería devolver error si no hay token", async () => {
      ;(UserRepository.getToken as jest.Mock).mockReturnValue(null)

      const result = await SupplierRepository.getAllSuppliers()

      expect(result.success).toBe(false)
      expect(result.message).toBe("No se encontró el token de autenticación.")
      expect(ApiSuppliers.getAllSuppliers).not.toHaveBeenCalled()
    })

    it("debería obtener y mapear los proveedores correctamente", async () => {
      ;(UserRepository.getToken as jest.Mock).mockReturnValue(mockToken)
      ;(ApiSuppliers.getAllSuppliers as jest.Mock).mockResolvedValue({
        success: true,
        message: "Proveedores obtenidos correctamente",
        suppliers: mockSuppliersFromApi,
      })

      const result = await SupplierRepository.getAllSuppliers()

      expect(UserRepository.getToken).toHaveBeenCalled()
      expect(ApiSuppliers.getAllSuppliers).toHaveBeenCalledWith(mockToken)
      expect(result.success).toBe(true)
      expect(result.suppliers).toEqual(mockMappedSuppliers)
    })

    it("debería devolver error si la API falla", async () => {
      ;(UserRepository.getToken as jest.Mock).mockReturnValue(mockToken)
      ;(ApiSuppliers.getAllSuppliers as jest.Mock).mockResolvedValue({
        success: false,
        message: "Error del servidor",
        suppliers: [],
      })

      const result = await SupplierRepository.getAllSuppliers()

      expect(result.success).toBe(false)
      expect(result.message).toBe("Error del servidor")
      expect(result.suppliers).toEqual([])
    })
  })
})
