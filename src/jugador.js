// EL CABALLERITO
// Aquí se crea al héroe: cómo corre, cómo se ve y qué pasa si lo lastiman.
// Sus habilidades (saltar, atacar, dash) están en la carpeta habilidades/.
import {
  VELOCIDAD,
  VELOCIDAD_MAXIMA_CAIDA,
  TIEMPO_INVULNERABLE,
  TIEMPO_ATURDIDO,
  EMPUJON_DAÑO,
} from "./config.js";
import { efecto } from "./audio/sonido.js";
import { ponerAnimacion, parpadeo, chispas } from "./ayudas.js";
import { usarSalto } from "./habilidades/saltar.js";
import { usarAtaque } from "./habilidades/atacar.js";
import { usarDash } from "./habilidades/dash.js";
import { personajeElegido } from "./personaje.js";

export function crearJugador(nivel, estado, lugar) {
  const dibujo = personajeElegido().sprite; // "caballero" o "rei"
  const jugador = nivel.mundo.add([
    sprite(dibujo, { anim: "quieto" }),
    pos(lugar),
    anchor("bot"), // su "pos" está en los pies
    area({ scale: vec2(0.6, 0.9) }),
    body({ maxVelocity: VELOCIDAD_MAXIMA_CAIDA }),
    opacity(1),
    z(10),
    "jugador",
    {
      dibujo,
      estado, // vidas y geo
      nivel,
      vivo: true,
      mirando: 1, // 1 = derecha, -1 = izquierda
      empujon: 0, // velocidad extra cuando algo te empuja
      tiempoInvulnerable: 0,
      tiempoAturdido: 0,
      tiempoEnSuelo: 0,
      lugarSeguro: vec2(lugar),
    },
  ]);
  nivel.jugador = jugador;

  atravesarPlataformas(jugador);
  usarSalto(jugador);
  usarAtaque(jugador);
  usarDash(jugador);

  jugador.onUpdate(() => {
    if (!jugador.vivo) return;
    correr(jugador);
    recordarLugarSeguro(jugador);
    elegirAnimacion(jugador);

    // Parpadea mientras es invulnerable.
    jugador.tiempoInvulnerable -= dt();
    jugador.opacity = jugador.tiempoInvulnerable > 0 ? parpadeo() : 1;

    // ¿Se cayó fuera del mapa? Lo regresamos.
    if (jugador.pos.y > nivel.alto + 64) {
      jugador.herir(jugador.pos.x, true);
    }
  });

  // Tocar un enemigo duele.
  jugador.onCollideUpdate("enemigo", (enemigo) => {
    jugador.herir(enemigo.pos.x);
  });

  // Tocar pinchos duele y te devuelve a un lugar seguro.
  jugador.onCollideUpdate("pinchos", (pinchos) => {
    jugador.herir(pinchos.pos.x, true);
  });

  // ¡Auch! Perder una máscara.
  jugador.herir = (desdeX, volverAlLugarSeguro = false) => {
    if (!jugador.vivo || jugador.tiempoInvulnerable > 0 || nivel.mundo.paused) return;

    estado.vidas -= 1;
    efecto("herido");
    shake(4);
    jugador.tiempoInvulnerable = TIEMPO_INVULNERABLE;
    jugador.tiempoAturdido = TIEMPO_ATURDIDO;

    if (estado.vidas <= 0) {
      morir(jugador);
      return;
    }

    if (volverAlLugarSeguro) {
      jugador.pos = vec2(jugador.lugarSeguro);
      jugador.jump(1); // saltito invisible: así el motor sabe que ya no pisa el suelo de antes
      jugador.vel = vec2(0);
      jugador.empujon = 0;
    } else {
      // Te empuja hacia el lado contrario del golpe.
      const lado = jugador.pos.x < desdeX ? -1 : 1;
      jugador.empujon = lado * EMPUJON_DAÑO;
      jugador.jump(200);
    }
  };

  return jugador;
}

// Correr a la izquierda y a la derecha.
function correr(jugador) {
  // El empujón se va gastando poco a poco.
  jugador.empujon = lerp(jugador.empujon, 0, Math.min(1, dt() * 8));
  jugador.tiempoAturdido -= dt();

  if (jugador.enDash > 0) return; // el dash maneja la velocidad

  let direccion = 0;
  if (jugador.tiempoAturdido <= 0) {
    if (isButtonDown("izquierda")) direccion -= 1;
    if (isButtonDown("derecha")) direccion += 1;
  }
  if (direccion !== 0 && jugador.atacando <= 0) jugador.mirando = direccion;

  jugador.vel.x = direccion * VELOCIDAD + jugador.empujon;
  jugador.flipX = jugador.mirando < 0;
}

// Si llevas un ratito parado en el suelo, ese lugar es "seguro".
function recordarLugarSeguro(jugador) {
  const piso = jugador.curPlatform();
  const pisaDeVerdad = piso && Math.abs(jugador.pos.y - piso.pos.y) < 2; // pies justo encima
  if (pisaDeVerdad) {
    jugador.tiempoEnSuelo += dt();
    if (jugador.tiempoEnSuelo > 0.3) jugador.lugarSeguro = vec2(jugador.pos);
  } else {
    jugador.tiempoEnSuelo = 0;
  }
}

function elegirAnimacion(jugador) {
  if (jugador.tiempoAturdido > 0) return ponerAnimacion(jugador, "herido");
  if (jugador.enDash > 0) return ponerAnimacion(jugador, "dash");
  if (jugador.atacando > 0) return ponerAnimacion(jugador, "atacar");
  if (!jugador.isGrounded()) {
    return ponerAnimacion(jugador, jugador.vel.y < 0 ? "saltar" : "caer");
  }
  if (Math.abs(jugador.vel.x) > 10) return ponerAnimacion(jugador, "correr");
  ponerAnimacion(jugador, "quieto");
}

// Las plataformas delgadas se pueden atravesar desde abajo.
// Con ↓ + saltar te bajas de ellas.
function atravesarPlataformas(jugador) {
  jugador.tiempoAtravesando = 0;
  jugador.onUpdate(() => {
    jugador.tiempoAtravesando -= dt();
  });
  jugador.onBeforePhysicsResolve((choque) => {
    const otro = choque.target;
    if (otro.is("plataforma")) {
      const vieneDeAbajo = jugador.pos.y > otro.pos.y + 10;
      if (jugador.vel.y < 0 || vieneDeAbajo || jugador.tiempoAtravesando > 0) {
        choque.preventResolution();
      }
    }
    // Los enemigos no te empujan como una pared: solo te lastiman.
    if (otro.is("enemigo") || otro.is("moneda")) choque.preventResolution();
  });
}

// Se acabaron las máscaras...
function morir(jugador) {
  jugador.vivo = false;
  jugador.vel = vec2(0);
  jugador.gravityScale = 0;
  jugador.opacity = 1;
  ponerAnimacion(jugador, "herido");
  efecto("muerte");
  shake(10);
  chispas(jugador.nivel.mundo, jugador.pos.sub(0, 12), 20);
  jugador.trigger("morir");
}
