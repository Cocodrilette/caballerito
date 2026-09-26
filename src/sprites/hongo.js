// EL HONGO: un hongo de cueva que brilla un poquito.
// Cada letra es un píxel. Mira los colores en paleta.js.
import { PALETA } from "./paleta.js";

export default {
  nombre: "hongo",
  paleta: PALETA,
  animaciones: {
    normal: { velocidad: 1, repetir: false, cuadros: [
      [ // cuadro 1
        "................",
        "................",
        "................",
        "....vVVVVv......",
        "...vVVWVVVv.....",
        "..vVWVVVVWVv....",
        "..vVVVVVVVVv....",
        "..vvvvvvvvvv....",
        "......ww........",
        "......ww...vVVv.",
        "......Ww..vVWVVv",
        "......Ww..vvvvvv",
        "......Ww....ww..",
        ".....wWww...Ww..",
        "....wwWwww..Ww..",
        "..gggggggggggggg",
      ],
    ]},
  },
};
