// EL HUD: lo que siempre ves arriba en la pantalla.
// Tus máscaras (vidas) y cuánto geo llevas.
import { VIDAS_MAXIMAS, LETRA_CHICA } from "./config.js";

export function crearHud(estado) {
  // Una máscara por cada vida. La llena tapa a la vacía.
  const llenas = [];
  for (let i = 0; i < VIDAS_MAXIMAS; i++) {
    const lugar = vec2(10 + i * 15, 8);
    add([sprite("mascara_vacia"), pos(lugar), fixed(), z(100)]);
    llenas.push(add([sprite("mascara_llena"), pos(lugar), fixed(), z(101)]));
  }

  // El contador de geo.
  add([sprite("icono_geo"), pos(10, 27), fixed(), z(100)]);
  const contador = add([
    text("0", { size: LETRA_CHICA }),
    pos(24, 27),
    color(240, 230, 200),
    fixed(),
    z(100),
  ]);

  // Cada cuadro revisamos si algo cambió.
  onUpdate(() => {
    llenas.forEach((mascara, i) => {
      mascara.hidden = i >= estado.vidas;
    });
    contador.text = String(estado.geo);
  });
}
