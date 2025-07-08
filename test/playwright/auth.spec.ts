import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow a user to sign up successfully and redirect to login', async ({ page }) => {
    // Mockeamos la respuesta de la API para un registro exitoso.
    // `next.fetch` intercepta la llamada a fetch que hace tu aplicación.
    await page.route('**/auth/register', async route => {
      await route.fulfill({
      body: JSON.stringify({
        success: true,
        message: 'Account created successfully! Redirecting to login...',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      });
    }); 

    // 1. Navegar a la página de registro
    await page.goto('/auth/signup');

    // 2. Llenar el formulario
    await page.locator('#firstName').pressSequentially('Test');
    await page.getByLabel('Last Name').fill('User');
    await page.getByLabel('Username').fill('testuser_playwright');
    await page.getByLabel('Email Address').fill('test.playwright@example.com');
    await page.getByLabel('Password', { exact: true }).fill('Password123');
    await page.getByLabel('Confirm Password').fill('Password123');

    // 3. Hacer clic en el botón de crear cuenta
    await page.getByRole('button', { name: 'Create Account' }).click();

    // 4. Verificar que el mensaje de éxito sea visible
    await expect(page.getByText('Account created successfully! Redirecting to login...')).toBeVisible();

    // 5. Esperar a la redirección y verificar la nueva URL
    await page.waitForURL('/auth/login');
    await expect(page).toHaveURL('/auth/login');
    await expect(page.getByRole('heading', { name: 'Inventory Manager' })).toBeVisible();
  });

  test('should show an error message if passwords do not match', async ({ page }) => {
    // 1. Navegar a la página de registro
    await page.goto('/auth/signup');

    // 2. Llenar el formulario con datos válidos, pero contraseñas que no coinciden
    await page.locator('#firstName').pressSequentially('Test');
    await page.getByLabel('Last Name').fill('User');
    await page.getByLabel('Username').fill('testuser_mismatch');
    await page.getByLabel('Email Address').fill('test.mismatch@example.com');
    await page.getByLabel('Password', { exact: true }).fill('Password123');
    await page.getByLabel('Confirm Password').fill('Password456');

    // 3. Hacer clic en el botón de crear cuenta
    await page.getByRole('button', { name: 'Create Account' }).click();

    // 4. Verificar que el mensaje de error sea visible
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('should show an API error message if registration fails', async ({ page }) => {
    // Mockeamos una respuesta de error de la API
    await page.route('**/auth/register', async route => {
      await route.fulfill({
      status: 400,
      body: JSON.stringify({
        success: false,
        message: 'Email is already in use.',
      }),
      headers: {
        'Content-Type': 'application/json',
      }});
    });

    await page.goto('/auth/signup');
    await page.locator('#firstName').pressSequentially('Test');
    await page.getByLabel('Last Name').fill('User');
    await page.getByLabel('Username').fill('existinguser');
    await page.getByLabel('Email Address').fill('existing@example.com');
    await page.getByLabel('Password', { exact: true }).fill('Password123');
    await page.getByLabel('Confirm Password').fill('Password123');
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Verificar que el mensaje de error de la API sea visible
    await expect(page.getByText('Email is already in use.')).toBeVisible();
  });

  test('should show an error message if a required field is empty', async ({ page }) => {
    // 1. Navegar a la página de registro
    await page.goto('/auth/signup');

    // 2. Llenar el formulario, pero dejar el nombre vacío
    // await page.locator('#firstName').pressSequentially('Test'); // Campo vacío a propósito
    await page.getByLabel('Last Name').fill('User');
    await page.getByLabel('Username').fill('testuser_emptyfield');
    await page.getByLabel('Email Address').fill('test.emptyfield@example.com');
    await page.getByLabel('Password', { exact: true }).fill('Password123');
    await page.getByLabel('Confirm Password').fill('Password123');

    // 3. Hacer clic en el botón de crear cuenta
    await page.getByRole('button', { name: 'Create Account' }).click();

    // 4. Verificar que el mensaje de error para el campo requerido sea visible
    await expect(page.getByText('First name is required')).toBeVisible();
  });
});
