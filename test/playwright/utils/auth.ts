import { Page, expect } from '@playwright/test';

export async function mockLogin(page: Page) {
  // Mock de la API de login para una respuesta exitosa.
  await page.route('**/api/auth/login', async route => {
    await route.fulfill({
      status: 200,
      json: {
        success: true,
        user: { id: 1, firstName: 'Test', lastName: 'User', email: 'test@example.com' },
        token: 'mock-jwt-token-for-testing',
      },
    });
  });

  // Mock de la API de perfil que se llama después del login.
  await page.route('**/api/auth/profile', async route => {
    await route.fulfill({
      status: 200,
      json: {
        success: true,
        data: { id: 1, firstName: 'Test', lastName: 'User', email: 'test@example.com' },
      },
    });
  });

  // Realizar el login en la UI.
  await page.goto('/auth/login');
  await page.getByLabel('Email Address').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('/dashboard');
}