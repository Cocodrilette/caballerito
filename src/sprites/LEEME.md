# Los dibujos del juego

Cada archivo de esta carpeta es un dibujo. Los dibujos están hechos
con **letras**: cada letra es un cuadradito de color (un *píxel*).

```
"...W........W...",
"...WWKKWWWKKW...",
```

`W` es blanco, `K` es negro y `.` es transparente (no se pinta nada).

## Cambiar un color

Abre `paleta.js`. Ahí cada letra tiene su color:

```js
A: "#2c3a5e",   // azul capa
```

Cambia `#2c3a5e` por otro color, por ejemplo `#b03030` (rojo).
¡Ahora la capa del caballerito es roja! Todos los dibujos que usan
la letra `A` cambian.

Consejo: busca "selector de color" en internet para encontrar códigos de colores.

## Cambiar un píxel

Abre un dibujo, por ejemplo `caballero.js`, y cambia una letra por otra.
Si cambias un `.` por una `W`, aparece un píxel blanco.

## Reglas importantes

1. Todas las filas de un dibujo deben tener **el mismo largo**.
   Si borras una letra, pon otra (o un `.`) en su lugar.
2. Usa solo letras que existan en la paleta.
3. Si algo está mal, el juego te dirá qué archivo y qué fila revisar.

## Ver todos los dibujos

Con el juego encendido (`npm run dev`), abre
`http://localhost:5173/herramientas/ver-sprites.html`
para ver todos los dibujos moviéndose en grande.

## Rei, la perrita

`rei.js` es **Rei**, la perrita de la familia: carita negra, cejas canela,
orejas peludas oscuras y pelo dorado. Tiene los mismos movimientos que el
caballero, así que se puede jugar con ella. ¡Sus colores nuevos están arriba
de su archivo!
