import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"
require('dotenv').config();
export default defineConfig({
  test: {
    environment: "node",
    globals: true,

  },
  server: {
    host: "0.0.0.0"
  },
  plugins: [tsconfigPaths()],
})