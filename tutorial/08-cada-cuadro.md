# 8. Cada cuadro y cada choque ⏱️💥

## `onUpdate`: hazlo en cada cuadro

¿Recuerdas que el juego se dibuja 60 veces por segundo? `onUpdate` le dice
a un objeto: **"en cada cuadro, haz esto"**.

En `src/enemigos/gusano.js`:

```js
gusano.onUpdate(() => {
  if (gusano.isGrounded() && hayQueVoltear(gusano, nivel)) {
    gusano.direccion *= -1;               // da la vuelta
  }
  gusano.vel.x = gusano.direccion * GUSANO_VELOCIDAD + gusano.empujon;
  gusano.flipX = gusano.direccion < 0;    // mira hacia donde camina
});
```

60 veces por segundo, el gusano: revisa si tiene que voltearse, pone su
velocidad y voltea su dibujo. ¡Así parece que "piensa"!

> `() => { ... }` es una **función sin nombre**. Se la pasamos a `onUpdate`
> para que la llame en cada cuadro.

## `dt()`: el tiempo entre cuadros

`dt()` te dice **cuántos segundos pasaron desde el cuadro anterior**
(más o menos 0.016, o sea 1/60).

Se usa para contar tiempo. En `src/habilidades/dash.js`:

```js
recarga -= dt();    // cada cuadro, le quitamos el tiempo que pasó
```

Cuando `recarga` llega a 0, ¡puedes volver a hacer dash!

## Mover cosas: `vel` y `pos`

- Si el objeto tiene `body()`, cambia su **velocidad**: `objeto.vel.x = 100`.
  El motor lo mueve y lo hace chocar con las paredes.
- Si no tiene `body()`, puedes mover su **posición** directamente:
  `objeto.pos.x += 50 * dt()` (se mueve 50 píxeles por segundo).

## Eventos: cuando pase algo, avísame

Un **evento** es algo que pasa: un choque, una tecla, que alguien muere...

### `onCollide`: cuando dos cosas se tocan

En `src/escenas/interacciones.js`:

```js
jugador.onCollide("moneda", (moneda) => {
  estado.geo += 1;           // 🪙 +1 geo
  efecto("moneda");          // 🔊 ¡tin!
  chispas(nivel.mundo, moneda.pos, 4, "#ffe9a8");   // ✨
  destroy(moneda);           // la moneda desaparece
});
```

*"Cuando el jugador toque algo con la etiqueta `"moneda"`, haz esto."*

¡Por eso las etiquetas son tan importantes! `"moneda"`, `"enemigo"`,
`"pinchos"`, `"banca"`, `"puerta"`...

### `onCollideUpdate`: mientras se estén tocando

En `src/jugador.js`:
```js
jugador.onCollideUpdate("pinchos", (pinchos) => {
  jugador.herir(pinchos.pos.x, true);
});
```

### Eventos propios: `trigger` y `on`

Puedes inventar tus propios eventos. Cuando el jugador muere, `jugador.js` hace:
```js
jugador.trigger("morir");
```
Y en `src/escenas/juego.js` alguien está escuchando:
```js
jugador.on("morir", () => { /* volver a la banca */ });
```

## `wait`: espera un ratito

```js
wait(2, () => {
  // esto pasa 2 segundos después
});
```

## Buscar objetos: `get`

```js
nivel.mundo.get("enemigo")   // → una lista con TODOS los enemigos
```

## 🧪 Experimento

En el `onCollide("moneda", ...)` de `src/escenas/interacciones.js`, agrega
esta línea antes de `destroy(moneda);`:

```js
shake(2);
```

¡Ahora cada moneda sacude la pantalla! ¿Qué otra cosa podrías agregar ahí?

➡️ [Capítulo 9](09-git.md)
