import { defineConfig, devices } from "@playwright/test"

// El puerto en el que se ejecutará tu servidor de desarrollo de Next.js.
// Asegúrate de que sea diferente al puerto de tu API de backend.
const PORT = 3001

// La URL base para tus pruebas.
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  // Timeout general para cada prueba.
  timeout: 30 * 1000,
  // Directorio donde se encuentran tus pruebas.
  testDir: "./test/playwright",
  // Ejecutar pruebas en archivos en paralelo.
  fullyParallel: true,
  // Fallar la compilación en CI si accidentalmente dejas test.only en el código fuente.
  forbidOnly: !!process.env.CI,
  // Reintentar solo en CI.
  retries: process.env.CI ? 2 : 0,
  // Limitar el número de workers en CI.
  workers: process.env.CI ? 1 : undefined,
  // Reporter a usar.
  reporter: "html",

  // La configuración clave que inicia tu servidor de desarrollo para las pruebas.
  webServer: {
    // Comando para iniciar el servidor de desarrollo.
    // Ejecutará `next dev -p 3001` gracias al cambio en package.json.
    command: "npm run dev",
    // URL a esperar antes de iniciar las pruebas.
    url: baseURL,
    // Aumentamos el timeout para que el servidor tenga tiempo de arrancar.
    timeout: 120 * 1000,
    // Reutilizar un servidor existente en la máquina local, pero no en CI.
    reuseExistingServer: !process.env.CI,
  },

  use: {
    // URL base para usar en acciones como `await page.goto('/')`.
    baseURL,
    // Recolectar trazas al reintentar una prueba fallida.
    trace: "on-first-retry",
  },

  /* Configurar proyectos para los principales navegadores */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})