// EL SUELO: roca de la cueva.
// Cada letra es un píxel. Mira los colores en paleta.js.
import { PALETA } from "./paleta.js";

export default {
  nombre: "suelo",
  paleta: PALETA,
  animaciones: {
    normal: { velocidad: 1, repetir: false, cuadros: [
      [ // cuadro 1
        "GGGGGGGgGGGGGGGG",
        "GLLLGGGgGLLLGGGg",
        "GLGGGGGgGLGGGGGg",
        "GGGGGGgGGGGGGGGg",
        "GGGGGGgGGGGGGGGg",
        "gGGGGGgGGGGGGGgG",
        "GggggggGGGGGGGgG",
        "GGGGGGGggGGGGgGG",
        "GLLLGGGGGgggggGG",
        "GLGGGGGGGGGgGGGG",
        "GGGGGGGGGGGgGLLG",
        "GGGGGGGGGGGgGLGG",
        "GGGGGGGGGGgGGGGG",
        "gGGGGGGGGGgGGGGg",
        "GggGGGGGgggGGGGG",
        "GGGgggggGGGGGGGG",
      ],
    ]},
  },
};
