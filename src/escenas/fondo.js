// EL FONDO DE LA CUEVA
// Capas de rocas lejanas que se mueven más despacio que tú (eso se llama
// "parallax" y hace que la cueva se vea profunda) y polvo brillante flotando.
import { ANCHO_PANTALLA, ALTO_PANTALLA, CANTIDAD_POLVO } from "../config.js";

const W = ANCHO_PANTALLA;
const H = ALTO_PANTALLA;

export function crearFondo(colorFondo = "#0b1020") {
  const base = rgb(colorFondo);
  const capaLejana = base.lerp(rgb(90, 120, 170), 0.1);
  const capaCercana = base.lerp(rgb(90, 120, 170), 0.2);

  add([
    fixed(),
    z(-100),
    {
      draw() {
        const camara = getCamPos();
        drawRect({ width: W, height: H, color: base });
        dibujarCapa(camara, 0.15, 110, capaLejana, 70);
        dibujarCapa(camara, 0.35, 70, capaCercana, 40);
      },
    },
  ]);
}

// Una capa de estalactitas (arriba) y rocas (abajo).
// "lentitud" = qué tanto se mueve con la cámara (0 = nada, 1 = igual que tú).
function dibujarCapa(camara, lentitud, separacion, tinte, tamaño) {
  const corrimientoX = (camara.x * lentitud) % separacion;
  const corrimientoY = (camara.y - H / 2) * lentitud * 0.3;
  const primera = Math.floor((camara.x * lentitud) / separacion);

  for (let i = -1; i < W / separacion + 2; i++) {
    const numero = primera + i;
    const x = i * separacion - corrimientoX;
    // Un número "al azar" pero siempre igual para cada roca.
    const azar = Math.abs(Math.sin(numero * 12.9898) * 43758.5453) % 1;
    const largo = tamaño * (0.5 + azar);

    // Estalactita colgando del techo.
    drawTriangle({
      p1: vec2(x, -20 - corrimientoY),
      p2: vec2(x + separacion * 0.5, -20 - corrimientoY),
      p3: vec2(x + separacion * 0.25, largo - corrimientoY),
      color: tinte,
    });
    // Roca redonda en el piso.
    drawCircle({
      pos: vec2(x + separacion * 0.6, H + 10 - corrimientoY),
      radius: largo * 0.6,
      color: tinte,
    });
  }
}

// Polvo brillante que flota por la cueva.
export function crearPolvo(mundo) {
  for (let i = 0; i < CANTIDAD_POLVO; i++) {
    const mota = mundo.add([
      sprite("particula"),
      pos(0, 0),
      anchor("center"),
      scale(rand(0.4, 1)),
      color(180, 220, 255),
      opacity(0),
      z(-4),
      { brillo: rand(0.2, 0.6), onda: rand(0, 6) },
    ]);
    ponerEnLaPantalla(mota);

    mota.onUpdate(() => {
      mota.pos.y -= 8 * dt(); // sube despacito
      mota.pos.x += Math.sin(time() + mota.onda) * 6 * dt();
      mota.opacity = mota.brillo * (0.6 + 0.4 * Math.sin(time() * 2 + mota.onda));

      // Si se sale de la pantalla, aparece en otro lado.
      const camara = getCamPos();
      if (Math.abs(mota.pos.x - camara.x) > W / 2 + 20 || Math.abs(mota.pos.y - camara.y) > H / 2 + 20) {
        ponerEnLaPantalla(mota);
      }
    });
  }
}

function ponerEnLaPantalla(mota) {
  const camara = getCamPos();
  mota.pos = vec2(camara.x + rand(-W / 2, W / 2), camara.y + rand(-H / 2, H / 2));
}
