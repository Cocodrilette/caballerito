// LOS PINCHOS: ¡cuidado, pican!
// Cada letra es un píxel. Mira los colores en paleta.js.
import { PALETA } from "./paleta.js";

export default {
  nombre: "pinchos",
  paleta: PALETA,
  animaciones: {
    normal: { velocidad: 1, repetir: false, cuadros: [
      [ // cuadro 1
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        ".w...w...w...w..",
        ".w...w...w...w..",
        ".Ww..Ww..Ww..Ww.",
        ".Ww..Ww..Ww..Ww.",
        "WWw.WWw.WWw.WWw.",
        "WWwwWWwwWWwwWWww",
        "WwwwWwwwWwwwWwww",
        "wwwwwwwwwwwwwwww",
        "GGGGGGGGGGGGGGGG",
        "gggggggggggggggg",
      ],
    ]},
  },
};
