// LAS COSAS DEL NIVEL
// Pinchos, bancas, monedas (geo), puertas y decoraciones.
import { TAMAÑO_BLOQUE, LETRA_CHICA } from "./config.js";

const B = TAMAÑO_BLOQUE;

// Pinchos: solo la parte de abajo lastima.
export function crearPinchos(mundo, x, y) {
  return mundo.add([
    sprite("pinchos"),
    pos(x, y),
    area({ shape: new Rect(vec2(2, 7), B - 4, B - 7) }),
    "pinchos",
  ]);
}

// Banca: aquí descansas con la flecha ↑.
export function crearBanca(mundo, x, y) {
  const banca = mundo.add([
    sprite("banca"),
    pos(x + B / 2, y + B),
    anchor("bot"),
    area(),
    z(1),
    "banca",
  ]);

  // Una flechita que aparece cuando estás cerca.
  banca.pista = mundo.add([
    text("↑ descansar", { size: LETRA_CHICA }),
    pos(banca.pos.x, banca.pos.y - 24),
    anchor("bot"),
    opacity(0),
    z(30),
  ]);
  return banca;
}

// Geo: la moneda de la cueva.
export function crearMoneda(mundo, x, y) {
  return mundo.add([
    sprite("moneda", { anim: "girar" }),
    pos(x, y),
    anchor("center"),
    area(),
    z(2),
    "moneda",
  ]);
}

// Geo que salta de un enemigo al morir y cae al suelo.
export function soltarGeo(mundo, x, y, cantidad) {
  for (let i = 0; i < cantidad; i++) {
    const moneda = mundo.add([
      sprite("moneda", { anim: "girar" }),
      pos(x, y),
      anchor("center"),
      area(),
      body({ maxVelocity: 300 }),
      z(2),
      "moneda",
      "geo_suelto",
    ]);
    moneda.vel = vec2(rand(-70, 70), rand(-260, -160));
    // Las monedas no chocan con el jugador ni con otras cosas que se mueven.
    moneda.onBeforePhysicsResolve((choque) => {
      if (!choque.target.is("solido") && !choque.target.is("plataforma")) {
        choque.preventResolution();
      }
    });
    // Frenan poquito a poco en el suelo.
    moneda.onUpdate(() => {
      if (moneda.isGrounded()) moneda.vel.x *= 0.9;
    });
  }
}

// Puerta: te lleva al siguiente nivel.
export function crearPuerta(mundo, x, y) {
  return mundo.add([
    sprite("puerta"),
    pos(x + B / 2, y + B),
    anchor("bot"),
    area({ scale: vec2(0.6, 1) }),
    z(1),
    "puerta",
    { abierta: true },
  ]);
}

// Decoraciones: solo para que la cueva se vea linda.
export function crearDecoracion(mundo, simbolo, x, y) {
  const dibujo = simbolo === "*" ? "cristal" : "hongo";
  return mundo.add([
    sprite(dibujo),
    pos(x + B / 2, y + B),
    anchor("bot"),
    z(-5),
  ]);
}
