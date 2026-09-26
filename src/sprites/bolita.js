// LA BOLITA: lo que escupe el escupidor. ¡Pégale con el aguijón!
// Cada letra es un píxel. Mira los colores en paleta.js.
import { PALETA } from "./paleta.js";

export default {
  nombre: "bolita",
  paleta: {
    ...PALETA,
    E: "#c8e86a", // baba clara
    e: "#5f8f22", // baba oscura
  },
  animaciones: {
    normal: { velocidad: 8, repetir: true, cuadros: [
      [ // cuadro 1
        ".eeee.",
        "eEEEEe",
        "eEWEEe",
        "eEEEEe",
        "eEEEEe",
        ".eeee.",
      ],
      [ // cuadro 2: el brillo se mueve
        ".eeee.",
        "eEEEEe",
        "eEEEEe",
        "eEEWEe",
        "eEEEEe",
        ".eeee.",
      ],
    ]},
  },
};
