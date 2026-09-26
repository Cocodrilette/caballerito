// LA BANCA: aquí el caballerito descansa y guarda.
// Cada letra es un píxel. Mira los colores en paleta.js.
import { PALETA } from "./paleta.js";

export default {
  nombre: "banca",
  paleta: {
    ...PALETA,
    m: "#4e3a2a", // madera oscura
  },
  animaciones: {
    normal: { velocidad: 1, repetir: false, cuadros: [
      [ // cuadro 1
        "................................",
        "................................",
        "...LL......................LL...",
        "..LwwL....................LwwL..",
        "..LwLLLLLLLLLLLLLLLLLLLLLLLLwL..",
        "..LGGGGGGGGGGGGGGGGGGGGGGGGGGL..",
        "..LG.L.L.L.L.L.L.L.L.L.L.L.LGL..",
        "..LG.L.L.L.L.L.L.L.L.L.L.L.LGL..",
        "..LGGGGGGGGGGGGGGGGGGGGGGGGGGL..",
        ".OMMMMMMMMMMMMMMMMMMMMMMMMMMMMO.",
        ".mMMMMMMMMMMMMMMMMMMMMMMMMMMMMm.",
        "..mmmmmmmmmmmmmmmmmmmmmmmmmmmm..",
        "..LG......................GLGL..",
        "..LG........................GL..",
        "..LG........................GL..",
        ".LLGG......................GGLL.",
      ],
    ]},
  },
};
