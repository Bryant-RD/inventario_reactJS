import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow a user to sign up successfully and redirect to login', async ({ page, next }) => {
    // Mockeamos la respuesta de la API para un registro exitoso.
    // `next.fetch` intercepta la llamada a fetch que hace tu aplicación.
    await next.fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        success: true,
        message: 'Account created successfully! Redirecting to login...',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 1. Navegar a la página de registro
    await page.goto('/auth/signup');

    // 2. Llenar el formulario
    await page.getByLabel('First Name').fill('Test');
    await page.getByLabel('Last Name').fill('User');
    await page.getByLabel('Username').fill('testuser_playwright');
    await page.getByLabel('Email Address').fill('test.playwright@example.com');
    await page.getByLabel('Password').fill('Password123');
    await page.getByLabel('Confirm Password').fill('Password123');

    // 3. Hacer clic en el botón de crear cuenta
    await page.getByRole('button', { name: 'Create Account' }).click();

    // 4. Verificar que el mensaje de éxito sea visible
    await expect(page.getByText('Account created successfully! Redirecting to login...')).toBeVisible();

    // 5. Esperar a la redirección y verificar la nueva URL
    await page.waitForURL('/auth/login');
    await expect(page).toHaveURL('/auth/login');
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  });

  test('should show an error message if passwords do not match', async ({ page }) => {
    // 1. Navegar a la página de registro
    await page.goto('/auth/signup');

    // 2. Llenar el formulario con contraseñas que no coinciden
    await page.getByLabel('Password').fill('Password123');
    await page.getByLabel('Confirm Password').fill('Password456');
    await page.getByLabel('First Name').click(); // Click outside to trigger validation if any

    // 3. Hacer clic en el botón de crear cuenta
    await page.getByRole('button', { name: 'Create Account' }).click();

    // 4. Verificar que el mensaje de error sea visible
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('should show an API error message if registration fails', async ({ page, next }) => {
    // Mockeamos una respuesta de error de la API
    await next.fetch('/api/auth/register', {
      method: 'POST',
      status: 400,
      body: JSON.stringify({
        success: false,
        message: 'Email is already in use.',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await page.goto('/auth/signup');
    await page.getByLabel('Email Address').fill('existing@example.com');
    // ... (llena el resto del formulario)
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Verificar que el mensaje de error de la API sea visible
    await expect(page.getByText('Email is already in use.')).toBeVisible();
  });
});
