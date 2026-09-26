// LO QUE TODOS LOS ENEMIGOS TIENEN EN COMÚN
// Recibir golpes, parpadear, retroceder y soltar geo al caer.
import { EMPUJON_ENEMIGO, GEO_POR_ENEMIGO } from "../config.js";
import { efecto } from "../audio/sonido.js";
import { chispas } from "../ayudas.js";
import { soltarGeo } from "../objetos.js";

export function volverEnemigo(enemigo, nivel, opciones = {}) {
  enemigo.nivel = nivel;
  enemigo.vida = opciones.vida ?? 2;
  enemigo.empujon = 0; // velocidad extra cuando lo golpeas
  enemigo.tiempoGolpeado = 0; // para parpadear un ratito
  const geo = opciones.geo ?? GEO_POR_ENEMIGO;
  const sonido = opciones.sonido ?? "golpe";

  enemigo.recibirGolpe = (daño, desdeX) => {
    if (enemigo.vida <= 0) return;
    enemigo.vida -= daño;
    enemigo.tiempoGolpeado = 0.25;
    efecto(sonido);
    chispas(nivel.mundo, enemigo.pos.sub(0, enemigo.height / 2), 5);

    // Retrocede hacia el lado contrario del golpe.
    const lado = enemigo.pos.x < desdeX ? -1 : 1;
    enemigo.empujon = lado * EMPUJON_ENEMIGO * (opciones.pesado ? 0.3 : 1);

    if (enemigo.vida <= 0) {
      chispas(nivel.mundo, enemigo.pos.sub(0, enemigo.height / 2), 14, "#ffe9a8");
      soltarGeo(nivel.mundo, enemigo.pos.x, enemigo.pos.y - 8, geo);
      if (opciones.alMorir) opciones.alMorir();
      destroy(enemigo);
    }
  };

  enemigo.onUpdate(() => {
    enemigo.empujon = lerp(enemigo.empujon, 0, Math.min(1, dt() * 6));
    enemigo.tiempoGolpeado -= dt();
    // Parpadeo blanco-rojo cuando lo golpeas.
    enemigo.color = enemigo.tiempoGolpeado > 0 ? rgb(255, 120, 120) : rgb(255, 255, 255);
  });

  // Los enemigos no se empujan con el jugador ni entre ellos.
  if (enemigo.onBeforePhysicsResolve) {
    enemigo.onBeforePhysicsResolve((choque) => {
      const otro = choque.target;
      if (otro.is("jugador") || otro.is("enemigo") || otro.is("moneda")) {
        choque.preventResolution();
      }
    });
  }
  return enemigo;
}
