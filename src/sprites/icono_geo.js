// ICONO DE GEO: el dibujito del contador de monedas.
// Cada letra es un píxel. Mira los colores en paleta.js.
import { PALETA } from "./paleta.js";

export default {
  nombre: "icono_geo",
  paleta: PALETA,
  animaciones: {
    normal: { velocidad: 1, repetir: false, cuadros: [
      [ // cuadro 1
        "....oo....",
        "..ooOOoo..",
        ".oOWOOOOo.",
        ".oOWOOOOo.",
        "oOOOooOOOo",
        "oOOOooOOOo",
        ".oOOOOOOo.",
        ".oOOOOOOo.",
        "..ooOOoo..",
        "....oo....",
      ],
    ]},
  },
};
