// QUÉ PASA CUANDO EL CABALLERITO TOCA COSAS
// Monedas, bancas (que guardan la partida) y puertas.
import { VIDAS_MAXIMAS, LETRA_CHICA, TAMAÑO_BLOQUE } from "../config.js";
import { guardarPartida } from "../guardado.js";
import { personajeElegido } from "../personaje.js";
import { efecto } from "../audio/sonido.js";
import { chispas } from "../ayudas.js";

export function conectarObjetos(nivel, estado, alSalir) {
  const jugador = nivel.jugador;

  // MONEDAS: ¡geo para ti!
  jugador.onCollide("moneda", (moneda) => {
    estado.geo += 1;
    efecto("moneda");
    chispas(nivel.mundo, moneda.pos, 4, "#ffe9a8");
    destroy(moneda);
  });

  // BANCAS: con ↑ descansas, recuperas vida y guardas tu lugar.
  for (const banca of nivel.mundo.get("banca")) {
    banca.onUpdate(() => {
      const cerca = jugador.vivo && jugador.isColliding(banca);
      banca.pista.opacity = cerca ? 1 : 0;
      if (cerca && isButtonPressed("arriba")) descansar(nivel, estado, banca);
    });
  }

  // PUERTAS: al tocarlas pasas al siguiente nivel.
  let saliendo = false;
  jugador.onCollide("puerta", (puerta) => {
    if (!puerta.abierta || saliendo || !jugador.vivo) return;
    saliendo = true;
    efecto("puerta");
    oscurecerYLuego(alSalir);
  });
}

function descansar(nivel, estado, banca) {
  estado.vidas = VIDAS_MAXIMAS;
  estado.reaparicion = vec2(banca.pos);
  efecto("banca");
  chispas(nivel.mundo, banca.pos.sub(0, 8), 12, "#bfe6ff");

  let mensaje = "¡Descansaste!";
  if (estado.guardar) {
    guardarPartida({
      nivel: estado.nombre,
      // La banca en casillas (columna y fila del mapa).
      banca: { columna: Math.floor(banca.pos.x / TAMAÑO_BLOQUE), fila: Math.floor((banca.pos.y - 1) / TAMAÑO_BLOQUE) },
      geo: estado.geo,
      vidasMaximas: VIDAS_MAXIMAS,
      personaje: personajeElegido().sprite,
    });
    mensaje += "\n¡Partida guardada!";
  }

  const aviso = nivel.mundo.add([
    text(mensaje, { size: LETRA_CHICA, align: "center", lineSpacing: 3 }),
    pos(banca.pos.x, banca.pos.y - 72),
    anchor("top"),
    opacity(1),
    z(30),
  ]);
  aviso.onUpdate(() => {
    aviso.pos.y -= 10 * dt();
    aviso.opacity -= dt() * 0.5;
    if (aviso.opacity <= 0) destroy(aviso);
  });
}

// La pantalla se pone negra poco a poco y luego pasa algo.
export function oscurecerYLuego(accion) {
  const negro = add([rect(width(), height()), color(0, 0, 0), opacity(0), fixed(), z(300)]);
  let hecho = false;
  negro.onUpdate(() => {
    negro.opacity += dt() * 2.5;
    if (negro.opacity >= 1 && !hecho) {
      hecho = true;
      accion();
    }
  });
}
