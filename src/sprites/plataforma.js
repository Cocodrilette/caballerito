// LA PLATAFORMA: una tabla delgada para saltar encima.
// Cada letra es un píxel. Mira los colores en paleta.js.
import { PALETA } from "./paleta.js";

export default {
  nombre: "plataforma",
  paleta: {
    ...PALETA,
    m: "#4e3a2a", // madera oscura
  },
  animaciones: {
    normal: { velocidad: 1, repetir: false, cuadros: [
      [ // cuadro 1
        "mOMMMMMMMMMMMMOm",
        "MMMmMMMMMMMmMMMM",
        "MMMMMMMmMMMMMMMM",
        "mmmmmmmmmmmmmmmm",
        ".mm..........mm.",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
      ],
    ]},
  },
};
