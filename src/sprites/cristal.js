// EL CRISTAL: una piedra azul que brilla en la cueva.
// Cada letra es un píxel. Mira los colores en paleta.js.
import { PALETA } from "./paleta.js";

export default {
  nombre: "cristal",
  paleta: PALETA,
  animaciones: {
    brillar: { velocidad: 2, repetir: true, cuadros: [
      [ // cuadro 1
        "................",
        "................",
        "........C.......",
        ".......CCc......",
        ".......CWc......",
        ".......CWc......",
        "...C...CWc......",
        "..CCc..CCc...C..",
        "..CWc..CCc..CCc.",
        "..CWc.cCCcc.CWc.",
        "..CCccCCCccCCCc.",
        "..cCccCCCccCCcc.",
        "...CcccCccccCc..",
        "..gGGGGGGGGGGGg.",
        ".gGLGGGGLGGGGGGg",
        "gGGGGGGGGGGGGGGg",
      ],
      [ // cuadro 2
        "................",
        "..........W.....",
        "........C.......",
        ".......CCc......",
        ".......CCc......",
        "....W..CCc......",
        "...C...CCc......",
        "..CCc..CWc...C..",
        "..CCc..CWc..CCc.",
        "..CCc.cCWcc.CCc.",
        "..CWccCCCccCCWc.",
        "..cCccCCCccCCcc.",
        "...CcccCccccCc..",
        "..gGGGGGGGGGGGg.",
        ".gGLGGGGLGGGGGGg",
        "gGGGGGGGGGGGGGGg",
      ],
    ]},
  },
};
