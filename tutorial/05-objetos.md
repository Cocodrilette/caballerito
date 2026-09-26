# 5. Objetos: armar cosas como LEGO 🧱

## Todo en el juego es un "objeto de juego"

El caballerito, cada moneda, cada gusano, cada banca... todos son **objetos
de juego**. Y se construyen como con **piezas de LEGO**.

Mira cómo se crea una moneda en `src/objetos.js`:

```js
export function crearMoneda(mundo, x, y) {
  return mundo.add([
    sprite("moneda", { anim: "girar" }),  // 🎨 se ve como el dibujo "moneda", girando
    pos(x, y),                            // 📍 está en esta posición
    anchor("center"),                     // ⊕ su posición es su centro
    area(),                               // 💥 puede chocar con cosas
    z(2),                                 // 🥞 se dibuja encima de las cosas con z menor
    "moneda",                             // 🏷️ una etiqueta con su nombre
  ]);
}
```

`add([ ... ])` significa: **"agrega al juego un objeto hecho con estas piezas"**.
Cada pieza se llama **componente**.

## Las piezas más importantes

| Pieza | Qué le da al objeto |
|---|---|
| `sprite("nombre")` | Un dibujo |
| `pos(x, y)` | Una posición |
| `area()` | Un área que choca (sin esto, ¡lo atraviesas!) |
| `body()` | Un cuerpo con **gravedad**: cae y se para en el suelo |
| `body({ isStatic: true })` | Un cuerpo que **no se mueve** (como la roca) |
| `anchor("bot")` | Su posición está en sus **pies** (`"center"` = el centro) |
| `z(10)` | Qué tan "adelante" se dibuja |
| `color(255, 0, 0)` | Lo pinta de un color (rojo, verde, azul: de 0 a 255) |
| `opacity(0.5)` | Transparencia (1 = normal, 0 = invisible) |
| `scale(2)` | Tamaño (2 = el doble) |
| `rotate(45)` | Lo gira (en grados) |
| `text("hola")` | Muestra un texto en vez de un dibujo |
| `fixed()` | Se queda quieto en la pantalla aunque la cámara se mueva |
| `"etiqueta"` | Un nombre para reconocerlo (`"enemigo"`, `"moneda"`...) |

## ¡Mira la diferencia!

Una moneda **sin** `body()` flota en el aire. Las monedas que suelta un
enemigo al morir **sí** tienen `body()`, por eso saltan y caen al suelo.
Compáralas en `src/objetos.js`: `crearMoneda` y `soltarGeo`.

## El caballerito también es LEGO

En `src/jugador.js`:

```js
const jugador = nivel.mundo.add([
  sprite(dibujo, { anim: "quieto" }),
  pos(lugar),
  anchor("bot"),
  area({ scale: vec2(0.6, 0.9) }),   // su área de choque es un poco más chica que el dibujo
  body({ maxVelocity: VELOCIDAD_MAXIMA_CAIDA }),
  opacity(1),
  z(10),
  "jugador",
  { vivo: true, mirando: 1, ... },    // datos propios del jugador
]);
```

La última pieza `{ ... }` guarda **datos propios** del objeto, como si está
vivo o hacia dónde mira.

## Hablarle a un objeto

Una vez creado, puedes cambiarle cosas escribiendo `objeto.algo`:

```js
jugador.pos.x = 100;       // moverlo
jugador.flipX = true;      // voltear el dibujo (mirar a la izquierda)
jugador.play("correr");    // cambiar la animación
jugador.jump(450);         // ¡saltar!
destroy(moneda);           // hacerlo desaparecer
```

## 🧪 Experimento

En `src/objetos.js`, dentro de `crearMoneda`, agrega la pieza `scale(2),`
debajo de `z(2),`. Guarda. ¿Cómo se ven las monedas? 🪙🪙

¿Y si agregas `color(255, 100, 100),`?

(Después quítalas, o déjalas si te gustan: ¡es tu juego!)

➡️ [Capítulo 6](06-funciones.md)
