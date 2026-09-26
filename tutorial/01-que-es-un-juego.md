# 1. ¿Qué es un juego? 🎮

## Un juego es como un libro de dibujos que pasa muy rápido

¿Alguna vez hiciste dibujos en las esquinas de un cuaderno y los pasaste
rápido para que se muevan? **Un videojuego hace exactamente eso.**

La computadora dibuja la pantalla, cambia un poquito las cosas, y la vuelve a
dibujar. ¡**60 veces cada segundo**! Cada dibujo se llama un **cuadro**
(en inglés, *frame*).

```
cuadro 1        cuadro 2        cuadro 3
   🗡️              🗡️              🗡️
  (x=10)         (x=12)          (x=14)     ← el caballerito avanza 2 píxeles cada cuadro
```

En cada cuadro, el juego hace siempre lo mismo:

1. 👀 **Mirar** qué teclas estás presionando.
2. 🧠 **Pensar**: mover al caballerito, mover a los enemigos, ver si algo chocó.
3. 🎨 **Dibujar** todo en la pantalla.

Y otra vez. Y otra vez. Esto se llama el **bucle del juego** (*game loop*).

## Píxeles: los cuadritos de la pantalla

La pantalla está hecha de cuadritos de colores diminutos llamados **píxeles**.
Nuestro juego usa una pantalla pequeñita de **480 píxeles de ancho** y
**270 de alto**, y luego la agranda para que se vea bien y con estilo retro.

Cada bloque de roca mide **16 × 16 píxeles**. El caballerito mide 16 de ancho
y 24 de alto.

> 🔍 Mira `src/config.js`. ¿Encuentras `TAMAÑO_BLOQUE`, `ANCHO_PANTALLA` y `ALTO_PANTALLA`?

## Coordenadas: la dirección de cada cosa

Para saber **dónde** está algo, usamos dos números: **x** e **y**.

```
(0,0) ────────── x crece hacia la DERECHA ──────────▶
  │
  │         🗡️  ← este caballerito está en x=100, y=50
  │
  y crece hacia ABAJO  (¡al revés que en el colegio!)
  │
  ▼
```

- **x** = qué tan a la derecha.
- **y** = qué tan **abajo**. ⚠️ En los juegos, y crece hacia abajo.

Por eso, para **saltar** hay que ir hacia y **negativa** (hacia arriba), y la
**gravedad** empuja hacia y **positiva** (hacia abajo).

## Velocidad y gravedad

- **Velocidad**: cuántos píxeles se mueve algo cada segundo.
  Si `VELOCIDAD = 120`, el caballerito recorre 120 píxeles por segundo.
- **Gravedad**: una fuerza que, cada cuadro, empuja todo un poquito más
  rápido hacia abajo. Por eso cuando saltas subes, te frenas y vuelves a caer.

## 🧪 Experimento

Juega y fíjate:
1. ¿Cuántos bloques de alto puedes saltar?
2. ¿Qué pasa si mantienes **Z** apretada, comparado con tocarla rapidito?
3. Cuando saltas, ¿subes a la misma velocidad todo el tiempo, o te vas frenando?

En el próximo capítulo vamos a abrir el código. ➡️ [Capítulo 2](02-herramientas.md)
