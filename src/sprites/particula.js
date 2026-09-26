// LA PARTÍCULA: una chispita blanca.
// Cada letra es un píxel. Mira los colores en paleta.js.
import { PALETA } from "./paleta.js";

export default {
  nombre: "particula",
  paleta: PALETA,
  animaciones: {
    normal: { velocidad: 1, repetir: false, cuadros: [
      [ // cuadro 1
        ".ww.",
        "wWWw",
        "wWWw",
        ".ww.",
      ],
    ]},
  },
};
