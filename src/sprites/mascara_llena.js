// MÁSCARA LLENA: una vida del caballerito.
// Cada letra es un píxel. Mira los colores en paleta.js.
import { PALETA } from "./paleta.js";

export default {
  nombre: "mascara_llena",
  paleta: PALETA,
  animaciones: {
    normal: { velocidad: 1, repetir: false, cuadros: [
      [ // cuadro 1
        "..W......W..",
        "..W......W..",
        "..WW....WW..",
        "...WWWWWW...",
        "..WWWWWWWW..",
        ".WWWWWWWWWW.",
        ".WWKKWWKKWW.",
        ".WWKKWWKKWW.",
        ".WWKKWWKKWW.",
        ".WWWWWWWWWW.",
        ".wWWWWWWWWw.",
        "..wWWWWWWw..",
        "...wwwwww...",
        "............",
      ],
    ]},
  },
};
