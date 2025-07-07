import { ApiUsuarios } from "../lib/api/api_users"
import { ApiClient } from "../lib/api/api_client"
import { User, CreateUserDTO } from "@/app/interfaces/user.interface"

// Mockear el ApiClient para evitar llamadas de red reales
jest.mock("../lib/api/api_client")

// Castear el mock para tener tipado y autocompletado
const mockedApiClient = ApiClient as jest.Mocked<typeof ApiClient>

describe("ApiUsuarios", () => {
  const mockUser: User = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    company: "Test Inc.",
    role: "user",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const mockToken = "test-token"

  // Limpiar los mocks después de cada prueba para asegurar que los tests son independientes
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("login", () => {
    it("debería llamar a ApiClient.post con las credenciales correctas y devolver la respuesta", async () => {
      const credentials = { email: "test@example.com", password: "password123" }
      const mockResponse = { success: true, user: mockUser, token: mockToken, message: "Login exitoso" }

      mockedApiClient.post.mockResolvedValue(mockResponse)

      const result = await ApiUsuarios.login(credentials)

      expect(mockedApiClient.post).toHaveBeenCalledWith("/auth/login", credentials)
      expect(result).toEqual(mockResponse)
    })
  })

  describe("register", () => {
    it("debería llamar a ApiClient.post con los datos de registro y devolver la respuesta", async () => {
      const registerData: CreateUserDTO = {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        password: "password123",
        company: "Test Corp",
      }
      const mockResponse = { success: true, message: "Registro exitoso" }

      mockedApiClient.post.mockResolvedValue(mockResponse)

      const result = await ApiUsuarios.register(registerData)

      expect(mockedApiClient.post).toHaveBeenCalledWith("/auth/register", registerData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe("getProfile", () => {
    it("debería llamar a ApiClient.get con el token y formatear la respuesta", async () => {
      const mockApiResponse = { success: true, data: mockUser, message: "Perfil obtenido" }
      mockedApiClient.get.mockResolvedValue(mockApiResponse)

      const result = await ApiUsuarios.getProfile(mockToken)

      expect(mockedApiClient.get).toHaveBeenCalledWith("/auth/profile", mockToken)
      expect(result).toEqual({
        ...mockApiResponse,
        user: mockUser,
      })
    })
  })

  describe("updateProfile", () => {
    it("debería llamar a ApiClient.patch con el token y los datos a actualizar", async () => {
      const updateData = { firstName: "Johnny" }
      const updatedUser = { ...mockUser, ...updateData }
      const mockApiResponse = { success: true, data: updatedUser, message: "Perfil actualizado" }

      mockedApiClient.patch.mockResolvedValue(mockApiResponse)

      const result = await ApiUsuarios.updateProfile(mockToken, updateData)

      expect(mockedApiClient.patch).toHaveBeenCalledWith("/auth/profile", updateData, mockToken)
      expect(result).toEqual({
        ...mockApiResponse,
        user: updatedUser,
      })
    })
  })

  describe("getAllUsers", () => {
    it("debería llamar a ApiClient.get y devolver una lista de usuarios", async () => {
      const mockUsers = [mockUser, { ...mockUser, id: 2, email: "jane.doe@example.com" }]
      const mockApiResponse = { success: true, data: mockUsers, message: "Usuarios obtenidos" }

      mockedApiClient.get.mockResolvedValue(mockApiResponse)

      const result = await ApiUsuarios.getAllUsers(mockToken)

      expect(mockedApiClient.get).toHaveBeenCalledWith("/users", mockToken)
      expect(result).toEqual({
        ...mockApiResponse,
        users: mockUsers,
      })
    })
  })

  describe("deleteUser", () => {
    it("debería llamar a ApiClient.delete con el ID de usuario y el token", async () => {
      const userId = 1
      const mockResponse = { success: true, message: "Usuario eliminado" }

      mockedApiClient.delete.mockResolvedValue(mockResponse)

      const result = await ApiUsuarios.deleteUser(mockToken, userId)

      expect(mockedApiClient.delete).toHaveBeenCalledWith(`/users/${userId}`, mockToken)
      expect(result).toEqual(mockResponse)
    })
  })
})