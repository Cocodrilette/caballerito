// HABILIDAD: SALTAR
// Mientras más tiempo mantienes el botón, más alto saltas.
import { FUERZA_SALTO, FRENO_SALTO, TIEMPO_COYOTE, TIEMPO_RECUERDO_SALTO } from "../config.js";
import { efecto } from "../audio/sonido.js";

export function usarSalto(jugador) {
  let tiempoSinSuelo = 0; // cuánto hace que dejó de pisar el suelo
  let tiempoDesdeBoton = 99; // cuánto hace que se presionó saltar
  let subiendoPorSalto = false; // ¿va subiendo porque saltó?

  jugador.onUpdate(() => {
    if (!jugador.vivo) return;

    // "Tiempo coyote": como el coyote de los dibujos, puedes saltar
    // un instante después de salirte del borde.
    tiempoSinSuelo = jugador.isGrounded() ? 0 : tiempoSinSuelo + dt();
    tiempoDesdeBoton += dt();

    if (isButtonPressed("saltar")) {
      // ↓ + saltar sobre una plataforma: te bajas de ella.
      const plataforma = jugador.curPlatform();
      if (isButtonDown("abajo") && plataforma && plataforma.is("plataforma")) {
        jugador.tiempoAtravesando = 0.25;
        return;
      }
      tiempoDesdeBoton = 0;
    }

    const puedeSaltar = tiempoSinSuelo < TIEMPO_COYOTE && jugador.enDash <= 0;
    if (tiempoDesdeBoton < TIEMPO_RECUERDO_SALTO && puedeSaltar) {
      jugador.jump(FUERZA_SALTO);
      efecto("salto");
      tiempoDesdeBoton = 99;
      tiempoSinSuelo = 99;
      subiendoPorSalto = true;
    }

    // Si sueltas el botón mientras subes, el salto se corta.
    if (subiendoPorSalto && !isButtonDown("saltar") && jugador.vel.y < 0) {
      jugador.vel.y *= FRENO_SALTO;
      subiendoPorSalto = false;
    }
    if (jugador.vel.y >= 0) subiendoPorSalto = false;
  });
}
