// LA PAUSA
// Escape o P para pausar. En la pausa, M quita o pone el sonido.
import { ANCHO_PANTALLA, ALTO_PANTALLA, LETRA_CHICA, LETRA_MEDIANA, LETRA_GRANDE } from "../config.js";
import { silenciar } from "../audio/sonido.js";

let estaMudo = false; // se recuerda entre niveles
const CENTRO = ANCHO_PANTALLA / 2;

export function prepararPausa(mundo) {
  const panel = add([pos(0, 0), fixed(), z(200)]);
  panel.hidden = true;
  panel.add([rect(ANCHO_PANTALLA, ALTO_PANTALLA), color(0, 0, 0), opacity(0.7)]);
  panel.add([text("PAUSA", { size: LETRA_GRANDE }), pos(CENTRO, 50), anchor("center")]);

  const textoSonido = panel.add([
    text("", { size: LETRA_MEDIANA }),
    pos(CENTRO, 100),
    anchor("center"),
    color(255, 230, 140),
  ]);
  panel.add([
    text("Escape o P: seguir jugando", { size: LETRA_MEDIANA }),
    pos(CENTRO, 130),
    anchor("center"),
  ]);
  panel.add([
    text("Z saltar   X atacar   C dash\n↓ + X en el aire: ¡pogo!\n↑ en la banca: descansar", {
      size: LETRA_CHICA,
      align: "center",
      lineSpacing: 4,
    }),
    pos(CENTRO, 178),
    anchor("top"),
    color(180, 190, 220),
  ]);

  const actualizarTexto = () => {
    textoSonido.text = estaMudo ? "M: prender sonido" : "M: quitar sonido";
  };

  onButtonPress("pausa", () => {
    mundo.paused = !mundo.paused; // congela todo lo que hay en el mundo
    panel.hidden = !mundo.paused;
    actualizarTexto();
  });

  onKeyPress("m", () => {
    if (!mundo.paused) return;
    estaMudo = !estaMudo;
    silenciar(estaMudo);
    actualizarTexto();
  });
}
