# ⭐ RETOS DE CABALLERITO ⭐

30 desafíos, del más fácil al más difícil. ¡Márcalos cuando los termines
cambiando `[ ]` por `[x]`!

**Cómo funciona cada reto:**
- 🎯 **Misión:** lo que tienes que lograr.
- 📂 **Archivos:** dónde buscar.
- 💡 **Pistas:** ayuditas si te atascas. ¡Intenta primero sin ellas!
- ✅ **¿Funcionó?:** cómo saber que lo lograste.
- 🔓 **Solución:** escondida. Ábrela solo si ya lo intentaste mucho.

> 📸 Después de cada reto: `git add .` y `git commit -m "reto N: lo que hice"`

---

## 🥚 NIVEL HUEVITO: cambiar números y textos

### [ ] Reto 1: Saltar en la Luna 🌙
🎯 Haz que el caballerito salte como si estuviera en la Luna.
📂 `src/config.js`
💡 Busca `GRAVEDAD`. ¿Más grande o más pequeña?
✅ Saltas altísimo y caes despacito.

<details><summary>🔓 Solución</summary>

```js
export const GRAVEDAD = 400;
```
</details>

### [ ] Reto 2: Súper caballerito 💪
🎯 Dale **8 máscaras** de vida y haz que corra **el doble** de rápido.
📂 `src/config.js`
💡 Hay dos perillas: una para las vidas y otra para correr. "El doble" de 120 es...
✅ Ves 8 máscaras arriba y corres rapidísimo.

<details><summary>🔓 Solución</summary>

```js
export const VELOCIDAD = 240;
export const VIDAS_MAXIMAS = 8;
```
</details>

### [ ] Reto 3: Tu nombre en el juego ✍️
🎯 Cambia el título grande "CABALLERITO" de la pantalla de inicio por tu nombre.
📂 `src/escenas/titulo.js`
💡 Usa **Ctrl + F** para buscar `"CABALLERITO"`. Cambia solo lo que está entre comillas.
Si tu nombre es muy largo, ¡puede que no quepa! Máximo unas 18 letras.
✅ Tu nombre aparece gigante al abrir el juego.

<details><summary>🔓 Solución</summary>

```js
add([text("JUANITO", { size: LETRA_GRANDE }), pos(CENTRO, 32), anchor("center"), color(235, 240, 255)]);
```
</details>

### [ ] Reto 4: Renombra la cueva 🏷️
🎯 Cambia el nombre del nivel 1 y su consejo amarillo.
📂 `niveles/nivel1.json`
💡 Busca `"nombre"` y `"consejo"`. Los textos van entre comillas.
✅ Al empezar el juego aparece tu nombre de cueva y tu consejo.

<details><summary>🔓 Solución</summary>

```json
"nombre": "La Cueva de Rei",
"consejo": "¡Recoge todas las monedas!",
```
</details>

### [ ] Reto 5: Cueva de colores 🎨
🎯 Cambia el color del fondo del nivel 1 a un morado oscuro.
📂 `niveles/nivel1.json`
💡 Busca `"fondo"`. Los colores se escriben `#RRGGBB`. Prueba `#2a0a3a`.
Busca en internet "color picker" para elegir cualquier color.
✅ La cueva se ve morada.

<details><summary>🔓 Solución</summary>

```json
"fondo": "#2a0a3a",
```
</details>

### [ ] Reto 6: El jefe gigante... ¡de papel! 🪲
🎯 Haz que el jefe muera con 3 golpes y que suelte **100** geo.
📂 `src/config.js`
💡 Busca las perillas que empiezan con `JEFE_` y `GEO_`.
✅ Prueba abriendo `http://localhost:5173/?nivel=jefe`.

<details><summary>🔓 Solución</summary>

```js
export const JEFE_VIDA = 3;
export const GEO_JEFE = 100;
```
</details>

---

## 🐛 NIVEL GUSANITO: editor, dibujos y música

### [ ] Reto 7: Tu primer nivel 🗺️
🎯 Crea un nivel en el Taller de Niveles y juégalo.
📂 `http://localhost:5173/editor.html`
💡 Presiona **Nuevo**. Pinta suelo, plataformas, monedas y al menos un gusano.
No olvides el **@** (inicio) y la **>** (puerta). Luego **▶ ¡JUGAR!**
✅ Puedes jugar tu nivel de principio a fin.

### [ ] Reto 8: Conéctalo a la aventura 🔗
🎯 Haz que al terminar el nivel 3 llegues a TU nivel, y que tu nivel lleve al jefe.
📂 Taller de Niveles + `niveles/nivel3.json`
💡
1. En el taller, en "🚪 La puerta lleva a…" escribe `jefe`. Presiona **💾 Guardar en el juego** (ponle un nombre, por ejemplo `mi_nivel`).
2. Abre `niveles/nivel3.json` y cambia su `"siguiente"` por `"mi_nivel"`.
✅ Juega el nivel 3 (`?nivel=nivel3`), pasa la puerta... ¡y aparece tu nivel!

<details><summary>🔓 Solución</summary>

En `niveles/nivel3.json`:
```json
"siguiente": "mi_nivel",
```
Y en `niveles/mi_nivel.json` debe decir `"siguiente": "jefe"`.
</details>

### [ ] Reto 9: Nivel escrito a mano ⌨️
🎯 Crea un nivel **solo escribiendo letras**, sin pintar con el mouse.
📂 Taller de Niveles → **📝 Ver como texto**
💡 Recuerda: todas las filas del mismo largo. Usa espacios para el aire.
✅ Presiona **Dibujar** y ves tu nivel dibujado. ¡Juégalo!

### [ ] Reto 10: Capa nueva 🧥
🎯 Cambia el color de la capa del caballerito a rojo.
📂 `src/sprites/paleta.js`
💡 Busca la letra `A` ("azul capa") y `N` ("sombra de la capa").
Prueba `"#a02030"` y `"#601018"`.
✅ El caballerito tiene capa roja. (Mira también `/herramientas/ver-sprites.html`.)

<details><summary>🔓 Solución</summary>

```js
A: "#a02030",   // capa roja
N: "#601018",   // sombra de la capa
```
⚠️ Ojo: otros dibujos que usan `A` o `N` también cambian. ¡Revisa la galería!
</details>

### [ ] Reto 11: Pinta píxel por píxel 🖌️
🎯 Cambia el dibujo del gusano: ponle ojos más grandes, o cámbiale el color del caparazón.
📂 `src/sprites/gusano.js`
💡 Cada letra es un píxel. `W` es blanco, `K` es negro, `P` es el caparazón.
Cambia letras **sin cambiar el largo de la fila**. Hazlo en los 2 cuadros de la animación.
✅ Tu gusano nuevo camina por la cueva. Si te equivocas en el largo, el juego te dice qué fila revisar.

### [ ] Reto 12: Tu propia canción 🎵
🎯 Compón una canción y ponla en tu nivel.
📂 `src/musica/` y `src/musica/LEEME.md`
💡
1. Copia `cueva.js` y llámalo `mi_cancion.js`.
2. Cambia `nombre: "cueva"` por `nombre: "mi_cancion"`.
3. Cambia las notas. ¿Conoces "Estrellita"? `C4 C4 G4 G4 A4 A4 G4 - F4 F4 E4 E4 D4 D4 C4 -`
4. Escúchala en `/herramientas/probar-sonidos.html`.
5. En el Taller, elige tu canción en "Música" y guarda el nivel.
✅ Tu canción suena cuando juegas tu nivel.

---

## 🦗 NIVEL GRILLO: cambiar un poquito de código

### [ ] Reto 13: Salto con otro sonido 🔊
🎯 Haz que el salto suene más agudo, como un resorte: *¡boing!*
📂 `src/audio/efectos.js`
💡 Busca `salto:`. Cambia `frecuenciaFinal` a un número más grande, como `1500`.
¿Y si cambias `onda` por `"sine"` o `"sawtooth"`?
✅ Escúchalo en `/herramientas/probar-sonidos.html` o saltando.

<details><summary>🔓 Solución</summary>

```js
salto: {
  onda: "sine", frecuenciaInicial: 200, frecuenciaFinal: 1500,
  duracion: 0.2, volumen: 0.25,
},
```
</details>

### [ ] Reto 14: Teclas a tu gusto ⌨️
🎯 Haz que también se pueda atacar con la tecla **F**.
📂 `src/config.js` → `BOTONES`
💡 Cada botón tiene una lista de teclas. Agrega `"f"` a la lista de `atacar`.
✅ Presionas F y el caballerito ataca.

<details><summary>🔓 Solución</summary>

```js
atacar: { keyboard: ["x", "k", "f"], gamepad: ["west"] },
```
</details>

### [ ] Reto 15: Monedas de oro puro 🪙
🎯 Haz que cada moneda valga **5** geo, usando una perilla nueva en `config.js`.
📂 `src/config.js` y `src/escenas/interacciones.js`
💡
1. En `config.js` crea tu perilla: `export const VALOR_MONEDA = 5;`
2. En `interacciones.js` busca `estado.geo += 1;`
3. Cambia el `1` por tu perilla. ¡Tienes que **importarla** arriba del archivo!
✅ Cada moneda suma 5.

<details><summary>🔓 Solución</summary>

En `src/config.js`:
```js
export const VALOR_MONEDA = 5; // cuánto geo vale cada moneda
```
En `src/escenas/interacciones.js`, arriba:
```js
import { VIDAS_MAXIMAS, LETRA_CHICA, TAMAÑO_BLOQUE, VALOR_MONEDA } from "../config.js";
```
Y en las monedas:
```js
estado.geo += VALOR_MONEDA;
```
</details>

### [ ] Reto 16: Monedas temblorosas y de colores ✨
🎯 Haz que al recoger una moneda la pantalla tiemble un poquito y que las chispas sean verdes.
📂 `src/escenas/interacciones.js`
💡 `shake(2)` sacude la pantalla. En la línea de `chispas(...)`, el último valor es el color.
✅ ¡Tin! 📳 ✨ verde.

<details><summary>🔓 Solución</summary>

```js
chispas(nivel.mundo, moneda.pos, 4, "#50ff80");
shake(2);
destroy(moneda);
```
</details>

### [ ] Reto 17: Mosquito gigante 🦟
🎯 Haz que los mosquitos sean el doble de grandes.
📂 `src/enemigos/mosquito.js`
💡 Recuerda el capítulo 5: hay una pieza de LEGO que cambia el tamaño.
Agrégala en la lista de `add([ ... ])`.
✅ Mosquitos enormes en el nivel 2.

<details><summary>🔓 Solución</summary>

```js
const mosquito = nivel.mundo.add([
  sprite("mosquito", { anim: "volar" }),
  pos(x, y),
  scale(2),              // ← ¡nuevo!
  anchor("center"),
  ...
```
</details>

### [ ] Reto 18: ¡Felicidades por 10 geo! 🎉
🎯 Cuando juntes 10 geo o más, aparece un mensaje grande "¡10 geo!" que se desvanece.
📂 `src/escenas/interacciones.js`
💡 Dentro de `jugador.onCollide("moneda", ...)` usa un `if`.
Para que salga solo una vez, guarda en `estado` que ya lo mostraste.
Para desvanecer: `opacity(1)` y en `onUpdate` réstale un poquito cada cuadro.
✅ Al llegar a 10 geo aparece el mensaje una sola vez.

<details><summary>🔓 Solución</summary>

Arriba, importa también `LETRA_MEDIANA`:
```js
import { VIDAS_MAXIMAS, LETRA_CHICA, LETRA_MEDIANA, TAMAÑO_BLOQUE } from "../config.js";
```
Dentro de `jugador.onCollide("moneda", ...)`, después de `destroy(moneda);`:
```js
if (estado.geo >= 10 && !estado.avisoDiez) {
  estado.avisoDiez = true; // ya lo mostramos
  const aviso = add([
    text("¡10 geo!", { size: LETRA_MEDIANA }),
    pos(width() / 2, 60),
    anchor("top"),
    opacity(1),
    fixed(),
    z(200),
  ]);
  aviso.onUpdate(() => {
    aviso.opacity -= dt() * 0.5;
    if (aviso.opacity <= 0) destroy(aviso);
  });
}
```
⚠️ Nuestra letra de píxeles no tiene emojis. ¡Usa solo letras y signos!
</details>

### [ ] Reto 19: La banca generosa (¡y la trampa!) 🪑
🎯 Parte A: haz que descansar en una banca te regale 5 geo.
Parte B: ¿descubriste la trampa? (¡Puedes descansar mil veces!) Arréglala: cada banca regala geo **solo una vez**.
📂 `src/escenas/interacciones.js` → función `descansar`
💡 Parte B: guarda algo en la banca misma, como `banca.yaRegalo = true`, y pregunta con un `if`.
✅ La primera vez recibes 5 geo; las demás, no.

<details><summary>🔓 Solución</summary>

En `function descansar(nivel, estado, banca)`:
```js
if (!banca.yaRegalo) {
  estado.geo += 5;
  banca.yaRegalo = true;
}
```
🧠 Esto es algo que los programadores hacen todo el tiempo: pensar
"¿cómo podría alguien hacer trampa?" y arreglarlo.
</details>

### [ ] Reto 20: Rei es más rápida 🐶💨
🎯 Haz que Rei corra un 30% más rápido que el caballerito.
📂 `src/jugador.js` → función `correr`
💡 `jugador.dibujo` es `"rei"` o `"caballero"`. Usa un `if`, o este truco:
`condición ? siEsVerdad : siEsFalso`
✅ Con Rei llegas más rápido a todos lados.

<details><summary>🔓 Solución</summary>

Cambia la línea `jugador.vel.x = direccion * VELOCIDAD + jugador.empujon;` por:
```js
const rapidez = jugador.dibujo === "rei" ? VELOCIDAD * 1.3 : VELOCIDAD;
jugador.vel.x = direccion * rapidez + jugador.empujon;
```
</details>

---

## 🦂 NIVEL ESCORPIÓN: escribir código nuevo

### [ ] Reto 21: ¡Doble salto! 🦘🦘
🎯 Que se pueda saltar otra vez en el aire (una vez por salto).
📂 `src/config.js` y `src/habilidades/saltar.js`
💡
1. Crea la perilla `SALTOS_EXTRA = 1` en `config.js`.
2. En `saltar.js`, crea un contador `let saltosExtra = SALTOS_EXTRA;`
3. Cuando toca el suelo, el contador se llena otra vez.
4. Si presionas saltar, **no** puedes hacer un salto normal y te quedan saltos extra... ¡salta!
✅ Presionas Z dos veces y subes mucho más alto. (Con `SALTOS_EXTRA = 5`... ¡vuelas!)

<details><summary>🔓 Solución</summary>

En `src/config.js`:
```js
export const SALTOS_EXTRA = 1; // saltos que puedes dar en el aire
```
En `src/habilidades/saltar.js`, importa `SALTOS_EXTRA` arriba:
```js
import { FUERZA_SALTO, FRENO_SALTO, TIEMPO_COYOTE, TIEMPO_RECUERDO_SALTO, SALTOS_EXTRA } from "../config.js";
```
Debajo de `let subiendoPorSalto = false;`:
```js
let saltosExtra = SALTOS_EXTRA; // saltos que te quedan en el aire
```
Debajo de `tiempoDesdeBoton += dt();`:
```js
if (jugador.isGrounded()) saltosExtra = SALTOS_EXTRA;
```
Y justo después del `if` del salto normal (el que termina con `subiendoPorSalto = true; }`),
agrega un `else if`:
```js
} else if (tiempoDesdeBoton === 0 && saltosExtra > 0 && jugador.enDash <= 0) {
  // ¡Salto en el aire!
  saltosExtra -= 1;
  jugador.jump(FUERZA_SALTO * 0.85);
  efecto("salto");
  tiempoDesdeBoton = 99;
  subiendoPorSalto = true;
}
```
🧠 `tiempoDesdeBoton === 0` solo es verdad en el cuadro exacto en que presionaste saltar.
</details>

### [ ] Reto 22: Un enemigo nuevo: el Caracol 🐌
🎯 Crea un enemigo **Caracol**: lento, pero aguanta 4 golpes. Se pone en los mapas con la letra `c`.
📂 Son 5 pasos en 5 archivos (¡así se hace en los juegos de verdad!):
💡
1. **Dibujo:** copia `src/sprites/gusano.js` como `src/sprites/caracol.js`. Cambia `nombre: "gusano"` por `nombre: "caracol"` y los colores `P` y `p`.
2. **Perillas:** en `config.js` agrega `CARACOL_VELOCIDAD = 15` y `CARACOL_VIDA = 4`.
3. **Comportamiento:** copia `src/enemigos/gusano.js` como `src/enemigos/caracol.js`. Cambia `gusano` por `caracol` en todos lados (**Ctrl + H** reemplaza) y usa tus perillas nuevas.
4. **Leyenda:** en `src/leyenda.js` agrega una línea para la letra `c`.
5. **Construir:** en `src/niveles.js` importa `crearCaracol` y agrega un `else if` para `"c"`.
✅ El caracol aparece solito en el Taller de Niveles. ¡Ponlo en un nivel y pelea con él!

<details><summary>🔓 Solución</summary>

`src/config.js`:
```js
export const CARACOL_VELOCIDAD = 15;
export const CARACOL_VIDA = 4;
```
`src/enemigos/caracol.js` (copia de gusano.js con los cambios):
```js
// CARACOL
// Lento, pero muy duro.
import { TAMAÑO_BLOQUE, CARACOL_VELOCIDAD, CARACOL_VIDA } from "../config.js";
import { volverEnemigo } from "./comun.js";

export function crearCaracol(nivel, x, y) {
  const caracol = nivel.mundo.add([
    sprite("caracol", { anim: "caminar" }),
    pos(x, y),
    anchor("bot"),
    area({ scale: vec2(0.8, 0.8) }),
    body(),
    color(),
    z(5),
    "enemigo",
    { direccion: -1 },
  ]);
  volverEnemigo(caracol, nivel, { vida: CARACOL_VIDA });

  caracol.onUpdate(() => {
    if (caracol.isGrounded() && hayQueVoltear(caracol, nivel)) {
      caracol.direccion *= -1;
    }
    caracol.vel.x = caracol.direccion * CARACOL_VELOCIDAD + caracol.empujon;
    caracol.flipX = caracol.direccion < 0;
  });

  return caracol;
}

// (copia aquí también la función hayQueVoltear de gusano.js, cambiando gusano por caracol)
```
`src/leyenda.js`, dentro de la lista:
```js
{ simbolo: "c", nombre: "Caracol", sprite: "caracol", tipo: "enemigo", color: "#c9a0dc", descripcion: "Lento, pero aguanta muchos golpes." },
```
`src/niveles.js`, arriba:
```js
import { crearCaracol } from "./enemigos/caracol.js";
```
Y en la lista de `else if`:
```js
} else if (simbolo === "c") {
  crearCaracol(nivel, x + B / 2, y + B);
```
</details>

### [ ] Reto 23: Máscara curativa ❤️
🎯 Un objeto nuevo, letra `+`: una máscara flotante que te devuelve una vida.
📂 `src/leyenda.js`, `src/objetos.js`, `src/niveles.js`, `src/escenas/interacciones.js`
💡
1. Leyenda: letra `+`, sprite `"mascara_llena"`, tipo `"objeto"`.
2. `objetos.js`: una función `crearMascara` (copia `crearMoneda`) con la etiqueta `"mascara_extra"`.
3. `niveles.js`: un `else if` para `"+"`.
4. `interacciones.js`: `jugador.onCollide("mascara_extra", ...)` suma 1 a `estado.vidas`.
5. Extra: ¡haz que flote subiendo y bajando con `Math.sin(time())`!
✅ Te lastiman, tocas la máscara y recuperas una vida.

<details><summary>🔓 Solución</summary>

`src/leyenda.js`:
```js
{ simbolo: "+", nombre: "Máscara", sprite: "mascara_llena", tipo: "objeto", color: "#ffffff", descripcion: "Te devuelve una máscara de vida." },
```
`src/objetos.js`, al final:
```js
// Máscara extra: flota y te devuelve una vida.
export function crearMascara(mundo, x, y) {
  const mascara = mundo.add([
    sprite("mascara_llena"),
    pos(x, y),
    anchor("center"),
    area(),
    z(2),
    "mascara_extra",
    { alturaInicial: y },
  ]);
  mascara.onUpdate(() => {
    mascara.pos.y = mascara.alturaInicial + Math.sin(time() * 4) * 2;
  });
  return mascara;
}
```
`src/niveles.js`:
```js
} else if (simbolo === "+") {
  objetos.crearMascara(mundo, x + B / 2, y + B / 2);
```
`src/escenas/interacciones.js`, dentro de `conectarObjetos`:
```js
// MÁSCARAS EXTRA: ¡una vida más!
jugador.onCollide("mascara_extra", (mascara) => {
  if (estado.vidas >= VIDAS_MAXIMAS) return; // ya tienes todas: la dejamos ahí
  estado.vidas += 1;
  efecto("banca");
  chispas(nivel.mundo, mascara.pos, 8);
  destroy(mascara);
});
```
</details>

### [ ] Reto 24: ¡Rei ladra! 🐶🔊
🎯 Una habilidad solo para Rei: con la tecla **V** ladra, sale un globito "¡GUAU!" y los enemigos cercanos salen volando hacia atrás.
📂 Nuevo `src/habilidades/ladrar.js`, `src/jugador.js`, `src/config.js`, `src/audio/efectos.js`
💡
1. En `BOTONES` agrega `ladrar: { keyboard: ["v"], gamepad: ["north"] },`
2. En `efectos.js` crea un sonido `ladrido` (¡experimenta!).
3. Crea `ladrar.js` copiando la forma de `dash.js`: una función `usarLadrido(jugador)`.
4. Si `jugador.dibujo !== "rei"`, sal de la función con `return` (el caballerito no ladra).
5. Para empujar enemigos: recorre `jugador.nivel.mundo.get("enemigo")` y, a los que estén cerca
   (`enemigo.pos.dist(jugador.pos) < 70`), llama `enemigo.recibirGolpe(0, jugador.pos.x)`.
   (Daño 0 = solo empuja.)
6. En `jugador.js`, importa y llama `usarLadrido(jugador);`
✅ Con Rei, presionas V: ¡GUAU! y los gusanos retroceden.

<details><summary>🔓 Solución</summary>

`src/config.js`:
```js
export const DISTANCIA_LADRIDO = 70; // hasta dónde llega el ladrido
```
y en `BOTONES`:
```js
ladrar: { keyboard: ["v"], gamepad: ["north"] },
```
`src/audio/efectos.js`, dentro de `efectos`:
```js
// Rei ladra: ¡guau!
ladrido: [
  { onda: "sawtooth", frecuenciaInicial: 520, frecuenciaFinal: 260, duracion: 0.08, volumen: 0.25, ruido: 0.3 },
  { onda: "sawtooth", frecuenciaInicial: 480, frecuenciaFinal: 200, duracion: 0.12, volumen: 0.25, ruido: 0.3, retraso: 0.1 },
],
```
`src/habilidades/ladrar.js`:
```js
// HABILIDAD: LADRAR (¡solo Rei!)
// Un ladrido que empuja a los enemigos cercanos.
import { DISTANCIA_LADRIDO, LETRA_CHICA } from "../config.js";
import { efecto } from "../audio/sonido.js";

export function usarLadrido(jugador) {
  if (jugador.dibujo !== "rei") return; // el caballerito no ladra
  let recarga = 0;

  jugador.onUpdate(() => {
    if (!jugador.vivo) return;
    recarga -= dt();
    if (!isButtonPressed("ladrar") || recarga > 0) return;
    recarga = 1;
    efecto("ladrido");
    shake(3);

    // Un globito que dice GUAU
    const globo = jugador.nivel.mundo.add([
      text("¡GUAU!", { size: LETRA_CHICA }),
      pos(jugador.pos.x, jugador.pos.y - 30),
      anchor("bot"),
      opacity(1),
      z(30),
    ]);
    globo.onUpdate(() => {
      globo.pos.y -= 20 * dt();
      globo.opacity -= dt() * 1.5;
      if (globo.opacity <= 0) destroy(globo);
    });

    // Empuja a todos los enemigos que estén cerca (sin hacerles daño)
    for (const enemigo of jugador.nivel.mundo.get("enemigo")) {
      if (enemigo.pos.dist(jugador.pos) < DISTANCIA_LADRIDO) {
        enemigo.recibirGolpe(0, jugador.pos.x);
      }
    }
  });
}
```
`src/jugador.js`:
```js
import { usarLadrido } from "./habilidades/ladrar.js";
// ...
usarDash(jugador);
usarLadrido(jugador);
```
</details>

### [ ] Reto 25: Cronómetro ⏱️
🎯 Muestra arriba a la derecha cuánto tiempo llevas en el nivel (por ejemplo `1:07`).
📂 `src/hud.js`
💡
- Crea un texto con `fixed()` y `anchor("topright")` en `pos(width() - 10, 8)`.
- Una variable `segundos` que en cada cuadro suma `dt()`.
- Minutos = `Math.floor(segundos / 60)`. Segundos = `Math.floor(segundos % 60)`.
- Para que `7` se vea `07`: `String(numero).padStart(2, "0")`.
✅ El reloj avanza mientras juegas. ¿Cuál es tu récord en el nivel 1?

<details><summary>🔓 Solución</summary>

En `crearHud`, antes de `// Cada cuadro revisamos si algo cambió.`:
```js
// Cronómetro: cuánto tiempo llevas en el nivel.
let segundos = 0;
const reloj = add([text("0:00", { size: LETRA_CHICA }), pos(width() - 10, 8), anchor("topright"), fixed(), z(100)]);
onUpdate(() => {
  segundos += dt();
  const minutos = Math.floor(segundos / 60);
  const resto = Math.floor(segundos % 60);
  reloj.text = minutos + ":" + String(resto).padStart(2, "0");
});
```
🧠 Extra: ¿se detiene el reloj cuando pausas? ¿Cómo lo arreglarías?
(Pista: `mundo.paused`.)
</details>

### [ ] Reto 26: El Saltamontes 🦗
🎯 Otro enemigo nuevo (letra `s`): camina como el gusano pero **salta cada 2 segundos**.
📂 Igual que el reto 22.
💡
- Copia tu caracol (o el gusano) como `saltamontes.js`.
- Agrega un contador: `let tiempo = 0;` y en `onUpdate`: `tiempo += dt();`
- Si `tiempo > 2` y está en el suelo: `saltamontes.jump(300); tiempo = 0;`
- ¡Dibuja su sprite! (Puede ser verde, con patas largas.)
✅ Un bichito que salta hacia ti. ¡Cuidado!

---

## 🐉 NIVEL DRAGÓN: proyectos de programador

Estos retos son **proyectos**: pueden tomar varios días. No hay una sola
solución correcta. Planea primero en papel: *¿qué archivos necesito tocar?*

### [ ] Reto 27: La llave y la puerta cerrada 🗝️🚪
🎯 Una letra nueva `k` para una **llave**. Si un nivel tiene llave, la puerta está
**cerrada** hasta que la recojas.
💡
- Dibuja el sprite `llave` (por ejemplo 10×10).
- Las puertas ya tienen `abierta: true` (mira `crearPuerta` en `objetos.js`), y el
  código de la puerta ya revisa `if (!puerta.abierta ...)` en `interacciones.js`.
- En `niveles.js`, cuando veas `k`, crea la llave y marca `nivel.tieneLlave = true`.
- Al final de `construirNivel`, si `nivel.tieneLlave`, cierra todas las puertas (`mundo.get("puerta")`).
- Al recoger la llave (`onCollide("llave", ...)`): abre las puertas y vuelve a mostrarlas.
- ¡Mira cómo el jefe ya hace algo parecido! En `src/escenas/juego.js`, la función `prepararJefe`
  cierra y esconde las puertas (`puerta.abierta = false; puerta.hidden = true;`) y las abre al vencerlo.

### [ ] Reto 28: Habilidad escondida 🪶
🎯 Al empezar no tienes dash. Encuentras una **pluma** (letra `p`) y desde ese
momento puedes hacer dash... ¡y se guarda en tu partida!
💡
- En `dash.js`, solo deja hacer dash si `jugador.estado.tieneDash` es `true`.
- Al tocar la pluma: `estado.tieneDash = true` y muestra un mensaje "¡Aprendiste el DASH!".
- Para que se guarde: mira `src/guardado.js` y dónde se llama `guardarPartida(...)`.
  Agrega `tieneDash` a lo que se guarda, y léelo al continuar (`src/escenas/titulo.js`).
- Así funciona Hollow Knight: ¡exploras para ganar poderes!

### [ ] Reto 29: Tu propio jefe 👾
🎯 Crea un jefe nuevo con su propio dibujo, música y ataques.
💡
- Estudia `src/enemigos/jefe.js`: tiene **trucos** (`jefe.truco` puede ser `"dormido"`,
  `"embestir"`, `"saltar"` o `"pausa"`). Un jefe es una máquina que cambia de truco cada cierto tiempo.
- Dibuja su sprite (el jefe actual mide 40×32).
- Compón su música en `src/musica/`.
- Inventa un ataque nuevo: ¿lanza bolitas? (crea objetos que se mueven hacia el
  jugador y se destruyen al chocar). ¿Llama mosquitos? (`crearMosquito(nivel, x, y)`).
- Agrégalo a la leyenda con una letra nueva y hazle su arena en el Taller.

### [ ] Reto 30: El nivel secreto 🤫
🎯 Una **pared falsa** (letra `f`): se ve igual que la roca, pero se puede atravesar.
Detrás hay un pasillo secreto con geo y una puerta a un nivel secreto.
💡
- En `niveles.js`, para `f` dibuja el sprite `"suelo"` pero **no** crees paredes
  que choquen (fíjate que `crearParedes` solo usa la letra `"="`).
- Dale `z(20)` para que se dibuje **delante** del jugador: ¡así lo tapa!
- Extra: que la pared se vuelva transparente cuando la atraviesas.
- Diseña el nivel secreto en el Taller y conéctalo con `"siguiente"`.

---

## 🏆 ¿Terminaste todo?

¡Eres un programador de videojuegos! Algunas ideas para seguir:

- 🌍 **Publica tu juego** en internet para que tus amigos lo jueguen:
  `npm run build` crea la carpeta `dist/` lista para subir a GitHub Pages,
  Vercel o itch.io.
- 🧑‍🤝‍🧑 **Modo dos jugadores:** el caballerito y Rei al mismo tiempo, con teclas distintas.
- 🗺️ **Mapa del mundo:** una pantalla que muestra los niveles que ya visitaste.
- 🛒 **Tienda:** gasta tu geo en máscaras extra o en un aguijón más fuerte.
- 📖 Aprende más de Kaplay en https://kaplayjs.com

**Recuerda:** los mejores programadores no son los que nunca se equivocan,
sino los que **siguen intentando**. 💪🗡️🐶
