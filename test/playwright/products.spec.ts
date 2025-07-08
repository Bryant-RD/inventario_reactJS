import { test, expect } from '@playwright/test';
import { mockLogin } from './utils/auth'; // Asumiendo que creas este archivo

// --- Mock Data ---
// Datos de prueba para simular respuestas de la API.
const mockSuppliers = [
  { id: 1, name: 'Supplier A', contact: 'contact@a.com', phone: '111', address: 'Addr A' },
  { id: 2, name: 'Supplier B', contact: 'contact@b.com', phone: '222', address: 'Addr B' },
];

const mockProducts = [
  { id: 1, name: 'Laptop Pro', description: 'High-end laptop', price: 1500, stock: 50, supplierId: 1, supplier: { name: 'Supplier A' } },
  { id: 2, name: 'Wireless Mouse', description: 'Ergonomic mouse', price: 80, stock: 200, supplierId: 2, supplier: { name: 'Supplier B' } },
];

test.describe('Product Management Flow', () => {
  // --- Autenticación ---
  // Este hook se ejecuta antes de cada test en esta suite para asegurar que el usuario esté autenticado.
  test.beforeEach(async ({ page }) => await mockLogin(page));

  // --- Test de Creación de Producto ---
  test('should allow a user to create a new product', async ({ page }) => {
    // Mock de las APIs necesarias para la página de productos.
    await page.route('**/api/products', async route => {
      // La primera vez (GET) no devuelve productos.
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, json: { success: true, data: [] } });
      }
      // La segunda vez (POST) simula la creación.
      if (route.request().method() === 'POST') {
        const newProduct = { ...mockProducts[0], id: 3, name: 'New Keyboard' };
        await route.fulfill({ status: 201, json: { success: true, data: newProduct, message: 'Product created successfully' } });
        // Después de crear, el siguiente GET debe devolver el nuevo producto.
        await page.unroute('**/api/products');
        await page.route('**/api/products', async getRoute => {
          await getRoute.fulfill({ status: 200, json: { success: true, data: [newProduct] } });
        });
      }
    });
    await page.route('**/api/suppliers', route => route.fulfill({ status: 200, json: { success: true, data: mockSuppliers } }));

    // 1. Navegar a la página de productos.
    await page.goto('/dashboard/products');

    // 2. Abrir el diálogo de creación.
    await page.getByRole('button', { name: 'Add Product' }).click();

    // 3. Llenar el formulario.
    await expect(page.getByRole('heading', { name: 'Add New Product' })).toBeVisible();
    await page.getByLabel('Product Name').fill('New Keyboard');
    await page.getByLabel('Description').fill('Mechanical keyboard');
    await page.getByLabel('Price').fill('120');
    await page.getByLabel('Stock').fill('75');
    await page.getByLabel('Supplier').click();
    await page.getByText('Supplier A').click();

    // 4. Guardar el producto.
    await page.getByRole('button', { name: 'Save Product' }).click();

    // 5. Verificar que el producto aparece en la tabla.
    await expect(page.getByText('Product created successfully')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'New Keyboard' })).toBeVisible();
  });

  // --- Test de Edición de Producto ---
  test('should allow a user to edit an existing product', async ({ page }) => {
    // Mock de las APIs para tener un producto inicial.
    await page.route('**/api/products', route => route.fulfill({ status: 200, json: { success: true, data: [mockProducts[0]] } }));
    await page.route('**/api/suppliers', route => route.fulfill({ status: 200, json: { success: true, data: mockSuppliers } }));

    // Mock de la API de actualización (PUT).
    await page.route(`**/api/products/${mockProducts[0].id}`, async route => {
      const updatedProduct = { ...mockProducts[0], name: 'Laptop Pro v2' };
      await route.fulfill({ status: 200, json: { success: true, data: updatedProduct, message: 'Product updated successfully' } });
      // El siguiente GET debe devolver la lista actualizada.
      await page.unroute('**/api/products');
      await page.route('**/api/products', getRoute => getRoute.fulfill({ status: 200, json: { success: true, data: [updatedProduct] } }));
    });

    // 1. Navegar a la página de productos.
    await page.goto('/dashboard/products');

    // 2. Abrir el diálogo de edición.
    await page.getByRole('row', { name: /Laptop Pro/ }).getByRole('button', { name: 'Edit' }).click();

    // 3. Modificar el formulario.
    await page.getByLabel('Product Name').fill('Laptop Pro v2');

    // 4. Actualizar el producto.
    await page.getByRole('button', { name: 'Update Product' }).click();

    // 5. Verificar que el cambio se refleja en la tabla.
    await expect(page.getByText('Product updated successfully')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Laptop Pro v2' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Laptop Pro' })).not.toBeVisible();
  });

  // --- Test de Eliminación de Producto ---
  test('should allow a user to delete a product', async ({ page }) => {
    // Mock para tener un producto que eliminar.
    await page.route('**/api/products', route => route.fulfill({ status: 200, json: { success: true, data: [mockProducts[1]] } }));

    // Mock de la API de eliminación (DELETE).
    await page.route(`**/api/products/${mockProducts[1].id}`, async route => {
      await route.fulfill({ status: 200, json: { success: true, message: 'Product deleted successfully' } });
      // El siguiente GET debe devolver una lista vacía.
      await page.unroute('**/api/products');
      await page.route('**/api/products', getRoute => getRoute.fulfill({ status: 200, json: { success: true, data: [] } }));
    });

    // 1. Navegar a la página de productos.
    await page.goto('/dashboard/products');

    // 2. Hacer clic en el botón de eliminar del producto.
    await page.getByRole('row', { name: /Wireless Mouse/ }).getByRole('button', { name: 'Delete' }).click();

    // 3. Confirmar la eliminación en el diálogo.
    // Asumo que hay un diálogo de confirmación con un botón "Delete".
    await page.getByRole('button', { name: 'Delete' }).click();

    // 4. Verificar que el mensaje de éxito sea visible.
    await expect(page.getByText('Product deleted successfully')).toBeVisible();

    // 5. Verificar que el producto ya no está en la tabla.
    await expect(page.getByRole('cell', { name: 'Wireless Mouse' })).not.toBeVisible();
  });
});
