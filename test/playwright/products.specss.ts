import { test, expect } from "@playwright/test"
import { mockLogin } from "./utils/auth"

// --- Mock Data ---
// Datos de prueba para simular respuestas de la API.
const mockSuppliers = [
  { id: 1, nombre: "Supplier A", contact: "contact@a.com", phone: "111", address: "Addr A" },
  { id: 2, nombre: "Supplier B", contact: "contact@b.com", phone: "222", address: "Addr B" },
]

const mockProducts = [
  { id: 1, nombre: "Laptop Pro", descripcion: "High-end laptop", precio: 1500, cantidad: 50, cantidadMinima: 10, proveedorId: 1, categoria: "Laptops" },
  { id: 2, nombre: "Wireless Mouse", descripcion: "Ergonomic mouse", precio: 80, cantidad: 200, cantidadMinima: 20, proveedorId: 2, categoria: "Accessories" },
]

test.describe("Product Management Flow", () => {
  // --- Autenticación ---
  // Este hook se ejecuta antes de cada test en esta suite para asegurar que el usuario esté autenticado.
  test.beforeEach(async ({ page }) => {
    // Simula un usuario logueado y navega directamente a la página de productos.
    // Esto es mucho más rápido y fiable que pasar por la UI de login.
    await mockLogin(page, "/products")
  })

  // --- Test de Creación de Producto ---
  test("should allow a user to create a new product", async ({ page }) => {
    const newProductData = { ...mockProducts[0], id: 3, nombre: "New Keyboard" }

    // Mock de las APIs: GET inicial sin productos, y POST que crea uno.
    await page.route("**/api/productos", (route) => route.fulfill({ status: 200, json: { products: [] } }))
    await page.route("**/api/proveedores", (route) => route.fulfill({ status: 200, json: { suppliers: mockSuppliers } }))

    // Mock de la creación del producto
    await page.route("**/api/productos", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({ status: 201, json: { product: newProductData } })
      }
    })

    // 2. Abrir el diálogo de creación.
    await page.getByRole("button", { name: "Add Product" }).click()

    // 3. Llenar el formulario.
    await expect(page.getByRole("heading", { name: "Add New Product" })).toBeVisible()
    await page.getByLabel("Product Name").fill("New Keyboard")
    await page.getByLabel("Current Stock").fill("75")
    await page.getByLabel("Price").fill("120")
    await page.getByLabel("Supplier").click()
    await page.getByText("Supplier A").click()

    // 4. Guardar el producto.
    await page.getByRole("button", { name: "Add Product" }).click()

    // 5. Verificar que el producto aparece en la tabla.
    await expect(page.getByRole("cell", { name: "New Keyboard" })).toBeVisible()
  })

  // --- Test de Edición de Producto ---
  test("should allow a user to edit an existing product", async ({ page }) => {
    // Mock de las APIs para tener un producto inicial.
    await page.route("**/api/productos", (route) => route.fulfill({ status: 200, json: { products: [mockProducts[0]] } }))
    await page.route("**/api/proveedores", (route) => route.fulfill({ status: 200, json: { suppliers: mockSuppliers } }))

    // Mock de la API de actualización (PUT).
    const updatedProductData = { ...mockProducts[0], nombre: "Laptop Pro v2" }
    await page.route(`**/api/productos/${mockProducts[0].id}`, async (route) => {
      await route.fulfill({ status: 200, json: { product: updatedProductData } })
    })

    // 2. Abrir el diálogo de edición.
    await page.getByRole("row", { name: /Laptop Pro/ }).getByRole("button", { name: "Edit" }).click()

    // 3. Modificar el formulario.
    await page.getByLabel("Product Name").fill("Laptop Pro v2")

    // 4. Actualizar el producto.
    await page.getByRole("button", { name: "Update Product" }).click()

    // 5. Verificar que el cambio se refleja en la tabla.
    await expect(page.getByRole("cell", { name: "Laptop Pro v2" })).toBeVisible()
    await expect(page.getByRole("cell", { name: "Laptop Pro" })).not.toBeVisible()
  })

  // --- Test de Eliminación de Producto ---
  test("should allow a user to delete a product", async ({ page }) => {
    // Mock para tener un producto que eliminar.
    await page.route("**/api/productos", (route) => route.fulfill({ status: 200, json: { products: [mockProducts[1]] } }))
    await page.route("**/api/proveedores", (route) => route.fulfill({ status: 200, json: { suppliers: mockSuppliers } }))

    // Mock de la API de eliminación (DELETE).
    await page.route(`**/api/productos/${mockProducts[1].id}`, async (route) => {
      await route.fulfill({ status: 204 }) // 204 No Content es una respuesta común para DELETE
    })

    // 2. Hacer clic en el botón de eliminar del producto.
    await page.getByRole("row", { name: /Wireless Mouse/ }).getByRole("button", { name: "Delete" }).click()

    // 3. Verificar que el producto ya no está en la tabla.
    await expect(page.getByRole("cell", { name: "Wireless Mouse" })).not.toBeVisible()
  })
})
