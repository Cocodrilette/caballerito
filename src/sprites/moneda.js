// LA MONEDA (geo): gira y brilla. ¡Recógelas!
// Cada letra es un píxel. Mira los colores en paleta.js.
import { PALETA } from "./paleta.js";

export default {
  nombre: "moneda",
  paleta: PALETA,
  animaciones: {
    girar: { velocidad: 8, repetir: true, cuadros: [
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
      [ // cuadro 2
        "....oo....",
        "...oOOo...",
        "..oOWOOo..",
        "..oOWOOo..",
        "..oOOOOo..",
        "..oOOOOo..",
        "..oOOOOo..",
        "..oOOOOo..",
        "...oOOo...",
        "....oo....",
      ],
      [ // cuadro 3
        "..........",
        "....oo....",
        "....oo....",
        "....oo....",
        "....oo....",
        "....oo....",
        "....oo....",
        "....oo....",
        "....oo....",
        "..........",
      ],
      [ // cuadro 4
        "....oo....",
        "...oOOo...",
        "..oOOWOo..",
        "..oOOWOo..",
        "..oOOOOo..",
        "..oOOOOo..",
        "..oOOOOo..",
        "..oOOOOo..",
        "...oOOo...",
        "....oo....",
      ],
    ]},
  },
};
