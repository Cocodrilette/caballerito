import { defineConfig } from "vite";
import { resolve } from "node:path";
import { guardarNiveles } from "./src/editor/pluginGuardar.js"; // "Guardar en el juego" del editor

export default defineConfig({
  plugins: [guardarNiveles()],
  server: { open: true },
  build: {
    rollupOptions: {
      input: {
        juego: resolve(import.meta.dirname, "index.html"),
        editor: resolve(import.meta.dirname, "editor.html"),
        sonidos: resolve(import.meta.dirname, "herramientas/probar-sonidos.html"),
        sprites: resolve(import.meta.dirname, "herramientas/ver-sprites.html"),
      },
    },
  },
});
