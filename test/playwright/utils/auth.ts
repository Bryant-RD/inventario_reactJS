import type { Page } from "@playwright/test"

/**
 * Simula un inicio de sesión guardando un token falso en el localStorage
 * antes de navegar a la página. Esto evita tener que pasar por la UI de login
 * en cada prueba que requiera autenticación, haciéndolas mucho más rápidas y estables.
 * @param page La instancia de la página de Playwright.
 * @param path La ruta a la que navegar después de simular el login. Por defecto es "/".
 */
export async function mockLogin(page: Page, path: string = "/") {
  await page.addInitScript(() => {
    window.localStorage.setItem("authToken", "mock-test-token")
  })
  await page.goto(path)
}