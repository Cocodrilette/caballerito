// LA PUERTA: la salida brillante al siguiente nivel.
// Cada letra es un píxel. Mira los colores en paleta.js.
import { PALETA } from "./paleta.js";

export default {
  nombre: "puerta",
  paleta: PALETA,
  animaciones: {
    normal: { velocidad: 1, repetir: false, cuadros: [
      [ // cuadro 1
        ".....gggggg.....",
        "...ggLLLLLLgg...",
        "..gVLLLLGLLLVg..",
        ".gLLLGccccLLGLg.",
        ".gGLccccccccLLg.",
        "gLLLccccccccLGLg",
        "gLLccccWcccccLLg",
        "gLLccccccccccLGg",
        "gLLccccccccccLLg",
        "gVLccccccccccLLg",
        "gLVccccccccccLLg",
        "gLGccccccccccLLg",
        "gLLcccccccWccGLg",
        "gLLccccccccccLLg",
        "gLLCCCCCCCCCCLGg",
        "gLLCCCCCCCCCCLVg",
        "gGLCCCCCCCCCCLLV",
        "gLLCCWCCCCCCCLLg",
        "gLGCCCCCCCCCCLLg",
        "gLLCCCCCCCCCCGLg",
        "VLLCCCCCCCCCCLLg",
        "gLLCCCCCCCCCCLGg",
        "gLLCCCCCWCCCCLLg",
        "gGLCCCCCCCCCCLLg",
        "gLLCCCCCCCCCCVLg",
        "gLGCCCCCCCCCCLLg",
        "gLLCCCCCCCCWCGLg",
        "gLLCCCCCCCCCCLLg",
        "gLLCCCWCCCCCCLGg",
        "gLLCCCCCCCCCCLLg",
        "GGGGGGGGGGGGGGGG",
        "gggggggggggggggg",
      ],
    ]},
  },
};
