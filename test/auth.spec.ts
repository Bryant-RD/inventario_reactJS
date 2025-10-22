import { test, expect } from "@playwright/test"

test.describe("Flujo de Autenticación y Navegación", () => {
  test("Debería permitir a un usuario registrarse, iniciar sesión, navegar y cerrar sesión", async ({ page }) => {
    // Generamos datos únicos para cada ejecución de la prueba para evitar conflictos
    const uniqueId = Date.now()
    const email = `testuser_${uniqueId}@example.com`
    const username = `testuser_${uniqueId}`
    const password = "Password123"
    const firstName = "Test"

    // --- 1. Registro de Usuario ---
    await test.step("Registro de un nuevo usuario", async () => {
      await page.goto("/auth/signup")

      // Llenamos el formulario de registro
      await page.getByLabel("First Name", { exact: true }).fill(firstName)
      await page.getByLabel("Last Name", { exact: true }).fill("User")
      await page.getByLabel("Username").fill(username)
      await page.getByLabel("Email Address", { exact: true }).fill(email)
      await page.getByLabel("Password", { exact: true }).fill(password)
      await page.getByLabel("Confirm Password").fill(password)

      // Enviamos el formulario
      await page.getByRole("button", { name: "Create Account" }).click()

      // Verificamos el mensaje de éxito y la redirección
      await expect(page.getByText("Account created successfully!")).toBeVisible()
      await page.waitForURL("**/auth/login")
    })

    // --- 2. Inicio de Sesión ---
    await test.step("Inicio de sesión con el nuevo usuario", async () => {
      // Llenamos el formulario de login con las credenciales recién creadas
      await page.getByLabel("Email Address", { exact: true }).fill(email)
      await page.getByLabel("Password", { exact: true }).fill(password)
      await page.getByRole("button", { name: "Sign In" }).click()

      // Verificamos que se redirige al Dashboard
      await page.waitForURL("/")
      await expect(page.getByRole("heading", { name: `Welcome back, ${firstName}!` })).toBeVisible()
    })

    // --- 3. Navegación por la Aplicación ---
    await test.step("Navegación a Productos y Proveedores", async () => {
      await page.getByRole("button", { name: "Manage Products" }).click()
      await expect(page.getByRole("heading", { name: "Lista de Productos" })).toBeVisible()

      await page.getByRole("button", { name: "Manage Suppliers" }).click()
      await expect(page.getByRole("heading", { name: "Lista de Proveedores" })).toBeVisible()
    })

    // --- 4. Cierre de Sesión ---
    await test.step("Cierre de sesión", async () => {
      await page.getByRole("button", { name: "Logout" }).click()
      await page.waitForURL("**/auth/login")
      await expect(page.getByRole("heading", { name: "Inventory Manager" })).toBeVisible()
    })
  })
})
