import { defineConfig } from "vite";
import { resolve } from "node:path";
import { guardarNiveles } from "./src/editor/pluginGuardar.js"; // "Guardar en el juego" del editor
import { tallerDeDibujos } from "./src/editor-sprites/pluginSprites.js"; // leer y guardar dibujos

export default defineConfig({
  plugins: [guardarNiveles(), tallerDeDibujos()],
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
