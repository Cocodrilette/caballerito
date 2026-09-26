# 3. Variables: las cajitas con nombre 📦

## ¿Qué es una variable?

Una **variable** es como una **cajita con una etiqueta**. Adentro guardas algo
(un número, un texto...) y la etiqueta te dice qué es.

```js
export const VELOCIDAD = 120;
```

Leámoslo por partes:

| Parte | Significa |
|---|---|
| `export` | "Otros archivos pueden usar esta cajita" |
| `const` | "Esta cajita no cambia mientras juegas" (constante) |
| `VELOCIDAD` | La etiqueta (el nombre) |
| `=` | "Guarda adentro..." |
| `120` | Lo que guardamos |
| `;` | Fin de la instrucción (como el punto al final de una frase) |

En otro archivo, el juego **usa** la cajita escribiendo su nombre. Mira en
`src/jugador.js`:

```js
jugador.vel.x = direccion * VELOCIDAD + jugador.empujon;
```

¡Si cambias `VELOCIDAD` en `config.js`, cambia en todos lados donde se usa!
Esa es la gracia de las variables.

## Tipos de cosas que puedes guardar

### Números
```js
export const GRAVEDAD = 1400;
export const TIEMPO_ATAQUE = 0.22;   // con decimales se usa PUNTO, no coma
```

### Textos (se llaman *strings*)
Van entre comillas:
```js
export const PERSONAJE = "caballero";
```

### Verdadero o falso (se llaman *booleanos*)
```js
export const GUARDAR_PARTIDA = true;   // true = sí, false = no
```

## `const` y `let`

- `const` = la cajita **no cambia** (las perillas de `config.js`).
- `let` = la cajita **puede cambiar** mientras juegas.

En `src/habilidades/saltar.js`:
```js
let tiempoSinSuelo = 0; // cuánto hace que dejó de pisar el suelo
```
Esta cajita empieza en 0 y cambia todo el tiempo mientras el caballerito salta.

## Matemáticas

La computadora es buenísima calculando:

| Signo | Qué hace | Ejemplo |
|---|---|---|
| `+` | sumar | `estado.geo + 1` |
| `-` | restar | `estado.vidas - 1` |
| `*` | multiplicar | `direccion * VELOCIDAD` |
| `/` | dividir | `TAMAÑO_BLOQUE / 2` |

Y hay atajos:
```js
estado.geo += 1;     // es lo mismo que: estado.geo = estado.geo + 1
estado.vidas -= 1;   // es lo mismo que: estado.vidas = estado.vidas - 1
```

> 🔍 Busca con **Ctrl + Shift + F** el texto `estado.geo += 1`. ¿En qué archivo
> está? ¿Qué crees que pasa ahí? (Pista: 🪙)

## Las perillas del juego

Todo `src/config.js` son variables. Algunas para probar:

| Perilla | Prueba con | ¿Qué pasa? |
|---|---|---|
| `GRAVEDAD` | `400` | 🌙 ¡Saltas como en la Luna! |
| `FUERZA_SALTO` | `700` | 🦘 Saltas altísimo |
| `VELOCIDAD` | `250` | 💨 Corres rapidísimo |
| `VELOCIDAD_DASH` | `600` | ⚡ Dash de rayo |
| `GUSANO_VELOCIDAD` | `100` | 🐛 Gusanos locos |
| `JEFE_VIDA` | `2` | 🪲 Jefe facilito |
| `CANTIDAD_POLVO` | `200` | ✨ Mucho polvo mágico |

## 🧪 Experimento

¿Qué pasa si pones `GRAVEDAD = 0`? ¿Y `GRAVEDAD = -200`? 🤯
Después devuelve todo a como estaba (o usa `git checkout src/config.js`).

➡️ [Capítulo 4](04-listas.md)
