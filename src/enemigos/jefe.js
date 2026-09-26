// JEFE: EL GRAN ESCARABAJO
// Duerme hasta que te acercas. Luego repite sus trucos:
//   1. EMBESTIR: corre hacia ti muy rápido.
//   2. SALTAR: brinca para caerte encima.
//   3. PAUSA: se cansa y descansa. ¡Es tu momento de pegarle!
import {
  TAMAÑO_BLOQUE,
  JEFE_VIDA,
  JEFE_VELOCIDAD_EMBESTIDA,
  JEFE_FUERZA_SALTO,
  JEFE_TIEMPO_PAUSA,
  JEFE_DISTANCIA_DESPERTAR,
  GEO_JEFE,
  GRAVEDAD,
  ANCHO_PANTALLA,
  ALTO_PANTALLA,
  LETRA_CHICA,
} from "../config.js";
import { tocarMusica } from "../audio/sonido.js";
import { ponerAnimacion } from "../ayudas.js";
import { volverEnemigo } from "./comun.js";

export function crearJefe(nivel, x, y) {
  const jefe = nivel.mundo.add([
    sprite("jefe", { anim: "quieto" }),
    pos(x, y),
    anchor("bot"),
    area({ scale: vec2(0.85, 0.9) }),
    body({ mass: 10 }),
    color(),
    z(6),
    "enemigo",
    "jefe",
    {
      truco: "dormido", // qué está haciendo ahora
      reloj: 0, // cuánto tiempo lleva haciéndolo
      direccion: -1,
      estabaEnElAire: false,
    },
  ]);

  let barra = null;
  volverEnemigo(jefe, nivel, {
    vida: JEFE_VIDA,
    geo: GEO_JEFE,
    sonido: "jefe_golpe",
    pesado: true,
    alMorir: () => {
      if (barra) destroy(barra);
      shake(12);
      if (nivel.alDerrotarJefe) nivel.alDerrotarJefe();
    },
  });

  jefe.onUpdate(() => {
    const jugador = nivel.jugador;
    if (!jugador) return;
    jefe.reloj += dt();

    if (jefe.truco === "dormido") {
      jefe.vel.x = 0;
      if (jugador.pos.dist(jefe.pos) < JEFE_DISTANCIA_DESPERTAR) {
        tocarMusica("jefe");
        shake(6);
        barra = crearBarraDeVida(nivel, jefe);
        cambiarTruco(jefe, "pausa");
      }
    } else if (jefe.truco === "pausa") {
      descansar(jefe, jugador);
    } else if (jefe.truco === "embestir") {
      embestir(jefe, nivel);
    } else if (jefe.truco === "saltar") {
      saltar(jefe);
    }
    jefe.flipX = jefe.direccion < 0;
  });

  return jefe;
}

function cambiarTruco(jefe, truco) {
  jefe.truco = truco;
  jefe.reloj = 0;
}

// PAUSA: se queda quieto (¡pégale!) y luego elige su siguiente truco.
function descansar(jefe, jugador) {
  ponerAnimacion(jefe, jefe.tiempoGolpeado > 0 ? "herido" : "quieto");
  jefe.vel.x = jefe.empujon;
  if (jefe.reloj < JEFE_TIEMPO_PAUSA) return;

  jefe.direccion = jugador.pos.x < jefe.pos.x ? -1 : 1;
  if (chance(0.5)) {
    cambiarTruco(jefe, "embestir");
  } else {
    // Salta hacia donde estás tú.
    const tiempoEnElAire = (2 * JEFE_FUERZA_SALTO) / GRAVEDAD;
    const distancia = jugador.pos.x - jefe.pos.x;
    jefe.jump(JEFE_FUERZA_SALTO);
    jefe.velocidadSalto = clamp(distancia / tiempoEnElAire, -220, 220);
    jefe.estabaEnElAire = false;
    cambiarTruco(jefe, "saltar");
  }
}

// EMBESTIR: primero tiembla (¡aviso!), luego corre hasta chocar.
function embestir(jefe, nivel) {
  ponerAnimacion(jefe, "embestir");
  if (jefe.reloj < 0.5) {
    jefe.vel.x = 0;
    jefe.pos.x += Math.sin(time() * 80) * 0.6; // temblorcito de aviso
    return;
  }
  jefe.vel.x = jefe.direccion * JEFE_VELOCIDAD_EMBESTIDA;

  // ¿Llegó a la pared?
  const B = TAMAÑO_BLOQUE;
  const columnaAdelante = Math.floor((jefe.pos.x + jefe.direccion * 20) / B);
  const fila = Math.floor((jefe.pos.y - 4) / B);
  if (nivel.esRoca(columnaAdelante, fila) || jefe.reloj > 3) {
    shake(5);
    jefe.vel.x = 0;
    cambiarTruco(jefe, "pausa");
  }
}

// SALTAR: vuela por el aire y ¡PUM! aterriza.
function saltar(jefe) {
  ponerAnimacion(jefe, "quieto");
  if (!jefe.isGrounded()) {
    jefe.estabaEnElAire = true;
    jefe.vel.x = jefe.velocidadSalto;
  } else if (jefe.estabaEnElAire) {
    shake(8);
    jefe.vel.x = 0;
    cambiarTruco(jefe, "pausa");
  }
}

// La barra de vida abajo de la pantalla.
function crearBarraDeVida(nivel, jefe) {
  const ancho = 200;
  const barra = nivel.mundo.add([
    pos(ANCHO_PANTALLA / 2 - ancho / 2, ALTO_PANTALLA - 22),
    fixed(),
    z(100),
  ]);
  barra.add([text("GRAN ESCARABAJO", { size: LETRA_CHICA }), pos(0, -10), color(230, 220, 200)]);
  barra.add([rect(ancho + 2, 8), pos(-1, -1), color(10, 10, 20)]);
  const relleno = barra.add([rect(ancho, 6), color(220, 60, 60)]);
  barra.onUpdate(() => {
    relleno.width = Math.max(0, (jefe.vida / JEFE_VIDA) * ancho);
  });
  return barra;
}
