// EL GUSANO: un bichito con caparazón que camina de lado a lado.
// Cada letra es un píxel. Mira los colores en paleta.js.
import { PALETA } from "./paleta.js";

export default {
  nombre: "gusano",
  paleta: {
    ...PALETA,
    P: "#d0703a", // caparazón
    p: "#7c3a22", // caparazón oscuro
  },
  animaciones: {
    caminar: { velocidad: 4, repetir: true, cuadros: [
      [ // cuadro 1
        "................",
        "................",
        "................",
        "....pppppp......",
        "..pppPPPpPpp....",
        ".pPPpWwPpPPpp...",
        ".pPPpPPPpPPpp...",
        "pPPPpPPPpPPpPWW.",
        "pPPPpPPPpPPpPWKW",
        "pppppppppppppwWw",
        ".ppppppppppppp..",
        "..KK.KK.KK.KK...",
      ],
      [ // cuadro 2
        "................",
        "................",
        "................",
        "................",
        "....pppppp......",
        "..pppPPPpPpp....",
        ".pPPpWwPpPPpp...",
        "pPPPpPPPpPPpPp..",
        "pPPPpPPPpPPpPWW.",
        "pppppppppppppWKW",
        ".pppppppppppppWw",
        "..KK.KK.KK.KK...",
      ],
    ]},
  },
};
