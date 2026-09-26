// EL ESCUPIDOR: un bicho gordito que se queda quieto y escupe bolitas.
// Mira a la DERECHA (el juego lo voltea si hace falta).
// Cada letra es un píxel. Mira los colores en paleta.js.
import { PALETA } from "./paleta.js";

export default {
  nombre: "escupidor",
  paleta: {
    ...PALETA,
    E: "#8fbf3a", // cuerpo verde ácido
    e: "#4a6b20", // cuerpo oscuro
    R: "#c24a5a", // boca
    r: "#6e1f2e", // boca oscura
  },
  animaciones: {
    quieto: { velocidad: 3, repetir: true, cuadros: [
      [ // cuadro 1
        "................",
        "......eeee......",
        "....eeEEEEee....",
        "...eEEEEEEEEe...",
        "..eEEEEEEEWWWe..",
        "..eEEeEEEEWKKe..",
        ".eEEEEEEeEWKKWe.",
        ".eEEeEEEEEEWWEe.",
        ".eEEEEEEEEEEERRr",
        ".eEEEEeEEEEEeRRr",
        "..eEEEEEEEEEee..",
        "..eeEEEEEEEEee..",
        "...eeeeeeeeee...",
        "...K.K..K.K.....",
      ],
      [ // cuadro 2: respira (se aplasta un poquito)
        "................",
        "................",
        ".....eeeeee.....",
        "...eeEEEEEEee...",
        "..eEEEEEEEWWWe..",
        "..eEEeEEEEWKKe..",
        ".eEEEEEEeEWKKWe.",
        ".eEEeEEEEEEWWEe.",
        ".eEEEEEEEEEEERRr",
        ".eEEEEeEEEEEeRRr",
        "..eEEEEEEEEEEe..",
        "..eeEEEEEEEEee..",
        "...eeeeeeeeee...",
        "...K.K..K.K.....",
      ],
    ]},
    escupir: { velocidad: 6, repetir: true, cuadros: [
      [ // cuadro 1: infla los cachetes
        "......eeee......",
        "....eeEEEEee....",
        "...eEEEEEEEEe...",
        "..eEEEEEEEWWWe..",
        ".eEEEeEEEEWKKe..",
        ".eEEEEEEeEWKKWe.",
        "eEEEeEEEEEEWWEEe",
        "eEEEEEEEEEEEEEEe",
        "eEEEEEEEEEEEERRr",
        "eEEEEEeEEEEEeRRr",
        ".eEEEEEEEEEEEEe.",
        "..eeEEEEEEEEee..",
        "...eeeeeeeeee...",
        "...K.K..K.K.....",
      ],
      [ // cuadro 2: ¡PTU! boca bien abierta
        "................",
        "......eeee......",
        "....eeEEEEee....",
        "...eEEEEEEEEe...",
        "..eEEEEEEEWWWe..",
        "..eEEeEEEEWKKe..",
        ".eEEEEEEeEWKKWRR",
        ".eEEeEEEEEEWWRrr",
        ".eEEEEEEEEEEERrr",
        ".eEEEEeEEEEEERrr",
        "..eEEEEEEEEEERRR",
        "..eeEEEEEEEEee..",
        "...eeeeeeeeee...",
        "...K.K..K.K.....",
      ],
    ]},
  },
};
