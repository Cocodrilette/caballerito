# 6. Funciones: recetas que se repiten 📜

## ¿Qué es una función?

Una **función** es como una **receta**: una lista de pasos con un nombre.
La escribes una vez, y después la puedes usar las veces que quieras.

```js
function hacerSandwich(relleno) {
  ponerPan();
  poner(relleno);
  ponerPan();
}

hacerSandwich("queso");    // 🥪 un sándwich de queso
hacerSandwich("jamón");    // 🥪 otro de jamón
```

- `function` → "voy a escribir una receta".
- `hacerSandwich` → su nombre.
- `(relleno)` → los **ingredientes** que le pasas (se llaman *parámetros*).
- `{ ... }` → los pasos.

## Usar (llamar) una función

Para usar una función escribes su nombre y paréntesis:

```js
efecto("salto");          // 🔊 toca el sonido "salto"
tocarMusica("jefe");      // 🎵 cambia la música
shake(10);                // 📳 sacude la pantalla
```

> 🔍 Busca `shake(` con **Ctrl + Shift + F**. ¿Cuándo se sacude la pantalla?

## Funciones del juego

En `src/objetos.js` hay una receta para cada cosa:

```js
export function crearPinchos(mundo, x, y) { ... }
export function crearBanca(mundo, x, y) { ... }
export function crearMoneda(mundo, x, y) { ... }
```

Y en `src/niveles.js`, cuando el juego lee el mapa letra por letra, **llama**
la receta correcta:

```js
} else if (simbolo === "$") {
  objetos.crearMoneda(mundo, x + B / 2, y + B / 2);
}
```

*"Si la letra es `$`, usa la receta crearMoneda en esta posición."*

## Funciones que devuelven algo

Algunas recetas te **devuelven** un resultado con `return`:

```js
function doble(numero) {
  return numero * 2;
}

doble(5);   // → 10
```

En `src/ayudas.js`:
```js
export function parpadeo(rapidez = 20) {
  return Math.floor(time() * rapidez) % 2 === 0 ? 1 : 0.25;
}
```
Devuelve `1` o `0.25` alternando rapidito. Se usa para que el caballerito
parpadee cuando lo lastiman.

## `import` y `export`: compartir recetas entre archivos

- `export` = "esta receta se puede usar desde otros archivos".
- `import` = "quiero usar una receta de otro archivo".

```js
import { efecto } from "./audio/sonido.js";
```
*"Del archivo sonido.js, trae la receta `efecto`."*

## Las habilidades son funciones

Abre la carpeta `src/habilidades/`. Cada habilidad es una función:

```js
export function usarSalto(jugador) { ... }   // saltar.js
export function usarAtaque(jugador) { ... }  // atacar.js
export function usarDash(jugador) { ... }    // dash.js
```

Y en `src/jugador.js` se le "enseñan" al caballerito:

```js
usarSalto(jugador);
usarAtaque(jugador);
usarDash(jugador);
```

> 🧪 ¿Qué pasa si pones `//` delante de `usarDash(jugador);`?
> ¡Le quitaste el dash! Así puedes **apagar** partes del código sin borrarlas.

## 🧪 Experimento

En `src/ayudas.js`, en la función `chispas`, cambia `rand(40, 120)` por
`rand(100, 400)`. Golpea a un gusano. ¿Cómo salen las chispas? 💥

➡️ [Capítulo 7](07-decisiones.md)
