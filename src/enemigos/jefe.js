// JEFE: EL GRAN ESCARABAJO
// Duerme hasta que te acercas. Luego repite sus trucos:
//   1. EMBESTIR: corre hacia ti muy rápido.
//   2. SALTAR: brinca para caerte encima.
//   3. PAUSA: se cansa y descansa. ¡Es tu momento de pegarle!
// Cuando le queda la mitad de la vida... ¡SE ENFURECE!
//   Se pone rojo, va más rápido, a veces embiste dos veces seguidas
//   y al caer de un salto lanza ONDAS DE CHOQUE por el suelo. ¡Sáltalas!
import {
  TAMAÑO_BLOQUE,
  JEFE_VIDA,
  JEFE_VELOCIDAD_EMBESTIDA,
  JEFE_FUERZA_SALTO,
  JEFE_TIEMPO_PAUSA,
  JEFE_DISTANCIA_DESPERTAR,
  JEFE_FURIA_RAPIDEZ,
  JEFE_VELOCIDAD_ONDA,
  GEO_JEFE,
  GRAVEDAD,
  ANCHO_PANTALLA,
  ALTO_PANTALLA,
  LETRA_CHICA,
} from "../config.js";
import { tocarMusica, efecto } from "../audio/sonido.js";
import { ponerAnimacion, chispas } from "../ayudas.js";
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
      furioso: false, // ¿ya se enojó?
      embestidaDoble: false, // ¿ya va en su segunda embestida?
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

  // Es tan grande que atraviesa las plataformas delgadas.
  // (¡Súbete a una para esquivar sus ondas!)
  jefe.onBeforePhysicsResolve((choque) => {
    if (choque.target.is("plataforma")) choque.preventResolution();
  });

  jefe.onUpdate(() => {
    const jugador = nivel.jugador;
    if (!jugador) return;
    jefe.reloj += dt();

    // ¿Le queda la mitad de la vida? ¡Se enfurece!
    const mitad = jefe.vida <= JEFE_VIDA / 2;
    if (mitad && !jefe.furioso && jefe.truco !== "dormido" && jefe.isGrounded()) {
      jefe.furioso = true;
      shake(10);
      efecto("jefe_golpe");
      cambiarTruco(jefe, "enfurecerse");
    }

    if (jefe.truco === "dormido") {
      jefe.vel.x = 0;
      if (jugador.pos.dist(jefe.pos) < JEFE_DISTANCIA_DESPERTAR) {
        tocarMusica("jefe");
        shake(6);
        barra = crearBarraDeVida(nivel, jefe);
        cambiarTruco(jefe, "pausa");
      }
    } else if (jefe.truco === "enfurecerse") {
      enfurecerse(jefe, nivel);
    } else if (jefe.truco === "pausa") {
      descansar(jefe, jugador);
    } else if (jefe.truco === "embestir") {
      embestir(jefe, nivel, jugador);
    } else if (jefe.truco === "saltar") {
      saltar(jefe, nivel);
    }
    jefe.flipX = jefe.direccion < 0;

    // Enojado se ve rojo (menos cuando parpadea por un golpe).
    if (jefe.furioso && jefe.tiempoGolpeado <= 0 && jefe.truco !== "enfurecerse") {
      jefe.color = rgb(255, 150, 140);
    }
  });

  return jefe;
}

function cambiarTruco(jefe, truco) {
  jefe.truco = truco;
  jefe.reloj = 0;
}

// Enojado hace todo más rápido.
function rapidez(jefe) {
  return jefe.furioso ? JEFE_FURIA_RAPIDEZ : 1;
}

// ENFURECERSE: tiembla, parpadea en rojo y ruge. ¡Cuidado, viene lo bueno!
function enfurecerse(jefe, nivel) {
  ponerAnimacion(jefe, "embestir");
  jefe.vel.x = 0;
  jefe.direccion = nivel.jugador.pos.x < jefe.pos.x ? -1 : 1; // te mira fijo
  jefe.pos.x += Math.sin(time() * 90) * 1.2; // ¡tiembla de rabia!
  jefe.color = Math.floor(time() * 16) % 2 === 0 ? rgb(255, 60, 60) : rgb(255, 255, 255);
  if (Math.floor(jefe.reloj * 10) % 3 === 0) {
    chispas(nivel.mundo, jefe.pos.sub(0, 16), 1, "#ff6060");
  }
  if (jefe.reloj > 1.2) {
    shake(6);
    cambiarTruco(jefe, "pausa");
  }
}

// PAUSA: se queda quieto (¡pégale!) y luego elige su siguiente truco.
function descansar(jefe, jugador) {
  ponerAnimacion(jefe, jefe.tiempoGolpeado > 0 ? "herido" : "quieto");
  jefe.vel.x = jefe.empujon;
  if (jefe.reloj < JEFE_TIEMPO_PAUSA / rapidez(jefe)) return;

  jefe.direccion = jugador.pos.x < jefe.pos.x ? -1 : 1;
  jefe.embestidaDoble = false;
  if (chance(0.5)) {
    cambiarTruco(jefe, "embestir");
  } else {
    // Salta hacia donde estás tú.
    const tiempoEnElAire = (2 * JEFE_FUERZA_SALTO) / GRAVEDAD;
    const distancia = jugador.pos.x - jefe.pos.x;
    const maximo = 220 * rapidez(jefe);
    jefe.jump(JEFE_FUERZA_SALTO);
    jefe.velocidadSalto = clamp(distancia / tiempoEnElAire, -maximo, maximo);
    jefe.estabaEnElAire = false;
    cambiarTruco(jefe, "saltar");
  }
}

// EMBESTIR: primero tiembla (¡aviso!), luego corre hasta chocar.
function embestir(jefe, nivel, jugador) {
  ponerAnimacion(jefe, "embestir");
  const aviso = jefe.furioso ? 0.35 : 0.5;
  if (jefe.reloj < aviso) {
    jefe.vel.x = 0;
    jefe.pos.x += Math.sin(time() * 80) * 0.6; // temblorcito de aviso
    return;
  }
  jefe.vel.x = jefe.direccion * JEFE_VELOCIDAD_EMBESTIDA * rapidez(jefe);

  // ¿Llegó a la pared?
  const B = TAMAÑO_BLOQUE;
  const columnaAdelante = Math.floor((jefe.pos.x + jefe.direccion * 20) / B);
  const filaPies = Math.floor((jefe.pos.y - 4) / B);
  const filaCabeza = Math.floor((jefe.pos.y - 28) / B);
  const hayPared = nivel.esRoca(columnaAdelante, filaPies) || nivel.esRoca(columnaAdelante, filaCabeza);
  if (hayPared || jefe.reloj > 3) {
    shake(5);
    jefe.vel.x = 0;
    // Enojado, a veces se da la vuelta y ¡embiste otra vez!
    if (jefe.furioso && !jefe.embestidaDoble && chance(0.5)) {
      jefe.embestidaDoble = true;
      jefe.direccion = jugador.pos.x < jefe.pos.x ? -1 : 1;
      cambiarTruco(jefe, "embestir");
    } else {
      cambiarTruco(jefe, "pausa");
    }
  }
}

// SALTAR: vuela por el aire y ¡PUM! aterriza.
function saltar(jefe, nivel) {
  ponerAnimacion(jefe, "quieto");
  if (!jefe.isGrounded()) {
    jefe.estabaEnElAire = true;
    jefe.vel.x = jefe.velocidadSalto;
  } else if (jefe.estabaEnElAire) {
    shake(8);
    jefe.vel.x = 0;
    if (jefe.furioso) {
      // ¡PUM! Dos ondas de choque, una para cada lado.
      crearOnda(nivel, jefe.pos.x - 18, jefe.pos.y, -1);
      crearOnda(nivel, jefe.pos.x + 18, jefe.pos.y, 1);
    }
    cambiarTruco(jefe, "pausa");
  }
}

// ONDA DE CHOQUE: una ola bajita que corre por el suelo. ¡Salta por encima!
function crearOnda(nivel, x, y, direccion) {
  const B = TAMAÑO_BLOQUE;
  const onda = nivel.mundo.add([
    rect(12, 9, { radius: 3 }),
    pos(x, y),
    anchor("bot"),
    area(),
    color(255, 140, 70),
    outline(1, rgb(90, 20, 10)),
    opacity(1),
    z(7),
    "enemigo", // tocarla duele
    "onda",
    { vida: 3 },
  ]);

  onda.onUpdate(() => {
    onda.pos.x += direccion * JEFE_VELOCIDAD_ONDA * dt();
    onda.vida -= dt();
    onda.opacity = 0.7 + Math.sin(time() * 30) * 0.3; // brilla
    // Se deshace al chocar con una pared o si se acaba el suelo.
    const col = Math.floor((onda.pos.x + direccion * 6) / B);
    const fila = Math.floor((onda.pos.y - 4) / B);
    const hayPared = nivel.esRoca(col, fila);
    const hayPiso = nivel.esPiso(col, fila + 1);
    if (hayPared || !hayPiso || onda.vida <= 0) {
      chispas(nivel.mundo, onda.pos.sub(0, 4), 4, "#ff8c46");
      destroy(onda);
    }
  });
  return onda;
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
    if (jefe.furioso) relleno.color = rgb(255, 110, 40); // ¡furioso!
  });
  return barra;
}
