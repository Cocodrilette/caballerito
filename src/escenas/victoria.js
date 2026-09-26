// PANTALLA DE VICTORIA: ¡lo lograste!
import { ANCHO_PANTALLA, ALTO_PANTALLA, LETRA_CHICA, LETRA_MEDIANA, LETRA_GRANDE } from "../config.js";
import { tocarMusica } from "../audio/sonido.js";
import { crearFondo } from "./fondo.js";
import { chispas } from "../ayudas.js";
import { personajeElegido } from "../personaje.js";

const CENTRO = ANCHO_PANTALLA / 2;

export function escenaVictoria({ geo = 0 } = {}) {
  setCamPos(ANCHO_PANTALLA / 2, ALTO_PANTALLA / 2);
  crearFondo("#101830");
  tocarMusica("menu");

  add([text("¡GANASTE!", { size: LETRA_GRANDE }), pos(CENTRO, 80), anchor("center"), color(255, 230, 140)]);
  add([
    text(personajeElegido().victoria, { size: LETRA_MEDIANA }),
    pos(CENTRO, 120),
    anchor("center"),
  ]);
  add([sprite("icono_geo"), pos(CENTRO - 30, 150), anchor("center"), scale(2)]);
  add([text(String(geo), { size: LETRA_MEDIANA }), pos(CENTRO - 14, 150), anchor("left"), color(240, 230, 200)]);
  add([
    text("Presiona Z para volver al inicio", { size: LETRA_CHICA }),
    pos(CENTRO, 206),
    anchor("top"),
    color(170, 180, 210),
  ]);

  // Fuegos artificiales de chispas.
  const cielo = add([]);
  loop(0.5, () => {
    chispas(cielo, vec2(rand(60, ANCHO_PANTALLA - 60), rand(30, 120)), 12, "#ffe9a8");
  });

  wait(0.5, () => {
    onButtonPress("saltar", () => go("titulo"));
    onKeyPress("enter", () => go("titulo"));
  });
}
