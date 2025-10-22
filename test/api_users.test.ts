import { ApiUsuarios } from "../lib/api/api_users"
import { ApiClient } from "../lib/api/api_client"
import { User, CreateUserDTO } from "@/app/interfaces/user.interface"

// Mock del ApiClient
jest.mock("../lib/api/api_client")
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

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("login", () => {
    it("debería llamar a ApiClient.post con las credenciales correctas y devolver la respuesta formateada", async () => {
      const credentials = { email: "test@example.com", password: "password123" }
      const mockApiResponse = {
        success: true,
        message: "Login exitoso",
        data: { access_token: mockToken },
      }

      mockedApiClient.post.mockResolvedValue(mockApiResponse)

      const result = await ApiUsuarios.login(credentials)

      expect(mockedApiClient.post).toHaveBeenCalledWith("/auth/login", credentials)
      expect(result).toEqual({
        success: true,
        message: "Login exitoso",
        access_token: mockToken,
      })
    })
  })

  describe("register", () => {
    it("debería llamar a ApiClient.post con los datos de registro y devolver la respuesta formateada", async () => {
      const registerData: CreateUserDTO = {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        password: "password123",
        company: "Test Corp",
      }

      const mockApiResponse = {
        success: true,
        message: "Registro exitoso",
        data: { access_token: "" },
      }

      mockedApiClient.post.mockResolvedValue(mockApiResponse)

      const result = await ApiUsuarios.register(registerData)

      expect(mockedApiClient.post).toHaveBeenCalledWith("/auth/register", registerData)
      expect(result).toEqual({
        success: true,
        message: "Registro exitoso",
        access_token: "",
      })
    })
  })

  describe("getProfile", () => {
    it("debería llamar a ApiClient.get con el token y devolver el perfil correctamente", async () => {
      const mockApiResponse = {
        success: true,
        message: "Perfil obtenido",
        data: mockUser,
      }

      mockedApiClient.get.mockResolvedValue(mockApiResponse)

      const result = await ApiUsuarios.getProfile(mockToken)

      expect(mockedApiClient.get).toHaveBeenCalledWith("/auth/profile", mockToken)
      expect(result).toEqual({
        success: true,
        message: "Perfil obtenido",
        user: mockUser,
        data: mockUser, // se conserva porque el método usa spread {...response}
      })
    })
  })

  describe("updateProfile", () => {
    it("debería llamar a ApiClient.patch con los datos y el token, devolviendo el usuario actualizado", async () => {
      const updateData = { firstName: "Johnny" }
      const updatedUser = { ...mockUser, ...updateData }
      const mockApiResponse = {
        success: true,
        message: "Perfil actualizado",
        data: updatedUser,
      }

      mockedApiClient.patch.mockResolvedValue(mockApiResponse)

      const result = await ApiUsuarios.updateProfile(mockToken, updateData)

      expect(mockedApiClient.patch).toHaveBeenCalledWith("/auth/profile", updateData, mockToken)
      expect(result).toEqual({
        success: true,
        message: "Perfil actualizado",
        user: updatedUser,
        data: updatedUser,
      })
    })
  })

  describe("getAllUsers", () => {
    it("debería llamar a ApiClient.get y devolver la lista de usuarios", async () => {
      const mockUsers = [mockUser, { ...mockUser, id: 2, email: "jane.doe@example.com" }]
      const mockApiResponse = {
        success: true,
        message: "Usuarios obtenidos",
        data: mockUsers,
      }

      mockedApiClient.get.mockResolvedValue(mockApiResponse)

      const result = await ApiUsuarios.getAllUsers(mockToken)

      expect(mockedApiClient.get).toHaveBeenCalledWith("/users", mockToken)
      expect(result).toEqual({
        success: true,
        message: "Usuarios obtenidos",
        data: mockUsers,
        users: mockUsers,
      })
    })
  })

  describe("deleteUser", () => {
    it("debería llamar a ApiClient.delete con el ID y token correctos", async () => {
      const userId = 1
      const mockResponse = { success: true, message: "Usuario eliminado" }

      mockedApiClient.delete.mockResolvedValue(mockResponse)

      const result = await ApiUsuarios.deleteUser(mockToken, userId)

      expect(mockedApiClient.delete).toHaveBeenCalledWith(`/users/${userId}`, mockToken)
      expect(result).toEqual(mockResponse)
    })
  })
})
