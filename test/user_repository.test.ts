import { UserRepository } from "@/lib/repositories"
import { ApiUsuarios } from "@/lib/api"
import { User } from "@/app/interfaces/user.interface"

// Mockear el módulo de la API para no hacer llamadas reales durante las pruebas
jest.mock("@/lib/api")

// Mockear localStorage, ya que no existe en el entorno de prueba de Node.js
const localStorageMock = (() => {
  let store: { [key: string]: string } = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

describe("UserRepository", () => {
  const mockUser: User = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    company: "Test Inc.",
    role: "user",
    createdAt: "",
    updatedAt: ""
  }
  const mockToken = "test-token"

  beforeEach(() => {
    // Limpiar mocks y localStorage antes de cada prueba para asegurar que los tests son independientes
    jest.clearAllMocks()
    window.localStorage.clear()
  })

  describe("register", () => {
    it("debería devolver éxito en un registro correcto", async () => {
      ;(ApiUsuarios.register as jest.Mock).mockResolvedValue({
        success: true,
        message: "Registro exitoso.",
      })

      const result = await UserRepository.register({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        company: "Test Inc.",
      })

      expect(result.success).toBe(true)
      expect(result.message).toBe("Registro exitoso.")
      expect(ApiUsuarios.register).toHaveBeenCalledTimes(1)
    })

    it("debería devolver error en un registro fallido", async () => {
      ;(ApiUsuarios.register as jest.Mock).mockResolvedValue({
        success: false,
        message: "El email ya está en uso.",
      })

      const result = await UserRepository.register({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        company: "Test Inc.",
      })

      expect(result.success).toBe(false)
      expect(result.message).toBe("El email ya está en uso.")
    })
  })

  describe("login", () => {
    it("debería guardar la sesión y devolver éxito en un login correcto", async () => {
      ;(ApiUsuarios.login as jest.Mock).mockResolvedValue({
        success: true,
        user: mockUser,
        token: mockToken,
      })

      const setItemSpy = jest.spyOn(window.localStorage, "setItem")

      const result = await UserRepository.login({
        email: "john.doe@example.com",
        password: "password123",
      })

      expect(result.success).toBe(true)
      expect(result.message).toBe("Login exitoso")
      expect(setItemSpy).toHaveBeenCalledWith("inventory_user", JSON.stringify(mockUser))
      expect(setItemSpy).toHaveBeenCalledWith("inventory_token", mockToken)
    })

    it("debería devolver error si el login de la API falla", async () => {
      ;(ApiUsuarios.login as jest.Mock).mockResolvedValue({
        success: false,
        message: "Credenciales incorrectas.",
      })

      const setItemSpy = jest.spyOn(window.localStorage, "setItem")

      const result = await UserRepository.login({
        email: "john.doe@example.com",
        password: "wrong-password",
      })

      expect(result.success).toBe(false)
      expect(result.message).toBe("Credenciales incorrectas.")
      expect(setItemSpy).not.toHaveBeenCalled()
    })
  })

  describe("Gestión de Sesión (localStorage)", () => {
    it("getUser debería devolver el usuario parseado desde localStorage", () => {
      window.localStorage.setItem("inventory_user", JSON.stringify(mockUser))
      const user = UserRepository.getUser()
      expect(user).toEqual(mockUser)
    })

    it("getToken debería devolver el token desde localStorage", () => {
      window.localStorage.setItem("inventory_token", mockToken)
      const token = UserRepository.getToken()
      expect(token).toBe(mockToken)
    })

    it("clearSession debería eliminar el usuario y el token del localStorage", () => {
      const removeItemSpy = jest.spyOn(window.localStorage, "removeItem")
      window.localStorage.setItem("inventory_user", JSON.stringify(mockUser))
      window.localStorage.setItem("inventory_token", mockToken)

      UserRepository.clearSession()

      expect(removeItemSpy).toHaveBeenCalledWith("inventory_user")
      expect(removeItemSpy).toHaveBeenCalledWith("inventory_token")
      expect(UserRepository.getUser()).toBeNull()
      expect(UserRepository.getToken()).toBeNull()
    })
  })
})
