// EL SUELO CON BORDE: roca con musgo encima.
// Cada letra es un píxel. Mira los colores en paleta.js.
import { PALETA } from "./paleta.js";

export default {
  nombre: "suelo_borde",
  paleta: PALETA,
  animaciones: {
    normal: { velocidad: 1, repetir: false, cuadros: [
      [ // cuadro 1
        "VVVVVVVVVVVVVVVV",
        "VvVVVVvVVVVVvVVV",
        "vvvVvvvvvVvvvvVv",
        "gvGvvGgvGvGgvGvG",
        "GvGGvGgGGvLGGGvG",
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
