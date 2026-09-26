// PEQUEÑAS AYUDAS que usan varias partes del juego.

// Cambia la animación solo si es distinta (si no, se reiniciaría a cada rato).
export function ponerAnimacion(cosa, nombre) {
  const actual = cosa.getCurAnim();
  if (!actual || actual.name !== nombre) cosa.play(nombre);
}

// Hace que algo parpadee: visible, invisible, visible...
export function parpadeo(rapidez = 20) {
  return Math.floor(time() * rapidez) % 2 === 0 ? 1 : 0.25;
}

// Una lluvia de chispas (cuando algo muere o golpeas fuerte).
export function chispas(mundo, lugar, cantidad = 8, tinte = "#ffffff") {
  for (let i = 0; i < cantidad; i++) {
    const chispa = mundo.add([
      sprite("particula"),
      pos(lugar),
      anchor("center"),
      color(tinte),
      opacity(1),
      z(20),
      { direccion: Vec2.fromAngle(rand(0, 360)).scale(rand(40, 120)) },
    ]);
    chispa.onUpdate(() => {
      chispa.pos = chispa.pos.add(chispa.direccion.scale(dt()));
      chispa.opacity -= dt() * 2;
      if (chispa.opacity <= 0) destroy(chispa);
    });
  }
}
