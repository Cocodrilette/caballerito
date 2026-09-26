# 7. Decisiones: si... entonces... 🤔

## `if`: si pasa algo, haz esto

Los juegos toman **decisiones** todo el tiempo:
*si* presionas Z, **entonces** salta. *Si* tocas un pincho, **entonces** pierdes una máscara.

```js
if (condición) {
  // esto pasa SOLO si la condición es verdad
}
```

En `src/jugador.js`:

```js
if (estado.vidas <= 0) {
  morir(jugador);
}
```
*"Si las vidas son 0 o menos, entonces muere."*

## Comparar cosas

| Signo | Pregunta | Ejemplo |
|---|---|---|
| `===` | ¿son iguales? | `simbolo === "$"` |
| `!==` | ¿son distintos? | `simbolo !== " "` |
| `<` | ¿es menor? | `estado.vidas < 3` |
| `>` | ¿es mayor? | `estado.geo > 10` |
| `<=` | ¿menor o igual? | `estado.vidas <= 0` |
| `>=` | ¿mayor o igual? | `estado.geo >= 100` |

⚠️ Un solo `=` **guarda** algo en una cajita. Tres `===` **pregunta** si son iguales.

## `else`: si no...

```js
if (estado.geo >= 50) {
  // eres rico 💰
} else {
  // sigue buscando geo
}
```

Y puedes encadenar varias preguntas con `else if`, como en `src/niveles.js`:

```js
if (simbolo === "=") {
  // crear suelo
} else if (simbolo === "-") {
  // crear plataforma
} else if (simbolo === "^") {
  // crear pinchos
}
```

## Y, o, no

| Signo | Significa | Ejemplo |
|---|---|---|
| `&&` | **y** (las dos cosas) | `cerca && isButtonPressed("arriba")` |
| `\|\|` | **o** (cualquiera) | `hayPared \|\| hayBorde` |
| `!` | **no** (al revés) | `!jugador.vivo` |

En `src/escenas/interacciones.js`, la banca:
```js
if (cerca && isButtonPressed("arriba")) descansar(nivel, estado, banca);
```
*"Si estás cerca **y** presionas ↑, descansas."*

En `src/enemigos/gusano.js`:
```js
return hayPared || hayBorde;
```
*"El gusano se voltea si hay pared **o** si se acaba el suelo."*

## Teclas: preguntar por los botones

| Función | Pregunta |
|---|---|
| `isButtonPressed("saltar")` | ¿Se **acaba de presionar** en este cuadro? (una vez) |
| `isButtonDown("derecha")` | ¿Está **presionado ahora**? (todo el rato) |

Los nombres de los botones y sus teclas están en `BOTONES` en `src/config.js`.

## 🧪 Experimento

En `src/jugador.js`, busca la función `correr`. Mira estas líneas:

```js
if (isButtonDown("izquierda")) direccion -= 1;
if (isButtonDown("derecha")) direccion += 1;
```

¿Qué pasa si cambias el `-=` por `+=` en la primera? 🙃
(¡Se invierten los controles! Devuélvelo después.)

➡️ [Capítulo 8](08-cada-cuadro.md)
