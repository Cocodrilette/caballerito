// LA CÁMARA
// Sigue al caballerito con suavidad, sin mostrar lo que hay fuera del mapa.
import { ANCHO_PANTALLA, ALTO_PANTALLA, SUAVIDAD_CAMARA } from "../config.js";

export function seguirConCamara(nivel) {
  const dondeMirar = () => limitar(nivel.jugador.pos.sub(0, 20), nivel);
  let camara = dondeMirar(); // al empezar, la cámara salta directo
  setCamPos(camara);

  onUpdate(() => {
    if (!nivel.jugador || nivel.mundo.paused) return;
    const suavidad = Math.min(1, dt() * SUAVIDAD_CAMARA);
    camara = camara.lerp(dondeMirar(), suavidad);
    // Redondeamos para que los píxeles se vean nítidos.
    setCamPos(vec2(Math.round(camara.x), Math.round(camara.y)));
  });
}

// No dejar que la cámara se salga de los bordes del mapa.
function limitar(punto, nivel) {
  const mitadAncho = ANCHO_PANTALLA / 2;
  const mitadAlto = ALTO_PANTALLA / 2;
  const x = nivel.ancho <= ANCHO_PANTALLA ? nivel.ancho / 2 : clamp(punto.x, mitadAncho, nivel.ancho - mitadAncho);
  const y = nivel.alto <= ALTO_PANTALLA ? nivel.alto / 2 : clamp(punto.y, mitadAlto, nivel.alto - mitadAlto);
  return vec2(x, y);
}
