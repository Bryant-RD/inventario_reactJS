const nextJest = require("next/jest")

const createJestConfig = nextJest({
  // Proporciona la ruta a tu aplicación Next.js para cargar next.config.js y los archivos .env en tu entorno de prueba
  dir: "./",
})

// Agrega cualquier configuración personalizada que se pasará a Jest
const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    // Manejar alias de módulos
    "^@/(.*)$": "<rootDir>/$1",
  },
  // Indica a Jest que solo ejecute archivos que terminen en .test.ts o .test.tsx
  // Esto evita que intente correr los archivos .spec.ts de Playwright.
  testMatch: ["**/test/**/*.test.ts?(x)"],
  // Opcional: Añade un archivo de setup para configurar el entorno de pruebas.
  // Es muy útil para importar jest-dom.
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
}

// createJestConfig se exporta de esta manera para asegurar que next/jest pueda cargar la configuración de Next.js que es asíncrona
module.exports = createJestConfig(customJestConfig)
