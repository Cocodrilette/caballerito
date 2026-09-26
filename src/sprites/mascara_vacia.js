// MÁSCARA VACÍA: una vida que se perdió.
// Cada letra es un píxel. Mira los colores en paleta.js.
import { PALETA } from "./paleta.js";

export default {
  nombre: "mascara_vacia",
  paleta: PALETA,
  animaciones: {
    normal: { velocidad: 1, repetir: false, cuadros: [
      [ // cuadro 1
        "..G......G..",
        "..G......G..",
        "..GG....GG..",
        "...GGGGGG...",
        "..GggggggG..",
        ".GggggggggG.",
        ".GgNNggNNgG.",
        ".GgNNggNNgG.",
        ".GgNNggNNgG.",
        ".GggggggggG.",
        ".GggggggggG.",
        "..GggggggG..",
        "...GGGGGG...",
        "............",
      ],
    ]},
  },
};
