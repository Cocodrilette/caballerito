// EL MOSQUITO: vuela y aletea muy rápido.
// Cada letra es un píxel. Mira los colores en paleta.js.
import { PALETA } from "./paleta.js";

export default {
  nombre: "mosquito",
  paleta: {
    ...PALETA,
    P: "#9a62c4", // cuerpo
    p: "#4b2c66", // cuerpo oscuro
  },
  animaciones: {
    volar: { velocidad: 10, repetir: true, cuadros: [
      [ // cuadro 1
        "..cc...cc.....",
        ".cCCc.cCCc....",
        ".cCCCcCCCc....",
        "..cCCCCCc.....",
        "...PPPPPWWW...",
        "..PPPPPWWWWW..",
        ".pPPPPPWKKWW..",
        ".pPPPPPWKKWw..",
        ".ppPPPPpWWww..",
        "..ppppp..www..",
        "...K.K.....w..",
        "............w.",
      ],
      [ // cuadro 2
        "..............",
        "..............",
        "..............",
        "ccc...........",
        "cCCPPPPPWWW...",
        "cCPPPPPWWWWW..",
        ".pPPPPPWKKWW..",
        ".pPPPPPWKKWw..",
        ".ppPPPPpWWww..",
        "..ppppp..www..",
        "...K.K.....w..",
        "............w.",
      ],
    ]},
  },
};
