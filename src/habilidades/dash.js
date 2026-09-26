// HABILIDAD: DASH
// Una carrerita súper rápida hacia donde miras. ¡Sirve en el aire!
import { VELOCIDAD_DASH, DURACION_DASH, RECARGA_DASH } from "../config.js";
import { efecto } from "../audio/sonido.js";

export function usarDash(jugador) {
  jugador.enDash = 0; // segundos que le quedan al dash
  jugador.dashDisponible = true; // se recarga al tocar el suelo
  let recarga = 0;

  jugador.onUpdate(() => {
    if (!jugador.vivo) return;
    recarga -= dt();
    if (jugador.isGrounded()) jugador.dashDisponible = true;

    const quiereDash = isButtonPressed("dash");
    if (quiereDash && recarga <= 0 && jugador.dashDisponible && jugador.tiempoAturdido <= 0) {
      jugador.enDash = DURACION_DASH;
      jugador.dashDisponible = false;
      recarga = RECARGA_DASH;
      efecto("dash");
      jugador.gravityScale = 0; // durante el dash no hay gravedad
    }

    if (jugador.enDash > 0) {
      jugador.enDash -= dt();
      jugador.vel = vec2(jugador.mirando * VELOCIDAD_DASH, 0); // derechito, sin caer
      dejarSombra(jugador);
      if (jugador.enDash <= 0) {
        jugador.vel.x = 0;
        jugador.gravityScale = 1;
      }
    }
  });
}

// Una sombra que se desvanece detrás del caballerito.
function dejarSombra(jugador) {
  const sombra = jugador.nivel.mundo.add([
    sprite(jugador.dibujo, { anim: "dash", flipX: jugador.flipX }),
    pos(jugador.pos),
    anchor("bot"),
    opacity(0.5),
    color(120, 180, 255),
    z(9),
  ]);
  sombra.onUpdate(() => {
    sombra.opacity -= dt() * 3;
    if (sombra.opacity <= 0) destroy(sombra);
  });
}
