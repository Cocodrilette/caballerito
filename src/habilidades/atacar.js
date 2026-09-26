// HABILIDAD: ATACAR CON EL AGUIJÓN
// Puedes pegar hacia el lado, hacia arriba (con ↑)
// y hacia abajo (con ↓, solo en el aire).
// Si pegas hacia abajo sobre un enemigo o pinchos... ¡rebotas! (pogo)
import {
  TIEMPO_ATAQUE,
  RECARGA_ATAQUE,
  DAÑO_AGUIJON,
  RETROCESO_GOLPE,
  FUERZA_POGO,
} from "../config.js";
import { efecto } from "../audio/sonido.js";

export function usarAtaque(jugador) {
  jugador.atacando = 0; // segundos que le quedan al tajo
  let recarga = 0;

  jugador.onUpdate(() => {
    if (!jugador.vivo) return;
    recarga -= dt();
    jugador.atacando -= dt();

    if (isButtonPressed("atacar") && recarga <= 0 && jugador.enDash <= 0) {
      let direccion = "lado";
      if (isButtonDown("arriba")) direccion = "arriba";
      else if (isButtonDown("abajo") && !jugador.isGrounded()) direccion = "abajo";

      crearTajo(jugador, direccion);
      jugador.atacando = TIEMPO_ATAQUE;
      recarga = RECARGA_ATAQUE;
      efecto("tajo");
    }
  });
}

// Dónde aparece el tajo según la dirección (medido desde los pies).
function lugarDelTajo(jugador, direccion) {
  if (direccion === "arriba") return jugador.pos.add(0, -34);
  if (direccion === "abajo") return jugador.pos.add(0, 8);
  return jugador.pos.add(jugador.mirando * 18, -12);
}

function crearTajo(jugador, direccion) {
  // El dibujo del tajo apunta a la derecha: lo giramos o volteamos.
  let giro = 0;
  if (direccion === "arriba") giro = -90;
  if (direccion === "abajo") giro = 90;
  const voltear = direccion === "lado" && jugador.mirando < 0;

  const tajo = jugador.nivel.mundo.add([
    sprite("tajo", { anim: "tajo", flipX: voltear }),
    pos(lugarDelTajo(jugador, direccion)),
    anchor("center"),
    rotate(giro),
    area(),
    z(11),
    "aguijon",
    { vida: TIEMPO_ATAQUE, yaRebote: false },
  ]);

  // El tajo sigue al caballerito y luego desaparece.
  tajo.onUpdate(() => {
    tajo.pos = lugarDelTajo(jugador, direccion);
    tajo.vida -= dt();
    if (tajo.vida <= 0) destroy(tajo);
  });

  // ¡Le pegaste a un enemigo!
  tajo.onCollide("enemigo", (enemigo) => {
    if (enemigo.recibirGolpe) enemigo.recibirGolpe(DAÑO_AGUIJON, jugador.pos.x);
    if (direccion === "lado") jugador.empujon = -jugador.mirando * RETROCESO_GOLPE;
    if (direccion === "abajo") pogo(jugador, tajo);
  });

  // Pegarle a los pinchos hacia abajo también te hace rebotar.
  tajo.onCollide("pinchos", () => {
    if (direccion === "abajo") pogo(jugador, tajo);
  });
}

// POGO: rebotar hacia arriba como un resorte.
function pogo(jugador, tajo) {
  if (tajo.yaRebote) return;
  tajo.yaRebote = true;
  jugador.jump(FUERZA_POGO);
  jugador.dashDisponible = true; // ¡premio: recuperas el dash!
  efecto("pogo");
}
