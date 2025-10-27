import { test, expect, Page } from "@playwright/test";

test.describe("Flujo completo de gestión de productos", () => {
  const loginCredentials = {
    email: "briant04.rt@gmail.com",
    password: "BryantRD0417",
  };

  // Datos únicos para el producto en cada ejecución de la prueba
  const uniqueId = Date.now();
  const productName = `Monitor Gamer Test ${uniqueId}`;
  const updatedProductName = `Monitor LG UltraGear ${uniqueId} - Actualizado`;
  const productPrice = "499.99";

  // Antes de cada prueba en este bloque, nos aseguramos de iniciar sesión
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login");

    // Rellenar credenciales y hacer login
    await page.getByLabel("Email Address", { exact: true }).fill(loginCredentials.email);
    await page.getByLabel("Password", { exact: true }).fill(loginCredentials.password);
    await page.getByRole("button", { name: "Sign In" }).click();

    // Esperar a ser redirigido al dashboard
    await page.waitForURL("/");
    await expect(page.getByRole("heading", { name: /Welcome back/i })).toBeVisible();
  });

  test("Debería permitir crear, editar y eliminar un producto", async ({ page }) => {
    // --- 1. Navegación a la página de productos ---
    await test.step("Navegar a la gestión de productos", async () => {
      await page.getByRole("link", { name: "Manage Products" }).click();
      await page.waitForURL("/products");
      await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
    });

    // --- 2. Crear un nuevo producto ---
    await test.step("Crear un nuevo producto", async () => {
      await page.getByRole("button", { name: "Add Product" }).click();

      // Rellenar el formulario en el diálogo
      await page.getByLabel("Product Name").fill(productName);
      await page.getByLabel("Current Stock").fill("25");
      await page.getByLabel("Minimum Stock").fill("5");
      await page.getByLabel("Price").fill("499.99");
      await page.getByLabel("Description").fill("Monitor de alta resolución para gaming.");
      await page.getByLabel("Category").fill("Monitors");

      // Para componentes 'combobox' personalizados, primero se hace clic para abrir y luego se selecciona la opción.
      await page.getByLabel("Supplier").click();
      await page.getByRole("option").first().click(); // Seleccionamos la primera opción de la lista
      
      await page.locator("#save-product").click();

      // Verificar que el producto aparece en la tabla
      await expect(page.getByRole("cell", { name: productName, exact: true })).toBeVisible();
    });

    // --- 3. Editar el producto creado ---
    await test.step("Editar el producto", async () => {
      // Encontrar la fila del producto y hacer clic en el botón de editar
      const productRow = page.getByRole("row", { name: productName });
      await productRow.locator('[id^="edit-button"]').click();

      // Modificar los datos en el formulario de edición
      await page.getByLabel("Product Name").fill(updatedProductName);
      await page.getByLabel("Price").fill("549.50");
      await page.locator("#update-product").click();

      // Verificar que los cambios se reflejan en la tabla
      await expect(page.getByRole("cell", { name: updatedProductName, exact: true })).toBeVisible();
      await expect(page.getByRole("cell", { name: "$549.50" }).first()).toBeVisible();
      // Asegurarse de que el nombre antiguo ya no está
      await expect(page.getByRole("cell", { name: productName, exact: true })).not.toBeVisible();
    });

    // --- 4. Eliminar el producto editado ---
    await test.step("Eliminar el producto", async () => {
    // Esperar a que la fila del producto actualizado aparezca
    const updatedCell = page.getByRole("cell", { name: updatedProductName, exact: false });
    await expect(updatedCell).toBeVisible({ timeout: 15000 });

    // Desde la celda, subir al <tr> y encontrar el botón de eliminar
    const rowLocator = updatedCell.locator("xpath=ancestor::tr[1]");
    const deleteButton = rowLocator.locator('[id^="delete-button"]');

    // Hacer clic en eliminar
    await deleteButton.click();

    // Confirmar que el producto fue eliminado (ya no visible)
    await expect(page.getByRole("cell", { name: updatedProductName, exact: false })).toHaveCount(0);
    });

    // --- 5. Cierre de Sesión (Opcional pero recomendado) ---
    await test.step("Cerrar sesión", async () => {
        await page.goto("/"); // Volver al dashboard para encontrar el botón de logout
        await page.getByRole("button", { name: "Logout" }).click();
        await page.waitForURL("**/auth/login");
    });
  });
});