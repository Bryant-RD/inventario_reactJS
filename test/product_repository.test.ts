import { ProductRepository } from "@/lib/repositories/product_repository"
import { ApiProductos } from "@/lib/api/api_products"
import { UserRepository } from "@/lib/repositories/user_repository"
import { Product, CreateProductData, UpdateProductData } from "@/app/interfaces/products.interface"

// Mockear dependencias
jest.mock("@/lib/api/api_products")
jest.mock("@/lib/repositories/user_repository")

describe("ProductRepository", () => {
  const mockToken = "test-token"
  const mockProductApi = {
    id: 1,
    nombre: "Shampoo",
    descripcion: "Producto para el cabello",
    categoria: "Cuidado personal",
    cantidad: 10,
    cantidadMinima: 2,
    precio: "120.5",
    proveedorId: 3,
    fechaCreacion: "2025-10-21",
    fechaActualizacion: "2025-10-21",
  }

  const mockProduct: Product = {
    id: 1,
    name: "Shampoo",
    description: "Producto para el cabello",
    category: "Cuidado personal",
    stock: 10,
    minStock: 2,
    price: 120.5,
    supplierId: 3,
    createdAt: "2025-10-21",
    updatedAt: "2025-10-21",
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ============================================================
  // GET ALL PRODUCTS
  // ============================================================
  describe("getAllProducts", () => {
    it("debería devolver la lista de productos mapeados correctamente", async () => {
      ;(UserRepository.getToken as jest.Mock).mockReturnValue(mockToken)
      ;(ApiProductos.getAllProducts as jest.Mock).mockResolvedValue({
        success: true,
        message: "Productos obtenidos correctamente",
        products: [mockProductApi],
      })

      const result = await ProductRepository.getAllProducts()

      expect(result.success).toBe(true)
      expect(result.products?.[0]).toEqual(mockProduct)
      expect(ApiProductos.getAllProducts).toHaveBeenCalledWith(mockToken)
    })

    it("debería devolver error si no hay token", async () => {
      ;(UserRepository.getToken as jest.Mock).mockReturnValue(null)

      const result = await ProductRepository.getAllProducts()
      expect(result.success).toBe(false)
      expect(result.message).toBe("No se encontró el token de autenticación.")
    })
  })

  // ============================================================
  // GET PRODUCT BY ID
  // ============================================================
  describe("getProductById", () => {
    it("debería obtener un producto por su ID", async () => {
      ;(UserRepository.getToken as jest.Mock).mockReturnValue(mockToken)
      ;(ApiProductos.getProductById as jest.Mock).mockResolvedValue({
        success: true,
        product: mockProduct,
      })

      const result = await ProductRepository.getProductById(1)
      expect(result.success).toBe(true)
      expect(result.product).toEqual(mockProduct)
      expect(ApiProductos.getProductById).toHaveBeenCalledWith(mockToken, 1)
    })

    it("debería devolver error si no hay token", async () => {
      ;(UserRepository.getToken as jest.Mock).mockReturnValue(null)
      const result = await ProductRepository.getProductById(1)
      expect(result.success).toBe(false)
      expect(result.message).toBe("No se encontró el token de autenticación.")
    })
  })

  // ============================================================
  // CREATE PRODUCT
  // ============================================================
  describe("createProduct", () => {
    const newProduct: CreateProductData = {
      nombre: "Acondicionador",
      descripcion: "Suaviza el cabello",
      categoria: "Cuidado personal",
      cantidad: 15,
      cantidadMinima: 3,
      precio: 150,
      proveedorId: 3,
    }

    it("debería crear un producto correctamente", async () => {
      ;(UserRepository.getToken as jest.Mock).mockReturnValue(mockToken)
      ;(ApiProductos.createProduct as jest.Mock).mockResolvedValue({
        success: true,
        message: "Producto creado exitosamente",
        product: mockProduct,
      })

      const result = await ProductRepository.createProduct(newProduct)
      expect(result.success).toBe(true)
      expect(result.product).toEqual(mockProduct)
      expect(ApiProductos.createProduct).toHaveBeenCalledWith(mockToken, newProduct)
    })

    it("debería devolver error si no hay token", async () => {
      ;(UserRepository.getToken as jest.Mock).mockReturnValue(null)
      const result = await ProductRepository.createProduct(newProduct)
      expect(result.success).toBe(false)
      expect(result.message).toBe("No se encontró el token de autenticación.")
    })
  })

  // ============================================================
  // UPDATE PRODUCT
  // ============================================================
  describe("updateProduct", () => {
    const updatedProduct: UpdateProductData = {
      nombre: "Shampoo Reparador",
      descripcion: "Repara el cabello dañado",
      categoria: "Cuidado personal",
      cantidad: 20,
      cantidadMinima: 5,
      precio: 180,
      proveedorId: 3,
    }

    it("debería actualizar un producto correctamente", async () => {
      ;(UserRepository.getToken as jest.Mock).mockReturnValue(mockToken)
      ;(ApiProductos.updateProduct as jest.Mock).mockResolvedValue({
        success: true,
        message: "Producto actualizado exitosamente",
        product: mockProduct,
      })

      const result = await ProductRepository.updateProduct(1, updatedProduct)
      expect(result.success).toBe(true)
      expect(result.product).toEqual(mockProduct)
      expect(ApiProductos.updateProduct).toHaveBeenCalledWith(mockToken, 1, updatedProduct)
    })

    it("debería devolver error si no hay token", async () => {
      ;(UserRepository.getToken as jest.Mock).mockReturnValue(null)
      const result = await ProductRepository.updateProduct(1, updatedProduct)
      expect(result.success).toBe(false)
      expect(result.message).toBe("No se encontró el token de autenticación.")
    })
  })

  // ============================================================
  // DELETE PRODUCT
  // ============================================================
  describe("deleteProduct", () => {
    it("debería eliminar un producto correctamente", async () => {
      ;(UserRepository.getToken as jest.Mock).mockReturnValue(mockToken)
      ;(ApiProductos.deleteProduct as jest.Mock).mockResolvedValue({
        success: true,
        message: "Producto eliminado exitosamente",
      })

      const result = await ProductRepository.deleteProduct(1)
      expect(result.success).toBe(true)
      expect(result.message).toBe("Producto eliminado exitosamente")
      expect(ApiProductos.deleteProduct).toHaveBeenCalledWith(mockToken, 1)
    })

    it("debería devolver error si no hay token", async () => {
      ;(UserRepository.getToken as jest.Mock).mockReturnValue(null)
      const result = await ProductRepository.deleteProduct(1)
      expect(result.success).toBe(false)
      expect(result.message).toBe("No se encontró el token de autenticación.")
    })
  })
})
